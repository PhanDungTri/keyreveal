import { Card, Center, Code, Container, List, Tabs, Image, createStyles, Text } from "@mantine/core";
import { KeyStatus } from "@prisma/client";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { CreateGiveawayButton, KeyStatusBadge } from "../components";

const useStyles = createStyles(() => ({
	image: {
		width: "80%",
		margin: "auto",
	},
}));

const GuidePage: NextPage = () => {
	const { classes } = useStyles();

	return (
		<>
			<Head>
				<title>How to use KEYREVEAL</title>
			</Head>
			<Container my="xl">
				<Card>
					<Tabs>
						<Tabs.Tab label="How to create new giveaway">
							<List type="ordered">
								<List.Item>
									Click on <Code>Create new giveaway</Code> button in the Header.
									<Center my="md">
										<CreateGiveawayButton />
									</Center>
								</List.Item>
								<List.Item>
									Fill the form, choose the proper type of giveaway then add the keys. You can set the giveaway either public or private by toggling{" "}
									<Code>Every one can enjoy</Code>.
									<Center my="md">
										<Image className={classes.image} src="/images/guide-create-form.png" radius="md" alt="Create giveaway form" />
									</Center>
								</List.Item>
								<List.Item>
									When finish, click on <Code>Let&apos;s party</Code> button and solve the CAPTCHA. The giveaway should be ready!
								</List.Item>
							</List>
						</Tabs.Tab>
						<Tabs.Tab label="How to retrieve keys from a giveaway">
							<List spacing="xs" type="ordered">
								<List.Item>
									In the{" "}
									<Link href="/giveaway" passHref>
										<Text sx={{ cursor: "pointer" }} component="span" variant="link">
											giveaway list page
										</Text>
									</Link>
									, join any giveaway you like.
									<Image my="md" className={classes.image} src="/images/guide-giveaway-list.png" radius="md" alt="Giveaway list" />
								</List.Item>
								<List.Item>
									Currently, there are two types of giveaway:{" "}
									<Text component="span" weight={500}>
										Normal
									</Text>{" "}
									and{" "}
									<Text component="span" weight={500}>
										Random
									</Text>
									.
									<List spacing="xs" withPadding listStyleType="disc">
										<List.Item>
											With Normal giveaway, you can see what products are provided by the giveaway, you can retrieve the ones you demand.
											<Image my="md" className={classes.image} src="/images/example-giveaway.png" radius="md" alt="Normal giveaway" />
											Each key has a status belongs to it.
											<List mb="xs" withPadding>
												<List.Item>The key with no status is still unrevealed.</List.Item>
												<List.Item>
													<KeyStatusBadge status={KeyStatus.Spoiled} /> is the key that has been revealed by someone but they didn&apos;t any further
													information like if they claim the key or if the key has any problem.
												</List.Item>
												<List.Item>
													<KeyStatusBadge status={KeyStatus.Claimed} /> is the key that has been claimed by someone else.
												</List.Item>
												<List.Item>
													<KeyStatusBadge status={KeyStatus.Invalid} /> means that key is having some problems, it can&apos;t be regconized, or isn&apos;t
													belongs to any product, or has been expired.
												</List.Item>
												<List.Item>
													<KeyStatusBadge status={KeyStatus.WrongProduct} /> means the key is successfully activated but it doesn&apos;t give the product as the
													giveaway said.
												</List.Item>
											</List>
											Click on <Code>Reveal key</Code> button to reveal the hidden key. You can&apos; reveal the <Code>Unavailable</Code> keys.
										</List.Item>
										<List.Item>
											With Random giveaway, you can&apos; choose the key you want, instead, you have to click on <Code>Pull</Code> button to get a random key.
											There is a status bar that indicates the general status of the giveaway.
											<Image my="md" className={classes.image} src="/images/guide-random-giveaway.png" radius="md" alt="Random giveaway" />
										</List.Item>
									</List>
								</List.Item>
								<List.Item>After activating the key, you can give the feedback of the status of the key.</List.Item>
							</List>
						</Tabs.Tab>
						<Tabs.Tab label="How to view retrieved keys">
							You can view the keys that you have revealed{" "}
							<Text component="span" weight={500}>
								in the last 7 days
							</Text>{" "}
							by choose tab <Code>Viewed keys</Code> in the{" "}
							<Link href="/giveaway" passHref>
								<Text sx={{ cursor: "pointer" }} component="span" variant="link">
									giveaway list page
								</Text>
							</Link>
							.
							<Image my="md" className={classes.image} src="/images/guide-viewed-keys.png" radius="md" alt="Viewed keys" />
						</Tabs.Tab>
					</Tabs>
				</Card>
			</Container>
		</>
	);
};

export default GuidePage;
