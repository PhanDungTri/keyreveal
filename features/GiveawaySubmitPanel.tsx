import { Icon } from "@iconify/react";
import { Group, Switch, Tooltip, Button, Text } from "@mantine/core";
import { ChangeEvent } from "react";

type Props = {
	isWideScreen?: boolean;
	defaultChecked?: boolean;
	posting?: boolean;
	onVisibilityChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const GiveawaySubmitPanel = ({ isWideScreen = false, defaultChecked = false, posting = false, onVisibilityChange }: Props): JSX.Element => {
	return (
		<Group position={isWideScreen ? "left" : "apart"}>
			<Group spacing="xs">
				<Switch size={isWideScreen ? "sm" : "xs"} defaultChecked={defaultChecked} onChange={onVisibilityChange} label="Everyone can enjoy" />
				<Tooltip mr="md" label="Allow this giveaway to be shown the homepage, otherwise only people with given link can participate." wrapLines width={220}>
					<Text size={isWideScreen ? "sm" : "xs"}>
						<Icon icon="bxs:info-circle" inline />
					</Text>
				</Tooltip>
			</Group>
			<Button
				size={isWideScreen ? "sm" : "xs"}
				variant="gradient"
				type="submit"
				form="new-giveaway-form"
				gradient={{ from: "grape", to: "red", deg: 35 }}
				rightIcon={<Icon icon="bx:party" />}
				loading={posting}
			>
				Let&apos;s party
			</Button>
		</Group>
	);
};
