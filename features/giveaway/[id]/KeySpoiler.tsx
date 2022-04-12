import { Icon } from "@iconify/react";
import { Badge, Button, createStyles, Group, Loader, SimpleGrid, Stack, Text, Transition } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { KeyStatus } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCaptchaModal } from "../../../hooks";
import { FeedbackActions } from "./FeedbackActions";
import { KeyCover } from "./KeyCover";
import { KeyStatusBadge } from "./KeyStatusBadge";
import { ProblemReportModal } from "./ProblemReportModal";
import { ProductName } from "./ProductName";

type Props = {
	name: string;
	status: KeyStatus;
	url?: string;
	content?: string;
	inCooldown?: boolean;
	onRequestKey: (captchaToken: string | null) => Promise<void>;
	onReport: (status: KeyStatus) => Promise<void>;
};

const useStyles = createStyles(({ colors, radius, spacing }) => ({
	keyWrapper: {
		position: "relative",
		height: "2.75rem",
	},
	disabled: {
		pointerEvents: "none",
	},
	keyCover: {
		position: "relative",
		display: "flex",
		borderRadius: `${radius.md}px`,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.yellow[6],
		color: "black",
		cursor: "pointer",
		zIndex: 2,
		padding: spacing.xs,

		"&:hover": {
			backgroundColor: colors.yellow[5],
		},
	},
	keyContent: {
		position: "absolute",
		width: "100%",
		top: -1,
		border: `1px solid ${colors.yellow[6]}`,
		borderRadius: `${radius.md}px`,
		zIndex: 1,
	},
	linkIcon: {
		borderRadius: `0px ${radius.md}px ${radius.md}px 0px`,
	},
}));

export const KeySpoiler = ({ name, status, url, content: key = "", inCooldown, onRequestKey, onReport }: Props): JSX.Element => {
	const openCaptchaModal = useCaptchaModal();
	const modals = useModals();
	const { classes, cx } = useStyles();
	const [hidden, setHidden] = useState(true);
	const [loading, setLoading] = useState(false);
	const [sendingFeedback, setSendingFeedback] = useState(false);
	const available = status === KeyStatus.Mystic || status === KeyStatus.Spoiled || key !== "";
	const allowSendFeedback = status === KeyStatus.Mystic || status === KeyStatus.Spoiled;

	const requestKey = async (captchaToken: string | null) => {
		try {
			await onRequestKey(captchaToken);

			setHidden(false);
		} catch (e) {
			if (axios.isAxiosError(e)) {
				showNotification({
					title: "Failed to retrieve key",
					message: e.response?.data.message,
					color: "red",
					icon: <Icon icon="bx:x" />,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const sendFeedback = async (status: KeyStatus) => {
		setSendingFeedback(true);
		await onReport(status);
		setSendingFeedback(false);
	};

	const sendClaimedFeedback = () => sendFeedback(KeyStatus.Claimed);

	const handleCaptchaModalClose = () => {
		setHidden(true);
		setLoading(false);
	};

	const toggleKey = () => {
		if (hidden && !key) {
			if (inCooldown) {
				showNotification({
					id: "cooldown-alert",
					title: "Dude, calm down!",
					message: "You can only get a key every 20 seconds.",
					icon: <Icon icon="bx:time-five" />,
					color: "gray",
				});

				return;
			}

			setLoading(true);
			openCaptchaModal(requestKey, handleCaptchaModalClose);
		} else setHidden(!hidden);
	};

	const openProblemReportModal = () => {
		const handleSubmit = (status: KeyStatus) => {
			modals.closeModal(id);
			sendFeedback(status);
		};

		const id = modals.openModal({
			title: (
				<>
					<Icon icon="bxs:flag" inline /> Report problem
				</>
			),
			children: <ProblemReportModal onSubmit={handleSubmit} />,
		});
	};

	return (
		<Stack spacing="xs">
			<Group>
				{url ? (
					<a style={{ textDecoration: "none", color: "inherit" }} target="_blank" href={url} rel="noopener noreferrer">
						<Text size="sm" weight={500}>
							&bull; <ProductName name={name} available={available} /> <Icon icon="bx:link" inline />
						</Text>
					</a>
				) : (
					<Text size="sm" weight={500}>
						&bull; <ProductName name={name} available={available} />
					</Text>
				)}
				<KeyStatusBadge status={status} />
			</Group>
			<div className={cx(classes.keyWrapper, (loading || !available) && classes.disabled)} onClick={toggleKey}>
				<KeyCover hidden={hidden} loading={loading} available={available} />
				{key && (
					<Text py="xs" className={classes.keyContent} size="sm" sx={{ flex: 1 }} align="center">
						{key}
					</Text>
				)}
			</div>
			{!hidden && allowSendFeedback && <FeedbackActions loading={sendingFeedback} onClaim={sendClaimedFeedback} onProblemReport={openProblemReportModal} />}
		</Stack>
	);
};
