import { Icon } from "@iconify/react";
import { Button, Card, Center, ColorSwatch, createStyles, Group, Progress, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { KeyStatus } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useCaptchaModal } from "../../../hooks";
import { GetKey, GetRandomKey } from "../../../models";
import { FeedbackActions } from "./FeedbackActions";
import { KeyStatusBadge } from "../../../components";

type Props = {
	keys: GetKey[];
	onPull: (captchaToken: string | null) => Promise<GetRandomKey | undefined>;
	onReport: (index: number) => (status: KeyStatus) => Promise<KeyStatus | null>;
};

const useStyles = createStyles(({ colors, spacing }) => ({
	keyContent: {
		padding: spacing.xs,
		borderRadius: spacing.xs,
		border: `2px solid ${colors.dark[0]}`,
		userSelect: "none",
	},
}));

export const RandomPuller = ({ keys, onPull, onReport }: Props): JSX.Element => {
	const openCaptchaModal = useCaptchaModal();
	const { colors } = useMantineTheme();
	const { classes } = useStyles();
	const [loading, setLoading] = useState(false);
	const [pulledKey, setPulledKey] = useState<GetRandomKey>();
	const unrevealed = keys.filter((key) => key.status === KeyStatus.Mystic).length;
	const spoiled = keys.filter((key) => key.status === KeyStatus.Spoiled).length;
	const broken = keys.filter((key) => key.status !== KeyStatus.Claimed && key.status !== KeyStatus.Mystic && key.status !== KeyStatus.Spoiled).length;
	const unavailable = keys.length - unrevealed - spoiled;
	const allowSendFeedback = pulledKey?.status === KeyStatus.Mystic || pulledKey?.status === KeyStatus.Spoiled;

	const requestRandomKey = async (captchaToken: string | null) => {
		try {
			const key = await onPull(captchaToken);

			setPulledKey(key);
		} catch (e) {
			if (axios.isAxiosError(e)) {
				showNotification({
					title: "Failed to pull key",
					message: e.response?.data.message,
					color: "red",
					icon: <Icon icon="bx:x" />,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCaptchaModalClose = () => setLoading(false);

	const handleReport = (index: number) => async (status: KeyStatus) => {
		const st = await onReport(index)(status);

		if (st && pulledKey) setPulledKey({ ...pulledKey, status: st });
	};

	const pullKey = () => {
		setLoading(true);
		openCaptchaModal(requestRandomKey, handleCaptchaModalClose);
	};

	return (
		<>
			<Card>
				<Stack>
					<Title order={5} mb="xs">
						<Icon icon="bxs:game" inline /> What will you get?
					</Title>
					<Progress
						size="xl"
						radius="xl"
						sections={[
							{ value: (unrevealed * 100) / keys.length, color: "green" },
							{ value: (spoiled * 100) / keys.length, color: "yellow" },
							{ value: (unavailable * 100) / keys.length, color: "red" },
						]}
					/>
					<Group position="center" spacing="xl">
						<Group spacing="xs">
							<ColorSwatch color={colors.green[6]} size={12} />
							<Text size="xs">{unrevealed} unrevealed</Text>
						</Group>
						<Group spacing="xs">
							<ColorSwatch color={colors.yellow[6]} size={12} />
							<Text size="xs">{spoiled} spoiled</Text>
						</Group>
						<Group spacing="xs">
							<ColorSwatch color={colors.red[6]} size={12} />
							<Text size="xs">
								{unavailable} unavailable ({broken} broken)
							</Text>
						</Group>
					</Group>
					<Center>
						<Button
							loading={loading}
							disabled={unrevealed + spoiled === 0}
							variant="gradient"
							gradient={{ from: "pink", to: "yellow" }}
							size="md"
							onClick={pullKey}
						>
							Pull
						</Button>
					</Center>
				</Stack>
			</Card>
			{pulledKey && (
				<Card>
					<Stack align="center">
						<Text size="sm" weight={500}>
							<Icon icon="bxs:gift" inline /> Here is your key! Enjoy!
						</Text>
						{pulledKey.status === KeyStatus.Spoiled && (
							<Text size="sm" color="yellow">
								<Icon icon="bxs:error" inline /> This key has been <KeyStatusBadge status={KeyStatus.Spoiled} /> already
							</Text>
						)}
						<Text size="sm" weight={500} className={classes.keyContent}>
							{pulledKey.key}
						</Text>
						{allowSendFeedback && <FeedbackActions onReport={handleReport(pulledKey.index)} />}
					</Stack>
				</Card>
			)}
		</>
	);
};
