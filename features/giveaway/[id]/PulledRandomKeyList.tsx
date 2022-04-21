import { Icon } from "@iconify/react";
import { Card, List, Text, Title } from "@mantine/core";

type Props = {
	keys: string[];
};

export const PulledRandomKeyList = ({ keys }: Props): JSX.Element => {
	return (
		<Card>
			<Title order={5} mb="xs">
				&bull; Pulled keys:
			</Title>
			{keys.length === 0 ? (
				<Text size="xs" color="dimmed">
					You didn&apos;t pull any key yet.
				</Text>
			) : (
				<List size="sm" mt="xs" icon={<Icon icon="bx:key" inline />} spacing="xs" sx={{ userSelect: "none" }}>
					{keys.map((str, i) => (
						<List.Item key={i}>{str}</List.Item>
					))}
				</List>
			)}
		</Card>
	);
};
