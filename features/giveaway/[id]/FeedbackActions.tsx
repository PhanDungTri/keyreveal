import { Icon } from "@iconify/react";
import { SimpleGrid, Button } from "@mantine/core";

type Props = {
	loading?: boolean;
	onClaim: () => void;
	onProblemReport: () => void;
};

export const FeedbackActions = ({ loading = false, onClaim, onProblemReport }: Props): JSX.Element => {
	return (
		<SimpleGrid
			spacing="xs"
			cols={1}
			breakpoints={[
				{
					minWidth: 432,
					cols: 2,
				},
			]}
		>
			<Button rightIcon={<Icon icon="bxs:cool" />} loading={loading} color="green" size="sm" compact onClick={onClaim}>
				I claimed it!
			</Button>
			<Button rightIcon={<Icon icon="bxs:confused" />} loading={loading} color="red" variant="light" size="sm" compact onClick={onProblemReport}>
				There is a problem
			</Button>
		</SimpleGrid>
	);
};
