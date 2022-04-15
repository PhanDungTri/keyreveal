import { createStyles, Group, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { KeyrevealLogo } from "./svg/KeyrevealLogo";

const useStyles = createStyles(({ colors }) => ({
	header: {
		backgroundColor: colors.dark[9],
	},
	bottomBorder: {
		background: `linear-gradient(to right, ${colors.lime[6]}, ${colors.yellow[6]})`,
		height: "4px",
	},
	logo: {
		cursor: "pointer",
	},
}));

export const Header = (): JSX.Element => {
	const { colors } = useMantineTheme();
	const { classes } = useStyles();

	return (
		<nav>
			<Group p="sm" className={classes.header}>
				<Link href="/giveaway" passHref>
					<KeyrevealLogo className={classes.logo} fill={colors.yellow[6]} width={40} height={40} />
				</Link>
			</Group>
			<div className={classes.bottomBorder} />
		</nav>
	);
};
