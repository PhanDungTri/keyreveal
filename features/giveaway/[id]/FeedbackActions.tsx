import { Icon } from "@iconify/react";
import { SimpleGrid, Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { KeyStatus } from "@prisma/client";
import { useState } from "react";
import { ProblemReportModal } from "./ProblemReportModal";

type Props = {
	onReport: (status: KeyStatus) => Promise<void>;
};

export const FeedbackActions = ({ onReport }: Props): JSX.Element => {
	const modals = useModals();
	const [sendingFeedback, setSendingFeedback] = useState(false);

	const sendFeedback = async (status: KeyStatus) => {
		setSendingFeedback(true);
		await onReport(status);
		setSendingFeedback(false);
	};

	const sendClaimedFeedback = () => sendFeedback(KeyStatus.Claimed);

	const openProblemReportModal = () => {
		const handleSubmit = (status: KeyStatus) => {
			modals.closeModal(id);
			sendFeedback(status);
		};

		const id = modals.openModal({
			title: (
				<>
					<Icon icon="bxs:flag" inline /> Report problem
				</>
			),
			children: <ProblemReportModal onSubmit={handleSubmit} />,
		});
	};

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
			<Button rightIcon={<Icon icon="bxs:cool" />} loading={sendingFeedback} color="green" size="sm" compact onClick={sendClaimedFeedback}>
				I claimed it!
			</Button>
			<Button rightIcon={<Icon icon="bxs:confused" />} loading={sendingFeedback} color="red" variant="light" size="sm" compact onClick={openProblemReportModal}>
				There is a problem
			</Button>
		</SimpleGrid>
	);
};
