import { Icon } from "@iconify/react";
import { Stack, Title, TextInput, ActionIcon } from "@mantine/core";
import { useFormContext } from "react-hook-form";

type Props = {
	index: number;
	onRemove: () => void;
};

export const NormalKeyInfo = ({ index, onRemove }: Props): JSX.Element => {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<Stack
			align="unset"
			spacing="xs"
			sx={({ colors, spacing }) => ({
				border: `1px dashed ${colors.dark[4]}`,
				padding: spacing.xs,
				position: "relative",
			})}
		>
			<Title order={6}>Key &bull; {index + 1}</Title>
			<TextInput
				variant="default"
				placeholder="Name"
				sx={{ flexGrow: 1 }}
				error={errors.keys?.[index]?.name?.message}
				required
				{...register(`keys.${index}.name`)}
			/>
			<TextInput
				sx={{ flexGrow: 1 }}
				icon={<Icon icon="bx:key" inline />}
				variant="default"
				placeholder="Key"
				error={errors.keys?.[index]?.key?.message}
				required
				{...register(`keys.${index}.key`)}
			/>
			<TextInput
				sx={{ flexGrow: 1 }}
				icon={<Icon icon="bx:link" inline />}
				variant="default"
				placeholder="Product website (optional)"
				error={errors.keys?.[index]?.url?.message}
				{...register(`keys.${index}.url`)}
			/>
			{index !== 0 && (
				<ActionIcon
					sx={{
						position: "absolute",
						right: 0,
						top: 0,
					}}
					variant="transparent"
					size="lg"
					color="red"
					onClick={onRemove}
				>
					<Icon icon="bx:x" />
				</ActionIcon>
			)}
		</Stack>
	);
};
