import { Icon } from "@iconify/react";
import { createStyles, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";

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
			<Stack spacing="xs">
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
				<Group position="center" spacing="xs">
					<Link href="/about" passHref>
						<Text sx={{ cursor: "pointer	" }} size="xs" variant="link" color="dimmed" align="center">
							About
						</Text>
					</Link>
					&bull;
					<Link href="/guide" passHref>
						<Text sx={{ cursor: "pointer	" }} size="xs" variant="link" color="dimmed" align="center">
							Guide
						</Text>
					</Link>
					&bull;
					<Link href="/terms/disclaimer" passHref>
						<Text sx={{ cursor: "pointer	" }} size="xs" variant="link" color="dimmed" align="center">
							Disclaimer
						</Text>
					</Link>
				</Group>
			</Stack>
		</footer>
	);
};
