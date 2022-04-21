import { Icon } from "@iconify/react";
import { Badge, Card, createStyles, Group, RingProgress, Title, Tooltip } from "@mantine/core";
import { GiveawayType } from "@prisma/client";
import Link from "next/link";
import { GetGiveawayListItem } from "../../models";
import { pluralizeWord } from "../../utils";

type Props = {
	item: GetGiveawayListItem;
};

type StyleProps = {
	ended: boolean;
};

const useStyles = createStyles(({ colors }, { ended }: StyleProps) => ({
	card: {
		cursor: "pointer",
		backgroundColor: ended ? colors.dark[4] : colors.dark[6],

		[`&:hover`]: {
			boxShadow: `inset 0px 0px 0px 1px ${colors.yellow[6]}`,
		},
	},
	title: {
		textDecoration: ended ? "line-through" : "unset",
		color: ended ? colors.dark[2] : colors.dark[0],
	},
}));

export const GivewayListItem = ({ item }: Props): JSX.Element => {
	const { classes } = useStyles({ ended: item.ended });
	const remainingPercent = (item.remainingKeys / item.totalKeys) * 100;

	return (
		<Card className={classes.card}>
			<Link href={`/giveaway/${item.id}`} passHref>
				<Group position="apart" noWrap>
					<Group>
						{item.ended ? (
							<Badge variant="outline" size="xs" color="red">
								Ended
							</Badge>
						) : (
							<Badge variant="filled" size="xs" color={item.type === GiveawayType.Normal ? "blue" : "pink"}>
								{item.type}
							</Badge>
						)}
						{item.locked && <Icon icon="bxs:lock-alt" />}
						<Title className={classes.title} order={6}>
							{item.title}
						</Title>
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
