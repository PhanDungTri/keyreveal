import { Icon } from "@iconify/react";
import { ActionIcon, Group, Stack, TextInput } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { FacebookIcon, FacebookShareButton, RedditIcon, RedditShareButton, TwitterIcon, TwitterShareButton } from "react-share";

export const ShareModal = (): JSX.Element => {
	const clipboard = useClipboard({ timeout: 1000 });

	const copySharedLink = () => {
		showNotification({
			message: "Shared link copied",
			color: "green",
			icon: <Icon icon="bx:check" />,
		});

		clipboard.copy(window.location.href);
	};

	return (
		<Stack>
			<Group position="center">
				<FacebookShareButton url={window.location.href} hashtag="#keyreveal" quote="Hey buddies! Enjoy this awesome giveaway!">
					<FacebookIcon size={48} />
				</FacebookShareButton>
				<TwitterShareButton url={window.location.href} hashtags={["keyreveal"]} title="Hey buddies! Enjoy this awesome giveaway!">
					<TwitterIcon size={48} />
				</TwitterShareButton>
				<RedditShareButton url={window.location.href} title="Hey buddies! Enjoy this awesome giveaway!">
					<RedditIcon size={48} />
				</RedditShareButton>
			</Group>
			<TextInput
				description="Or send this link to your friends"
				rightSection={
					<ActionIcon color={clipboard.copied ? "green" : "gray"} onClick={copySharedLink}>
						<Icon icon={clipboard.copied ? "bx:check" : "bxs:save"} />
					</ActionIcon>
				}
				defaultValue={window.location.href}
				readOnly
			/>
		</Stack>
	);
};
