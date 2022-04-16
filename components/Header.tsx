import { Icon } from "@iconify/react";
import { ActionIcon, Button, createStyles, Group, Image, keyframes, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { LogoName } from "./LogoName";
import { Media } from "./Media";
import { KeyrevealLogo } from "./svg/KeyrevealLogo";

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
	sourceCodeLink: {
		lineHeight: 1,
		textDecoration: "none",
		color: "inherit",
		height: "32px",
	},
	buyMeCoffeeButton: {
		cursor: "pointer",

		[`&:hover`]: {
			filter: "brightness(1.15)",
		},

		[`&:active`]: {
			transform: "translateY(1px)",
		},
	},
}));

export const Header = (): JSX.Element => {
	const router = useRouter();
	const { colors } = useMantineTheme();
	const { classes } = useStyles();
	const hideCreateButton = router.pathname === "/giveaway/new";

	return (
		<header>
			<Group p="sm" className={classes.header} position="apart">
				<Link href="/giveaway" passHref>
					<Group spacing="xs" className={classes.logo}>
						<KeyrevealLogo width={32} height={32} />
						<Media greaterThanOrEqual="md">
							<LogoName />
						</Media>
					</Group>
				</Link>
				<Group spacing="xl">
					<a className={classes.sourceCodeLink} href="https://github.com/PhanDungTri/keyreveal" target="_blank" rel="noreferrer">
						<Icon icon="bxl:github" width={32} height={32} />
					</a>
					<a href="https://www.buymeacoffee.com/phandungtri" target="_blank" rel="noreferrer">
						<Image
							className={classes.buyMeCoffeeButton}
							src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg"
							alt="buy-me-a-coffee-button"
							height={36}
						/>
					</a>
					{!hideCreateButton && (
						<Link href="/giveaway/new" passHref>
							<Button variant="gradient" gradient={{ from: "grape", to: "red", deg: 35 }} rightIcon={<Icon icon="bx:party" />} className={classes.createButton}>
								Create new party
							</Button>
						</Link>
					)}
				</Group>
			</Group>
			<div className={classes.bottomBorder} />
		</header>
	);
};
