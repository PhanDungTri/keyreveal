import { Icon } from "@iconify/react";
import { Alert, Badge, Card, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { GiveawayType, KeyStatus } from "@prisma/client";
import axios from "axios";
import dayjs from "dayjs";
import produce from "immer";
import { useAtom } from "jotai";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { viewedKeysAtom } from "../../atom";
import { KeySpoiler, LockedCard, RandomPuller } from "../../features";
import { PulledRandomKeyList } from "../../features/giveaway/[id]/PulledRandomKeyList";
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
	const [giveaway, setGiveaway] = useState(ga);
	const [viewedKeys, setViewedKeys] = useAtom(viewedKeysAtom);
	const keys = viewedKeys[ga.id] || {};
	const hasEnded = !giveaway.locked && giveaway.keys.every((key) => key.status !== KeyStatus.Mystic && key.status !== KeyStatus.Spoiled);

	const getKey = (index: number) => async (captchaToken: string | null) => {
		try {
			const { data } = await axios.get<GetKeyForReveal>(`/api/giveaway/${giveaway.id}/key/${index}?captchaToken=${captchaToken}`);

			setViewedKeys({
				...viewedKeys,
				[ga.id]: {
					...keys,
					[index]: {
						name: giveaway.keys[index].name,
						key: data.key,
						date: dayjs().format("DD/MM/YYYY"),
					},
				},
			});
		} catch (e) {
			if (axios.isAxiosError(e)) throw e; // let KeySpoiler handle the error
		}
	};

	const pullKey = async (captchaToken: string | null) => {
		try {
			const { data } = await axios.get<GetRandomKey>(`/api/giveaway/${giveaway.id}/key?captchaToken=${captchaToken}`);

			setViewedKeys({
				...viewedKeys,
				[ga.id]: {
					...keys,
					[data.index]: {
						name: giveaway.keys[data.index].name,
						key: data.key,
						date: dayjs().format("DD/MM/YYYY"),
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

	return (
		<Container>
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
						</Group>
						<Text size="xs" color="dimmed">
							<Icon icon="bx:time-five" inline /> Started at {giveaway.createdAt}
						</Text>
					</Group>
				</Card>
				{hasEnded && (
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
							<SimpleGrid cols={1} spacing="xl" breakpoints={[{ minWidth: 720, cols: 2 }]}>
								{giveaway.keys.map(({ index, name, status, url }) => (
									<KeySpoiler
										status={status}
										key={index}
										name={name}
										url={url}
										content={keys[index]?.key}
										onRequestKey={getKey(index)}
										onReport={updateStatus(index)}
									/>
								))}
							</SimpleGrid>
						</Card>
					) : (
						<>
							<RandomPuller keys={giveaway.keys} onPull={pullKey} onReport={updateStatus} />
							<PulledRandomKeyList keys={Object.values(keys).map(({ key }) => key)} />
						</>
					))
				)}
			</Stack>
		</Container>
	);
};

export default ViewGiveawayPage;
