import { Icon } from "@iconify/react";
import { Badge } from "@mantine/core";
import { KeyStatus } from "@prisma/client";

type Props = {
	status: KeyStatus;
};

export const KeyStatusBadge = ({ status }: Props): JSX.Element => {
	switch (status) {
		case KeyStatus.Spoiled:
			return (
				<Badge size="xs">
					<Icon icon="bxs:show" inline /> {status}
				</Badge>
			);
		case KeyStatus.Claimed:
			return (
				<Badge size="xs" color="lime">
					<Icon icon="bxs:gift" inline /> {status}
				</Badge>
			);
		case KeyStatus.Invalid:
			return (
				<Badge size="xs" color="red">
					<Icon icon="bxs:error" inline /> {status}
				</Badge>
			);
		case KeyStatus.WrongProduct:
			return (
				<Badge size="xs" color="violet">
					<Icon icon="bxs:ghost" inline /> Wrong product
				</Badge>
			);
		default:
			return <></>;
	}
};
