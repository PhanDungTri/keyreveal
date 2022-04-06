import { Icon } from "@iconify/react";
import { Card, Center, Container, Group, MediaQuery, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { CreateGiveawayForm, GiveawaySubmitPanel } from "../../features";
import { NewGiveaway, NewGiveawayResponse } from "../../models";

const NewGiveAwayPage: NextPage = () => {
	const modals = useModals();
	const router = useRouter();
	const [pub, setPub] = useState(true);
	const [posting, setPosting] = useState(false);

	const changeVisibility = (e: ChangeEvent<HTMLInputElement>) => setPub(e.currentTarget.checked);

	const postNewGiveaway = (payload: NewGiveaway) => async (captchaToken: string | null) => {
		if (!captchaToken) return;

		setTimeout(() => modals.closeAll(), 1000);
		setPosting(true);

		showNotification({
			id: "create-giveaway",
			loading: true,
			title: "Creating giveaway...",
			message: "We are preparing the party. Please wait a bit.",
			autoClose: false,
			disallowClose: true,
		});

		try {
			const {
				data: { id },
			} = await axios.post<NewGiveawayResponse>("/api/giveaway", { ...payload, captchaToken });

			await router.push(`/giveaway/${id}`);

			updateNotification({
				id: "create-giveaway",
				color: "green",
				title: "Successfully created giveaway",
				message: "The party is ready! Share this giveaway with your friends!",
				icon: <Icon icon="bx:check" />,
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

	const handleSave = async (payload: Omit<NewGiveaway, "public">) => {
		modals.openModal({
			title: "Before continuing...",
			children: (
				<Center>
					<ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} onChange={postNewGiveaway({ ...payload, public: pub })} />
				</Center>
			),
		});
	};

	return (
		<Container size="lg" py="md">
			<Card mb="xs">
				<Group position="apart" noWrap>
					<Title order={3}>
						Hold a new giveaway <Icon icon="bxs:gift" inline />
					</Title>
					<MediaQuery query="(max-width: 767px)" styles={{ display: "none" }}>
						<GiveawaySubmitPanel isWideScreen posting={posting} defaultChecked={pub} onVisibilityChange={changeVisibility} />
					</MediaQuery>
				</Group>
			</Card>
			<CreateGiveawayForm onSubmit={handleSave} />
			<MediaQuery query="(min-width: 768px)" styles={{ display: "none" }}>
				<Card mt="xs">
					<GiveawaySubmitPanel posting={posting} defaultChecked={pub} onVisibilityChange={changeVisibility} />
				</Card>
			</MediaQuery>
		</Container>
	);
};

export default NewGiveAwayPage;
