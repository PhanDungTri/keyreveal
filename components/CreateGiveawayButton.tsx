import { Icon } from "@iconify/react";
import { Button, createStyles, keyframes } from "@mantine/core";
import Link from "next/link";

const shiningAnimation = keyframes({
	"0%": {
		left: "-100%",
	},
	"10%": {
		left: "100%",
	},
	"100%": {
		left: "100%",
	},
});

const useStyles = createStyles(() => ({
	createButton: {
		overflow: "hidden",

		[`&::before`]: {
			content: "''",
			position: "absolute",
			top: 0,
			left: "-100%",
			width: "100%",
			height: "100%",
			background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent)",
			animation: `${shiningAnimation} 3s ease-out infinite`,
		},
	},
}));

export const CreateGiveawayButton = (): JSX.Element => {
	const { classes } = useStyles();

	return (
		<Link href="/giveaway/new" passHref>
			<Button variant="gradient" gradient={{ from: "grape", to: "red", deg: 35 }} rightIcon={<Icon icon="bx:party" />} className={classes.createButton}>
				Create new party
			</Button>
		</Link>
	);
};
