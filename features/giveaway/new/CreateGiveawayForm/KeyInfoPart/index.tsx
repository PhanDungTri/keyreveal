import { Icon } from "@iconify/react";
import { Button, SimpleGrid, Tabs, Text } from "@mantine/core";
import { GiveawayType } from "@prisma/client";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { NewKey } from "../../../../../models";
import { NormalKeyInfo } from "./NormalKeyInfo";
import { RandomKeyInfo } from "./RandomKeyInfo";

type Props = {
	type: GiveawayType;
	onChangeType: (index: number) => void;
};

export const KeyInfoPart = ({ type, onChangeType }: Props): JSX.Element => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: "keys",
	});

	const addKeys = (keys: NewKey[]) => replace(keys);

	const addEmptyKey = () => append({ name: "", key: "", url: "" });

	const removeKey = (index: number) => () => remove(index);

	useEffect(() => {
		replace(type === GiveawayType.Random ? [{ name: "Random", key: "", url: "" }] : [{ name: "", key: "", url: "" }]);
	}, [type]);

	return (
		<Tabs onTabChange={onChangeType} grow>
			<Tabs.Tab label="Normal">
				{errors.listSize?.message(
					<Text p="sm" size="sm" color="red">
						{errors.listSize.message}
					</Text>
				)}
				<SimpleGrid
					cols={1}
					spacing="xs"
					breakpoints={[
						{ minWidth: 767, cols: 2 },
						{ minWidth: 1023, cols: 3 },
					]}
				>
					{fields.map((field, index) => (
						<NormalKeyInfo key={field.id} index={index} onRemove={removeKey(index)} />
					))}
					<Button m="xs" leftIcon={<Icon icon="bx:plus" />} onClick={addEmptyKey}>
						Add key
					</Button>
				</SimpleGrid>
			</Tabs.Tab>
			<Tabs.Tab label="Random">
				<RandomKeyInfo onChange={addKeys} />
			</Tabs.Tab>
		</Tabs>
	);
};
