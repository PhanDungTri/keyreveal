import { Icon } from "@iconify/react";
import { Button, Card, Center, createStyles, Stack, Text, TextInput } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import axios from "axios";
import { FormEvent, useState } from "react";

type Props = {
	onUnlock: (password: string) => Promise<void>;
};

const useStyles = createStyles(({ colors }) => ({
	lockedCard: {
		backgroundColor: "inherit",
		border: `2px dashed ${colors.dark[4]}`,
	},
}));

export const LockedCard = ({ onUnlock }: Props): JSX.Element => {
	const { classes } = useStyles();
	const [unlocking, setUnlocking] = useState(false);

	const unlock = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const fd = new FormData(e.currentTarget);
		const password = fd.get("password") as string;

		if (!password)
			showNotification({
				title: "Cannot unlock giveaway",
				message: "Password is required",
				color: "red",
				icon: <Icon icon="bx:x" />,
			});
		else {
			setUnlocking(true);

			showNotification({
				id: "unlock-giveaway",
				loading: true,
				title: "Unlocking giveaway",
				message: "Please wait a bit, we're retrieving g-pass for you!",
				autoClose: false,
				disallowClose: true,
			});

			try {
				await onUnlock(password);

				updateNotification({
					id: "unlock-giveaway",
					color: "green",
					title: "Giveaway unlocked",
					message: "Please enjoy the giveaway!",
					icon: <Icon icon="bx:check" />,
				});
			} catch (e) {
				if (axios.isAxiosError(e))
					updateNotification({
						id: "unlock-giveaway",
						color: "red",
						title: "Cannot unlock giveaway",
						message: e.response?.data.message,
						icon: <Icon icon="bx:x" />,
					});
			} finally {
				setUnlocking(false);
			}
		}
	};

	return (
		<Card className={classes.lockedCard}>
			<Text align="center" size="md" color="dimmed" mt="xs" weight={500}>
				<Stack align="center" spacing={0}>
					<Icon icon="bxs:lock-alt" width={48} />
					This giveaway is locked.
				</Stack>
			</Text>
			<form onSubmit={unlock}>
				<Center mt="md">
					<Stack spacing="xs">
						<TextInput name="password" size="xs" type="password" placeholder="Password" />
						<Button type="submit" loading={unlocking} size="xs" compact>
							Unlock
						</Button>
					</Stack>
				</Center>
			</form>
		</Card>
	);
};
