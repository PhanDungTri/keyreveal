import { createStyles } from "@mantine/core";

type Props = {
	name: string;
	available?: boolean;
};

const useStyles = createStyles({
	unavailable: {
		textDecoration: "line-through",
	},
});

export const ProductName = ({ name, available = true }: Props): JSX.Element => {
	const { classes, cx } = useStyles();

	return <span className={cx(!available && classes.unavailable)}>{name}</span>;
};
