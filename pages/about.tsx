import { Icon } from "@iconify/react";
import { Card, Container, createStyles, Divider, Image, SimpleGrid, Text, Timeline, Title } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { LogoName, Media } from "../components";

const useStyles = createStyles(() => ({
	image: {
		margin: "auto",
	},
	avatar: {
		borderRadius: "50%",
		width: "15rem !important",
	},
	exampleNoNo: {
		width: "420px !important",
		maxWidth: "100%",
	},
	verticalCenterText: {
		alignSelf: "center",
	},
}));

const AboutPage: NextPage = () => {
	const { classes, cx } = useStyles();

	return (
		<>
			<Head>
				<title>About</title>
			</Head>
			<Container my="xl">
				<Card>
					<Title order={2}>&bull; Big question! Who are you?</Title>
					<Text size="lg" weight={500} my="xl">
						Hello, I&apos;m{" "}
						<Text size="lg" component="span" weight={700} variant="gradient" gradient={{ from: "pink", to: "yellow", deg: 45 }}>
							Phan Dung Tri
						</Text>{" "}
						and I&apos;m an ordinary coding guy <Icon icon="bx:code-block" style={{ transform: "translateY(2px)" }} inline />
					</Text>
					<SimpleGrid spacing="xl" cols={1} breakpoints={[{ minWidth: 767, cols: 2 }]}>
						<Text className={classes.verticalCenterText}>
							I come from <Icon icon="twemoji:flag-vietnam" width={24} style={{ transform: "translateY(4px)" }} inline /> Vietnam, a beautiful country with
							delicious cuisine. My name in Vietnamese has additional fancy floating symbols and it looks like this,{" "}
							<Text component="span" weight={500}>
								Phan Dũng Trí
							</Text>
							. I&apos;m currently working as a Java Developer in a logistics company. But well, I must say I&apos;m not a big fan of Java. Instead, I&apos;m
							really fond of Javascript and Website Development.
						</Text>
						<Image classNames={{ image: cx(classes.avatar, classes.image) }} src="/images/avatar.png" alt="Avatar" />
					</SimpleGrid>
					<Title order={2} mt="xl">
						&bull; Why create <LogoName size={26} inline />?
					</Title>
					<Text size="lg" weight={500} my="xl">
						Everyone{" "}
						<Text component="span" color="red">
							<Icon icon="bxs:heart" inline />
						</Text>{" "}
						giveaways and so do I <Icon icon="bx:party" inline />
					</Text>
					<Text my="xl">
						I have taken part in many of them, most of them are on the social media. The host publicly post a bunch of product keys in a Facebook group or
						subreddit. These giveaways are first come, first served. Some kind people leave the message after claiming the keys so that latecomers will know
						which key is still available.{" "}
					</Text>
					<SimpleGrid spacing="xl" cols={1} breakpoints={[{ minWidth: 767, cols: 2 }]} my="xl">
						<Image radius="md" classNames={{ image: cx(classes.exampleNoNo, classes.image) }} src="/images/example-no-no.png" alt="Example no no" />
						<Text className={classes.verticalCenterText}>
							But there are also many people, I call them <em>the ninjas</em>, just sneak in, grab the keys then slip out without saying anything. This makes
							the latecomers have to try they keys one by one to realize that these keys are already{" "}
							<Text component="span" weight={500}>
								CLAIMED
							</Text>
							. What an evil!
						</Text>
					</SimpleGrid>
					<SimpleGrid spacing="xl" cols={1} breakpoints={[{ minWidth: 767, cols: 2 }]}>
						<Text className={classes.verticalCenterText}>
							<LogoName size={16} inline /> allow everyone to fully enjoy the fun of the giveaways by providing the way to keep track the statuses of the keys.
							So that people can know which key is already claimed and which one is still available. Besides, the host can make the giveaway public or private,
							or protect it with the password. And finally, <LogoName size={16} inline /> is open source.
						</Text>
						<Image radius="md" classNames={{ image: classes.image }} src="/images/example-giveaway.png" alt="Example no no" />
					</SimpleGrid>
				</Card>
				<Card mt="xs">
					<Divider label="Contact me" my="xs" />
					<Media greaterThanOrEqual="tablet">
						<SimpleGrid cols={2}>
							<Timeline bulletSize={24} lineWidth={2}>
								<Timeline.Item bullet={<Icon icon="bxl:github" />} title="GitHub">
									<a href="https://github.com/PhanDungTri" target="_blank" rel="noreferrer">
										<Text variant="link" color="dimmed" size="sm">
											PhanDungTri
										</Text>
									</a>
								</Timeline.Item>
								<Timeline.Item bullet={<Icon icon="bxl:gmail" />} title="E-mail">
									<a href="mailto:phandungtri99@gmail.com" target="_blank" rel="noreferrer">
										<Text variant="link" color="dimmed" size="sm">
											phandungtri99@gmail.com
										</Text>
									</a>
								</Timeline.Item>
							</Timeline>
							<Timeline bulletSize={24} lineWidth={2}>
								<Timeline.Item bullet={<Icon icon="bxl:linkedin-square" />} title="LinkedIn">
									<a href="https://www.linkedin.com/in/dung-tri-phan-261b8b230" target="_blank" rel="noreferrer">
										<Text variant="link" color="dimmed" size="sm">
											Dung Tri Phan
										</Text>
									</a>
								</Timeline.Item>
								<Timeline.Item bullet={<Icon icon="bxl:reddit" />} title="Reddit">
									<a href="https://www.reddit.com/user/phandungtri" target="_blank" rel="noreferrer">
										<Text variant="link" color="dimmed" size="sm">
											u/phandungtri
										</Text>
									</a>
								</Timeline.Item>
							</Timeline>
						</SimpleGrid>
					</Media>
					<Media lessThan="tablet">
						<Timeline bulletSize={24} lineWidth={2}>
							<Timeline.Item bullet={<Icon icon="bxl:github" />} title="GitHub">
								<a href="https://github.com/PhanDungTri" target="_blank" rel="noreferrer">
									<Text variant="link" color="dimmed" size="sm">
										PhanDungTri
									</Text>
								</a>
							</Timeline.Item>
							<Timeline.Item bullet={<Icon icon="bxl:gmail" />} title="E-mail">
								<a href="mailto:phandungtri99@gmail.com" target="_blank" rel="noreferrer">
									<Text variant="link" color="dimmed" size="sm">
										phandungtri99@gmail.com
									</Text>
								</a>
							</Timeline.Item>
							<Timeline.Item bullet={<Icon icon="bxl:linkedin-square" />} title="LinkedIn">
								<a href="https://www.linkedin.com/in/dung-tri-phan-261b8b230" target="_blank" rel="noreferrer">
									<Text variant="link" color="dimmed" size="sm">
										Dung Tri Phan
									</Text>
								</a>
							</Timeline.Item>
							<Timeline.Item bullet={<Icon icon="bxl:reddit" />} title="Reddit">
								<a href="https://www.reddit.com/user/phandungtri" target="_blank" rel="noreferrer">
									<Text variant="link" color="dimmed" size="sm">
										u/phandungtri
									</Text>
								</a>
							</Timeline.Item>
						</Timeline>
					</Media>
				</Card>
			</Container>
		</>
	);
};

export default AboutPage;
