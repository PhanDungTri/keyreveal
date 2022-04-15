import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import "../styles/globals.css";
import { MediaProvider } from "../components";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { viewedKeysAtom } from "../atom";
import { ViewedKey } from "../models";
import NextNProgress from "nextjs-progressbar";

export default function App(props: AppProps) {
	const { Component, pageProps } = props;
	const [keys, setKeys] = useAtom(viewedKeysAtom);

	useEffect(() => {
		const cleaned: Record<string, Record<number, ViewedKey>> = {};

		for (const id in keys) {
			const giveaway = keys[id];
			const cleanedGiveaway: Record<number, ViewedKey> = {};

			for (const index in giveaway) {
				const key = giveaway[index];

				if (dayjs().diff(dayjs(key.date), "day") <= 7) cleanedGiveaway[parseInt(index)] = key;
			}

			if (Object.keys(cleanedGiveaway).length > 0) cleaned[id] = cleanedGiveaway;
		}

		setKeys(cleaned);
	}, []);

	return (
		<>
			<Head>
				<title>Page title</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>

			<MediaProvider>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{
						colorScheme: "dark",
						primaryColor: "yellow",
					}}
				>
					<ModalsProvider>
						<NotificationsProvider>
							<NextNProgress color="#FAB005" />
							<Component {...pageProps} />
						</NotificationsProvider>
					</ModalsProvider>
				</MantineProvider>
			</MediaProvider>
		</>
	);
}
