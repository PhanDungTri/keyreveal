import { Icon } from "@iconify/react";
import { Accordion, Card, Container, Group, MediaQuery, Title } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import { GiveawaySubmitPanel } from "../../features";
import { GetGiveaway } from "../../models";
import { getGiveaway } from "../../services";

type Props = {
	giveaway: GetGiveaway;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const giveaway = await getGiveaway(params?.id as string);

	if (!giveaway)
		return {
			notFound: true,
		};

	return {
		props: {
			giveaway,
		},
	};
};

const ViewGiveawayPage: NextPage<Props> = ({ giveaway }) => {
	return (
		<Container>
			<Card mb="xs">
				<Title order={3}>
					<Icon icon="bx:party" inline />
					&nbsp;&bull; {giveaway.title}
				</Title>
			</Card>
			<Card>
				<Accordion initialItem={0} offsetIcon={false} icon={<Icon icon="bx:align-left" />} disableIconRotation>
					<Accordion.Item label="Description">{giveaway.description ? giveaway.description : "Enjoy the party!"}</Accordion.Item>
				</Accordion>
			</Card>
		</Container>
	);
};

export default ViewGiveawayPage;
