import { Icon } from "@iconify/react";
import { Card, Container, Group, Stack, Title } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { Media } from "../../components";
import { CreateGiveawayForm, GiveawaySubmitPanel } from "../../features";
import { useCaptchaModal } from "../../hooks";
import { NewGiveaway, NewGiveawayResponse } from "../../models";

const NewGiveAwayPage: NextPage = () => {
	const router = useRouter();
	const openCaptchaModal = useCaptchaModal();
	const [pub, setPub] = useState(true);
	const [posting, setPosting] = useState(false);

	const changeVisibility = (e: ChangeEvent<HTMLInputElement>) => setPub(e.currentTarget.checked);

	const postNewGiveaway = (payload: NewGiveaway) => async (captchaToken: string | null) => {
		if (!captchaToken) return;

		setPosting(true);

		showNotification({
			id: "create-giveaway",
			loading: true,
			title: "Creating giveaway",
			message: "We are preparing the party. Please wait a bit.",
			autoClose: false,
			disallowClose: true,
		});

		try {
			const {
				data: { id },
			} = await axios.post<NewGiveawayResponse>("/api/giveaway", { ...payload, public: pub, captchaToken });

			await router.push(`/giveaway/${id}`);

			updateNotification({
				id: "create-giveaway",
				color: "green",
				title: "Successfully created giveaway",
				message: "The party is ready! Share it with your friends!",
				icon: <Icon icon="bx:check" />,
				autoClose: 3000,
			});
		} catch (e) {
			setPosting(false);

			if (axios.isAxiosError(e)) {
				updateNotification({
					id: "create-giveaway",
					title: "Failed to create giveaway",
					message: e.response?.data.message,
					color: "red",
					icon: <Icon icon="bx:x" />,
				});
			}
		}
	};

	const handleSave = async (payload: Omit<NewGiveaway, "public">) => openCaptchaModal(postNewGiveaway({ ...payload, public: pub }));

	return (
		<Container size="lg" py="md">
			<Stack spacing="xs">
				<Card>
					<Group position="apart" noWrap>
						<Title order={3}>
							Hold a new giveaway <Icon icon="bxs:gift" inline />
						</Title>
						<Media greaterThanOrEqual="md">
							<GiveawaySubmitPanel isWideScreen posting={posting} defaultChecked={pub} onVisibilityChange={changeVisibility} />
						</Media>
					</Group>
				</Card>
				<CreateGiveawayForm onSubmit={handleSave} />
				<Media lessThan="md">
					<Card>
						<GiveawaySubmitPanel posting={posting} defaultChecked={pub} onVisibilityChange={changeVisibility} />
					</Card>
				</Media>
			</Stack>
		</Container>
	);
};

export default NewGiveAwayPage;
