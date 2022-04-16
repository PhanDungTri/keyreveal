import { Icon } from "@iconify/react";
import { Card, Container, Group, Pagination, Stack, Tabs, Text } from "@mantine/core";
import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { GivewayListItem, ViewedKeyTable } from "../../features";
import { GetGiveawayListItem } from "../../models";
import { getGiveawayList, getTotalPagesOfGiveaways } from "../../services";

type Props = {
	list: GetGiveawayListItem[];
	pages: number;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const list = await getGiveawayList(parseInt(query?.page as string) || 1);
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

const GivewayListPage: NextPage<Props> = ({ list, pages }) => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState(0);
	const page = parseInt((router.query?.page as string) || "1");

	const handlePageChange = (p: number) => {
		if (p !== page) router.push(`/giveaway?page=${p}`);
	};

	return (
		<Container my="xl">
			<Stack spacing="xs">
				<Card>
					<Tabs defaultValue={activeTab} onTabChange={setActiveTab}>
						<Tabs.Tab label="All giveaways" icon={<Icon icon="bxs:gift" />} />
						<Tabs.Tab label="Viewed keys" icon={<Icon icon="bxs:show" />} />
					</Tabs>
				</Card>
				{activeTab === 0 ? (
					list.length > 0 ? (
						<>
							{list.map((item) => (
								<GivewayListItem key={item.id} item={item} />
							))}
							<Group position="right">
								<Pagination size="sm" page={page} onChange={handlePageChange} total={pages} />
							</Group>
						</>
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
