import { Icon } from "@iconify/react";
import { createStyles, Text } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { Media } from "../components";

const useStyles = createStyles({
	404: {
		position: "absolute",
		transform: "translate(-50%, calc(-50% - var(--footer-height) / 2))",
		top: "50%",
		left: "50%",
		fontSize: "15rem",
		fontFamily: "logo",
	},
});

const NotFoundPage: NextPage = () => {
	const { classes } = useStyles();

	return (
		<>
			<Head>
				<title>Not found</title>
			</Head>
			<Text align="center" className={classes["404"]}>
				<Media greaterThanOrEqual="laptop">
					4<Icon icon="bx:confused" inline />4
				</Media>
				<Media lessThan="laptop">
					<Icon icon="bx:confused" inline />
				</Media>
				<Text color="dimmed">Oops! Never heard of this page!</Text>
			</Text>
		</>
	);
};

export default NotFoundPage;
