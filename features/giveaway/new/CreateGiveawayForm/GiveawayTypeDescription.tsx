import { Icon } from "@iconify/react";
import { Card, Text } from "@mantine/core";
import { GiveawayType } from "@prisma/client";
import { memo } from "react";

type Props = {
	type: GiveawayType;
};

const Description = {
	[GiveawayType.Normal]: {
		Title: "Normal giveaway",
		Content: "participants can see what products are on the list and they can freely choose the product they wanted if it's still available.",
	},
	[GiveawayType.Random]: {
		Title: "Random giveaway",
		Content: "participants will pull a random key from the pool without knowing what product they will receive until the key is activated.",
	},
};

export const GiveawayTypeDescription = memo(({ type }: Props): JSX.Element => {
	return (
		<Card mb="xs">
			<Text component="span" size="sm" weight={500}>
				<Icon icon="bxs:invader" inline />
				&nbsp;{Description[type].Title}:&nbsp;
			</Text>
			<Text component="span" size="sm" color="dimmed">
				{Description[type].Content}
			</Text>
		</Card>
	);
});
