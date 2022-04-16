import { Icon } from "@iconify/react";
import { Button, Card, Center, createStyles, keyframes, Stack, Text } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { KeyrevealLogo, LogoName } from "../components";

const floating = keyframes({
	"0%": {
		backgroundPosition: "0px 0px",
	},
	"100%": {
		backgroundPosition: "-10000px -4000px",
	},
});

const useStyles = createStyles(() => ({
	container: {
		position: "relative",
		width: "100vw",
		height: "100vh",
	},
	common: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	background: {
		background: "url('/images/landing-background.png') repeat 5% 5%",
		animation: `${floating} 240s linear infinite`,
	},
	midground: {
		background: "url('/images/landing-midground.png') repeat 5% 5%",
		animation: `${floating} 280s linear infinite`,
	},
	foreground: {
		background: "url('/images/landing-foreground.png') repeat 5% 5%",
		animation: `${floating} 320s linear infinite`,
	},
	goButton: {},
}));

const IndexPage: NextPage = () => {
	const { classes, cx } = useStyles();

	return (
		<div className={classes.container}>
			<div className={cx(classes.background, classes.common)}></div>
			<div className={cx(classes.midground, classes.common)}></div>
			<div className={cx(classes.foreground, classes.common)}></div>
			<Center sx={{ height: "100%" }}>
				<Card p="xl">
					<Stack align="center" mb="xl">
						<KeyrevealLogo />
						<LogoName align="center" size={40} />
						<Text size="sm" weight={500} color="dimmed" align="center">
							Ready to share and discover many awesome gifts?
						</Text>
					</Stack>
					<Card.Section>
						<Stack>
							<Link href="/giveaway" passHref>
								<Button radius={0} size="xl" variant="gradient" gradient={{ from: "grape", to: "red", deg: 35 }} rightIcon={<Icon icon="bxs:party" />}>
									TAKE ME THERE
								</Button>
							</Link>
						</Stack>
					</Card.Section>
				</Card>
			</Center>
		</div>
	);
};

export default IndexPage;
