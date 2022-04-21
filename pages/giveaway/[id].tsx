import { Icon } from "@iconify/react";
import { Alert, Badge, Button, Card, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import { GiveawayType, KeyStatus } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import produce from "immer";
import { useAtom } from "jotai";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { viewedKeysAtom } from "../../atom";
import { KeySpoiler, LockedCard, PulledRandomKeyList, RandomPuller, ShareModal } from "../../features";
import { useIsMounted } from "../../hooks";
import { GetGiveaway, GetKey, GetKeyForReveal, GetRandomKey } from "../../models";
import { getGiveaway } from "../../services";

type Props = {
	giveaway: GetGiveaway;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const giveaway = await getGiveaway(params?.id as string);

	if (!giveaway)
		return {
			notFound: true,
		};

	return {
		props: {
			giveaway: {
				...giveaway,
				createdAt: dayjs(giveaway.createdAt).format("HH:mm, MMM DD, YYYY"),
				keys: giveaway.keys.map((key) => ({
					...key,
					url: key.url ? `/link-filter?url=${key.url}` : key.url,
				})),
			},
		},
	};
};

const ViewGiveawayPage: NextPage<Props> = ({ giveaway: ga }) => {
	const isMounted = useIsMounted();
	const modals = useModals();
	const [giveaway, setGiveaway] = useState(ga);
	const [viewedKeys, setViewedKeys] = useAtom(viewedKeysAtom);
	const keys = viewedKeys[ga.id] || {};

	const checkGreedy = () => {
		if (Object.keys(keys).length >= 2) {
			showNotification({
				title: "Don't be greedy",
				message: "You have already revealed 2 keys in this giveaway.",
				icon: <Icon icon="bxs:meh-blank" />,
				color: "gray",
				autoClose: 5000,
			});

			return true;
		}

		return false;
	};

	const getKey = (index: number) => async (captchaToken: string | null) => {
		if (checkGreedy()) return;

		try {
			const { data } = await axios.get<GetKeyForReveal>(`/api/giveaway/${giveaway.id}/key/${index}?captchaToken=${captchaToken}`);

			setViewedKeys({
				...viewedKeys,
				[ga.id]: {
					...keys,
					[index]: {
						name: giveaway.keys[index].name,
						key: data.key,
						date: dayjs().format("YYYY-MM-DD"),
					},
				},
			});
		} catch (e) {
			if (axios.isAxiosError(e)) throw e; // let KeySpoiler handle the error
		}
	};

	const pullKey = async (captchaToken: string | null) => {
		if (checkGreedy()) return;

		try {
			const { data } = await axios.get<GetRandomKey>(`/api/giveaway/${giveaway.id}/key?captchaToken=${captchaToken}`);

			setViewedKeys({
				...viewedKeys,
				[ga.id]: {
					...keys,
					[data.index]: {
						name: giveaway.keys[data.index].name,
						key: data.key,
						date: dayjs().format("YYYY-MM-DD"),
					},
				},
			});

			setGiveaway(
				produce(giveaway, (draft) => {
					const k = draft.keys.find((key) => key.index === data.index);

					if (k) k.status = KeyStatus.Spoiled;
				})
			);

			return data;
		} catch (e) {
			if (axios.isAxiosError(e)) throw e; // let RandomPuller handle the error
		}
	};

	const unlock = async (password: string) => {
		const { data: keys } = await axios.post<GetKey[]>(`/api/giveaway/${giveaway.id}/unlock`, { password });

		setGiveaway({
			...giveaway,
			locked: false,
			keys,
		});
	};

	const updateStatus = (index: number) => async (status: KeyStatus) => {
		showNotification({
			id: "send-feedback",
			loading: true,
			title: "Sending your feedback",
			message: "We are noting your feedback. Please wait.",
			autoClose: false,
			disallowClose: true,
		});

		try {
			await axios.put(`/api/giveaway/${giveaway.id}/key/${index}`, { status });

			setGiveaway(
				produce(giveaway, (draft) => {
					const k = draft.keys.find((k) => k.index === index);

					if (k) k.status = status;
				})
			);

			updateNotification({
				id: "send-feedback",
				color: "green",
				title: "Feedback noted",
				message: "Thank you for your feedback. Stay happy.",
				icon: <Icon icon="bx:check" />,
			});

			return status;
		} catch (e) {
			if (axios.isAxiosError(e)) {
				if (e.response?.status === 409) {
					const { status: onServerStatus } = e.response.data;

					setGiveaway(
						produce(giveaway, (draft) => {
							const k = draft.keys.find((k) => k.index === index);

							if (k) k.status = onServerStatus as KeyStatus;
						})
					);

					return onServerStatus as KeyStatus;
				}

				updateNotification({
					id: "send-feedback",
					color: "red",
					title: "Failed to send feedback",
					message: e.response?.data.message,
					icon: <Icon icon="bx:x" />,
				});
			}

			return null;
		}
	};

	const showShareModal = () => {
		modals.openModal({
			title: "Share this giveaway",
			children: <ShareModal />,
		});
	};

	return (
		<>
			<Head>
				<title>{giveaway.title}</title>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={giveaway.title} />
				<meta property="og:description" content="Join the giveaway and explore awesome gifts!" />
				<meta property="og:image" content="/images/thumbnail.png" />
				<meta name="twitter:card" content="summary" />
				<meta property="twitter:image" content="/images/thumbnail.png" />
			</Head>
			<Container my="xl">
				<Stack spacing="xs">
					<Card>
						<Title order={3}>
							<Icon icon="bx:party" inline />
							&nbsp; {giveaway.title}
						</Title>
						<Group position="apart" mt="md">
							<Group>
								{giveaway.public ? (
									<Badge color="blue" variant="dot">
										Public
									</Badge>
								) : (
									<Badge color="gray" variant="dot">
										Private
									</Badge>
								)}
								<Button size="sm" rightIcon={<Icon icon="bxs:share" hFlip />} onClick={showShareModal} color="green" compact>
									Share
								</Button>
							</Group>
							<Text size="xs" color="dimmed">
								<Icon icon="bx:time-five" inline /> Started at {giveaway.createdAt}
							</Text>
						</Group>
					</Card>
					{giveaway.ended && (
						<Alert icon={<Icon icon="bxs:error" />} title="This giveaway has ended!" color="red" variant="filled">
							But you can still view the keys you revealed before.
						</Alert>
					)}
					<Card>
						<Title order={5} mb="xs">
							<Icon icon="bx:align-left" inline /> Description
						</Title>
						<Text size="sm">{giveaway.description ? giveaway.description : "Enjoy the party!"}</Text>
					</Card>
					{giveaway.locked ? (
						<LockedCard onUnlock={unlock} />
					) : (
						isMounted &&
						(giveaway.type === GiveawayType.Normal ? (
							<Card>
								<SimpleGrid cols={1} spacing="xl" breakpoints={[{ minWidth: 767, cols: 2 }]}>
									{giveaway.keys.map(({ index, name, status, url }) => (
										<KeySpoiler
											status={status}
											key={index}
											name={name}
											url={url}
											content={keys[index]?.key}
											ended={giveaway.ended}
											onRequestKey={getKey(index)}
											onReport={updateStatus(index)}
										/>
									))}
								</SimpleGrid>
							</Card>
						) : (
							<>
								<RandomPuller ended={giveaway.ended} keys={giveaway.keys} onPull={pullKey} onReport={updateStatus} />
								<PulledRandomKeyList keys={Object.values(keys).map(({ key }) => key)} />
							</>
						))
					)}
				</Stack>
			</Container>
		</>
	);
};

export default ViewGiveawayPage;
