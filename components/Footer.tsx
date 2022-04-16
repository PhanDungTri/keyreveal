import { Icon } from "@iconify/react";
import { createStyles, Stack, Text } from "@mantine/core";

const useStyles = createStyles(({ colors, spacing }) => ({
	footer: {
		backgroundColor: colors.dark[8],
		padding: spacing.md,
	},
}));

export const Footer = (): JSX.Element => {
	const { classes } = useStyles();

	return (
		<footer className={classes.footer}>
			<Stack>
				<Text align="center" color="yellow" sx={{ fontFamily: "logo", fontSize: "24px", lineHeight: 1 }}>
					KEYREVEAL
				</Text>
				<Text color="dimmed" align="center">
					Created with{" "}
					<Text component="span" color="red">
						<Icon icon="bxs:heart" inline />
					</Text>{" "}
					by{" "}
					<Text component="span" weight={700} variant="gradient" gradient={{ from: "pink", to: "yellow", deg: 45 }}>
						Phan Dung Tri
					</Text>
				</Text>
			</Stack>
		</footer>
	);
};
