import { Button, Group, Radio, RadioGroup } from "@mantine/core";
import { KeyStatus } from "@prisma/client";
import { FormEvent } from "react";

type Props = {
	onSubmit: (status: KeyStatus) => void;
};

export const ProblemReportModal = ({ onSubmit }: Props): JSX.Element => {
	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const fd = new FormData(e.currentTarget);
		const status = fd.get("status") as KeyStatus;

		onSubmit(status);
	};

	return (
		<form onSubmit={submit}>
			<RadioGroup label="What's wrong with the key?" name="status" required>
				<Radio value={KeyStatus.Claimed} label="The key has been claimed by someone else." />
				<Radio value={KeyStatus.Invalid} label="The key is invalid." />
				<Radio value={KeyStatus.WrongProduct} label="The key is working but it gives unexpected product." />
			</RadioGroup>
			<Group mt="md" grow>
				<Button type="submit">Submit</Button>
			</Group>
		</form>
	);
};
