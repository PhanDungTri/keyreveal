import { Icon } from "@iconify/react";
import { Alert, Button, Center, Container, List } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const LinkFilterPage: NextPage = () => {
	const router = useRouter();
	const { url } = router.query;

	return (
		<>
			<Head>
				<title>You are leaving</title>
			</Head>
			<Container my="xl">
				<Alert icon={<Icon icon="bx:error" />} title="You are leaving Key Reveal" color="orange" variant="filled">
					You are leaving and proceeding to a page that is not part of Key Reveal:
					<List size="sm" withPadding my="xs">
						<List.Item icon={<Icon icon="bx:link-external" inline />}>{url}</List.Item>
					</List>
					Please re-check the link to avoid being redirected to a malicious site.
					<Center mt="lg">
						<a href={url as string}>
							<Button color="gray">Continue to external site</Button>
						</a>
					</Center>
				</Alert>
			</Container>
		</>
	);
};

export default LinkFilterPage;
