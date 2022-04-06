import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@mantine/core";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GiveawayType, NewGiveaway, NewGiveawaySchema } from "../../models";
import { generateRandomName } from "../../utils";
import { GeneralInfoPart } from "./GeneralInfoPart";
import { GiveawayTypeDescription } from "./GiveawayTypeDescription";
import { KeyInfoPart } from "./KeyInfoPart";

type Props = {
	onSubmit: (data: Omit<NewGiveaway, "public">) => void;
};

export const CreateGiveawayForm = ({ onSubmit }: Props): JSX.Element => {
	const [type, setType] = useState<GiveawayType>(GiveawayType.Normal);
	const [randomName] = useState(generateRandomName());

	const form = useForm<NewGiveaway>({
		resolver: zodResolver(NewGiveawaySchema),
		defaultValues: {
			title: `The giveaway of ${randomName}`,
			description: `Welcome and thank you for participating in the giveaway of ${randomName}!\nPlease enjoy!`,
			type: GiveawayType.Normal,
			public: true,
		},
	});

	console.log(form.formState.errors);

	useEffect(() => {
		form.register("public");
	}, []);

	return (
		<form id="new-giveaway-form" onSubmit={form.handleSubmit(onSubmit)}>
			<FormProvider {...form}>
				<Card mb="xs">
					<GeneralInfoPart />
				</Card>
				<GiveawayTypeDescription type={type} />
				<Card>
					<KeyInfoPart type={type} onChangeType={setType} />
				</Card>
			</FormProvider>
		</form>
	);
};
