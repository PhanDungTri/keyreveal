import { createStyles, Text } from "@mantine/core";

type Props = {
	align?: "center" | "left" | "right";
	size?: number;
};

const useStyles = createStyles((_, params: Pick<Props, "size">) => ({
	logoText: {
		fontFamily: "logo",
		fontSize: `${params.size}px`,
		lineHeight: 1,
	},
}));

export const LogoName = ({ align, size = 24 }: Props): JSX.Element => {
	const { classes } = useStyles({ size });

	return (
		<Text color="yellow" align={align} className={classes.logoText}>
			KEYREVEAL
		</Text>
	);
};
