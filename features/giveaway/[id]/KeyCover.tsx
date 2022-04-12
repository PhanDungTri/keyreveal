import { Icon } from "@iconify/react";
import { Transition, Loader, Text, createStyles } from "@mantine/core";

type Props = {
	hidden?: boolean;
	loading?: boolean;
	available?: boolean;
};

const useStyles = createStyles(({ colors, radius, spacing }) => ({
	keyCover: {
		position: "relative",
		display: "flex",
		borderRadius: `${radius.md}px`,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.yellow[6],
		color: "black",
		cursor: "pointer",
		zIndex: 2,
		padding: spacing.xs,

		"&:hover": {
			backgroundColor: colors.yellow[5],
		},
	},
	unavailable: {
		backgroundColor: colors.gray[6],
		pointerEvents: "none",
	},
}));

export const KeyCover = ({ hidden = false, loading = false, available = true }: Props): JSX.Element => {
	const { classes, cx } = useStyles();

	return (
		<Transition mounted={hidden} transition="fade">
			{(style) => (
				<div className={cx(classes.keyCover, !available && classes.unavailable)} style={style}>
					{loading ? (
						<Loader size="sm" color="dark" />
					) : available ? (
						<Text size="sm" weight={500} align="center">
							<Icon icon="bx:show" inline />
							&nbsp; Reveal key
						</Text>
					) : (
						<Text size="sm" weight={500} align="center">
							<Icon icon="bx:block" inline />
							&nbsp; Unavailable
						</Text>
					)}
				</div>
			)}
		</Transition>
	);
};
