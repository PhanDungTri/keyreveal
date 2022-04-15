import { Icon } from "@iconify/react";
import { Card, Container, Stack, Tabs, Text } from "@mantine/core";
import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { GivewayListItem, ViewedKeyTable } from "../../features";
import { GetGiveawayListItem } from "../../models";
import { getGiveawayList, getTotalPagesOfGiveaways } from "../../services";

type Props = {
	list: GetGiveawayListItem[];
	pages: number;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const list = await getGiveawayList(parseInt(params?.page as string) || 1);
	const pages = await getTotalPagesOfGiveaways();

	return {
		props: {
			list: list.map(({ createdAt, ...item }) => ({
				...item,
				createdAt: dayjs(createdAt).format("HH:mm, MMM DD, YYYY"),
			})),
			pages,
		},
	};
};

const GivewayListPage: NextPage<Props> = ({ list }) => {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<Container my="md">
			<Stack spacing="xs">
				<Card>
					<Tabs defaultValue={activeTab} onTabChange={setActiveTab}>
						<Tabs.Tab label="All giveaways" icon={<Icon icon="bxs:gift" />} />
						<Tabs.Tab label="Viewed keys" icon={<Icon icon="bxs:show" />} />
					</Tabs>
				</Card>
				{activeTab === 0 ? (
					list.length > 0 ? (
						list.map((item) => <GivewayListItem key={item.id} item={item} />)
					) : (
						<Card>
							<Text size="sm" color="dimmed">
								<Icon icon="bxs:ghost" inline /> Boring day! There is no active giveaway.
							</Text>
						</Card>
					)
				) : (
					<Card>
						<ViewedKeyTable />
					</Card>
				)}
			</Stack>
		</Container>
	);
};

export default GivewayListPage;
