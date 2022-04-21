import { Icon } from "@iconify/react";
import { createStyles, Group, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { KeyStatus } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useCaptchaModal } from "../../../hooks";
import { FeedbackActions } from "./FeedbackActions";
import { KeyCover } from "./KeyCover";
import { KeyStatusBadge } from "../../../components";
import { ProductName } from "./ProductName";

type Props = {
	name: string;
	status: KeyStatus;
	url?: string;
	content?: string;
	ended?: boolean;
	onRequestKey: (captchaToken: string | null) => Promise<void>;
	onReport: (status: KeyStatus) => Promise<KeyStatus | null>;
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
		userSelect: "none",
	},
	linkIcon: {
		borderRadius: `0px ${radius.md}px ${radius.md}px 0px`,
	},
}));

export const KeySpoiler = ({ name, status, url, content: key = "", ended, onRequestKey, onReport }: Props): JSX.Element => {
	const openCaptchaModal = useCaptchaModal();
	const { classes, cx } = useStyles();
	const [hidden, setHidden] = useState(true);
	const [loading, setLoading] = useState(false);
	const available = (!ended && (status === KeyStatus.Mystic || status === KeyStatus.Spoiled)) || key !== "";
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

	const handleCaptchaModalClose = () => {
		setHidden(true);
		setLoading(false);
	};

	const handleReport = async (status: KeyStatus) => void onReport(status);

	const toggleKey = () => {
		if (hidden && !key) {
			setLoading(true);
			openCaptchaModal(requestKey, handleCaptchaModalClose);
		} else setHidden(!hidden);
	};

	return (
		<Stack spacing="xs">
			<Group>
				{url ? (
					<a target="_blank" href={url} rel="noopener noreferrer">
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
			{!hidden && allowSendFeedback && <FeedbackActions onReport={handleReport} />}
		</Stack>
	);
};
