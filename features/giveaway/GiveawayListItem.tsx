import { Icon } from "@iconify/react";
import { Badge, Card, createStyles, Group, RingProgress, SimpleGrid, Text, Title, Tooltip } from "@mantine/core";
import { GiveawayType } from "@prisma/client";
import Link from "next/link";
import { GetGiveawayListItem } from "../../models";
import { pluralizeWord } from "../../utils";

type Props = {
	item: GetGiveawayListItem;
};

const useStyles = createStyles(({ colors }) => ({
	card: {
		cursor: "pointer",

		[`&:hover`]: {
			boxShadow: `inset 0px 0px 0px 1px ${colors.yellow[6]}`,
		},
	},
}));

export const GivewayListItem = ({ item }: Props): JSX.Element => {
	const { classes } = useStyles();
	const remainingPercent = (item.remainingKeys / item.totalKeys) * 100;

	return (
		<Card className={classes.card}>
			<Link href={`/giveaway/${item.id}`} passHref>
				<Group position="apart" noWrap>
					<Group>
						<Badge variant="filled" size="xs" color={item.type === GiveawayType.Normal ? "blue" : "pink"}>
							{item.type}
						</Badge>
						{item.locked && <Icon icon="bxs:lock-alt" />}
						<Title order={6}>{item.title}</Title>
					</Group>
					<Group>
						<Tooltip position="left" label={`${item.remainingKeys}  ${pluralizeWord("key", item.remainingKeys)} left`} withArrow>
							<RingProgress
								size={24}
								thickness={3}
								sections={[
									{ value: remainingPercent, color: "green" },
									{ value: 100 - remainingPercent, color: "red" },
								]}
							/>
						</Tooltip>
					</Group>
				</Group>
			</Link>
		</Card>
	);
};
