import { Icon } from "@iconify/react";
import { Center, Container, createStyles, Text } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { Media } from "../components";

const useStyles = createStyles({
	404: {
		position: "absolute",
		transform: "translate(-50%, calc(-50% - var(--footer-height) / 2))",
		top: "50%",
		left: "50%",
		fontSize: "12rem",
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
					5<Icon icon="bx:dizzy" inline />
					<Icon icon="bx:dizzy" inline />
				</Media>
				<Media lessThan="laptop">
					<Icon icon="bx:dizzy" inline />
				</Media>
				<Text color="dimmed">Oh no! Something evil happened!</Text>
			</Text>
		</>
	);
};

export default NotFoundPage;
