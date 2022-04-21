import { Icon } from "@iconify/react";
import { Burger, Button, createStyles, Drawer, Group, Image, Stack, Tooltip } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { CreateGiveawayButton } from "./CreateGiveawayButton";
import { LogoName } from "./LogoName";
import { Media } from "./Media";
import { KeyrevealLogo } from "./svg/KeyrevealLogo";

const useStyles = createStyles(({ colors }) => ({
	header: {
		backgroundColor: colors.dark[8],
	},
	bottomBorder: {
		background: `linear-gradient(to right, ${colors.pink[6]}, ${colors.yellow[6]})`,
		height: "3px",
	},
	logo: {
		cursor: "pointer",
		userSelect: "none",
	},
	githubLink: {
		lineHeight: 1,
		height: "32px",
	},
}));

export const Header = (): JSX.Element => {
	const router = useRouter();
	const { classes } = useStyles();
	const [opened, setOpened] = useState(false);
	const hideCreateButton = router.pathname === "/giveaway/new";

	const toggleDrawer = () => setOpened(!opened);

	const closeDrawer = () => setOpened(false);

	return (
		<header>
			<Group p="sm" className={classes.header} position="apart">
				<Group>
					<Link href="/giveaway" passHref>
						<Group spacing="xs" className={classes.logo}>
							<KeyrevealLogo width={32} height={32} />
							<Media greaterThanOrEqual="tablet">
								<LogoName />
							</Media>
						</Group>
					</Link>
				</Group>
				<Group spacing="xl">
					<Media greaterThanOrEqual="tablet">
						<Group spacing="xl">
							<a className={classes.githubLink} href="https://github.com/PhanDungTri/keyreveal/issues/new" target="_blank" rel="noreferrer">
								<Tooltip label="Send me a feedback">
									<Icon icon="bxs:comment-detail" width={32} height={32} />
								</Tooltip>
							</a>
							<a className={classes.githubLink} href="https://github.com/PhanDungTri/keyreveal" target="_blank" rel="noreferrer">
								<Tooltip label="Discover KEYREVEAL source code">
									<Icon icon="bxl:github" width={32} height={32} />
								</Tooltip>
							</a>
						</Group>
					</Media>
					{!hideCreateButton && <CreateGiveawayButton />}
					<Media lessThan="tablet">
						<Drawer
							opened={opened}
							onClose={closeDrawer}
							size="sm"
							padding="xs"
							title={
								<Group>
									<KeyrevealLogo width={24} height={24} />
									<LogoName size={16} />
								</Group>
							}
						>
							<Stack>
								<a className={classes.githubLink} href="https://github.com/PhanDungTri/keyreveal/issues/new" target="_blank" rel="noreferrer">
									<Button variant="subtle" leftIcon={<Icon icon="bxs:comment-detail" />}>
										Send me a feedback
									</Button>
								</a>
								<a className={classes.githubLink} href="https://github.com/PhanDungTri/keyreveal" target="_blank" rel="noreferrer">
									<Button variant="subtle" leftIcon={<Icon icon="bxl:github" />}>
										Source code
									</Button>
								</a>
							</Stack>
						</Drawer>
						<Burger opened={opened} onClick={toggleDrawer} />
					</Media>
				</Group>
			</Group>
			<div className={classes.bottomBorder} />
		</header>
	);
};
