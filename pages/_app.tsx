import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { useEffect } from "react";
import { viewedKeysAtom } from "../atom";
import { Footer, Header, MediaProvider } from "../components";
import { ViewedKey } from "../models";
import "../styles/globals.css";

export default function App(props: AppProps) {
	const router = useRouter();
	const [keys, setKeys] = useAtom(viewedKeysAtom);
	const { Component, pageProps } = props;
	const isLandingPage = router.pathname === "/";

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
				<title>Welcome to KEYREVEAL</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<link rel="preload" href="/fonts/logo.ttf" as="font" crossOrigin="" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="KEYREVEAL" />
				<meta property="og:description" content="Enjoy and share the fun at KEYREVEAL!" />
				<meta property="og:image" content="/images/thumbnail.png" />
				<meta name="twitter:card" content="summary" />
				<meta property="twitter:image" content="/images/thumbnail.png" />
				<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
				<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
				<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
				<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
				<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
				<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
				<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
				<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
				<link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/manifest.json" />
				<meta name="msapplication-TileColor" content="#141517" />
				<meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
				<meta name="theme-color" content="#141517" />
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
							{isLandingPage ? (
								<Component {...pageProps} />
							) : (
								<main>
									<Header />
									<Component {...pageProps} />
									<Footer />
								</main>
							)}
						</NotificationsProvider>
					</ModalsProvider>
				</MantineProvider>
			</MediaProvider>
		</>
	);
}
