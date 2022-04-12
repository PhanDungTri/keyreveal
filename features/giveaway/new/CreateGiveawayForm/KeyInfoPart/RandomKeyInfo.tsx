import { Icon } from "@iconify/react";
import { Text, Textarea } from "@mantine/core";
import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { NewKey } from "../../../../../models";

type Props = {
	onChange: (keys: NewKey[]) => void;
};

export const RandomKeyInfo = ({ onChange }: Props): JSX.Element => {
	const {
		formState: { errors },
		clearErrors,
	} = useFormContext();

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		clearErrors();

		const str = e.currentTarget.value;
		const keys = str
			.split(/\r?\n/)
			.filter((key) => key)
			.map((key) => ({
				name: "Random",
				key: key.trim(),
				url: "",
			}));

		onChange(keys);
	};

	return (
		<Textarea
			label={
				<Text component="span" size="sm" weight={500}>
					<Icon icon="bx:key" inline />
					&nbsp;Key
				</Text>
			}
			variant="default"
			description="Keys are separated by a new line."
			minRows={5}
			error={errors.listSize?.message || errors.keys?.message || Array.from(new Set(errors.keys?.map((e: any) => e?.key?.message || ""))).join(". ")}
			onChange={handleChange}
		/>
	);
};
