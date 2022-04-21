import { createStyles, Text } from "@mantine/core";

type Props = {
	align?: "center" | "left" | "right";
	size?: number;
	inline?: boolean;
};

const useStyles = createStyles((_, params: Pick<Props, "size">) => ({
	logoText: {
		fontFamily: "logo",
		fontSize: `${params.size}px`,
		lineHeight: 1,
	},
}));

export const LogoName = ({ align, size = 24, inline }: Props): JSX.Element => {
	const { classes } = useStyles({ size });

	return (
		<Text component={inline ? "span" : "div"} color="yellow" align={align} className={classes.logoText}>
			KEYREVEAL
		</Text>
	);
};
