import { Table, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { viewedKeysAtom } from "../../atom";
import { useIsMounted } from "../../hooks";
import { ViewedKey } from "../../models";

export const ViewedKeyTable = (): JSX.Element => {
	const isMounted = useIsMounted();
	const [keys] = useAtom(viewedKeysAtom);

	return isMounted ? (
		Object.keys(keys).length > 0 ? (
			<Table>
				<thead>
					<tr>
						<th>Product name</th>
						<th>Product key</th>
						<th>Retrieved date</th>
					</tr>
				</thead>
				<tbody>
					{Object.values(keys)
						.reduce<ViewedKey[]>((acc, val) => [...acc, ...Object.values(val)], [])
						.sort((a, b) => {
							if (a.date > b.date) return -1;
							if (a.date < b.date) return 1;
							return 0;
						})
						.map((k, i) => (
							<tr key={i}>
								<td>{k.name}</td>
								<td>{k.key}</td>
								<td>{k.date}</td>
							</tr>
						))}
				</tbody>
			</Table>
		) : (
			<Text size="sm" color="dimmed">
				You didn&apos;t reveal any key in the last 7 days.
			</Text>
		)
	) : (
		<></>
	);
};
