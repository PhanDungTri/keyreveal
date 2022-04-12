import { Group, TextInput, Textarea } from "@mantine/core";
import { useFormContext } from "react-hook-form";

export const GeneralInfoPart = (): JSX.Element => {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<Group direction="column" grow spacing="xs">
			<TextInput variant="default" label="Title" error={errors.title?.message} required {...register("title")} />
			<Textarea variant="default" label="Description" minRows={5} error={errors.description?.message} {...register("description")} />
			<TextInput
				variant="default"
				label="Password"
				error={errors.password?.message}
				description="Leave empty if password not required."
				type="password"
				{...register("password")}
			/>
		</Group>
	);
};
