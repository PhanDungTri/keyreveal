import { Icon } from "@iconify/react";
import { Center } from "@mantine/core";
import { useModals } from "@mantine/modals";
import ReCAPTCHA from "react-google-recaptcha";

export const useCaptchaModal = () => {
	const modals = useModals();

	const openCaptchaModal = (onChange: (token: string | null) => void, onClose?: () => void) => {
		const handleChange = (token: string | null) => {
			setTimeout(() => modals.closeModal(id), 500);
			onChange(token);
		};

		const id = modals.openModal({
			title: (
				<>
					<Icon icon="bxs:bot" inline /> Before continuing...
				</>
			),
			children: (
				<Center>
					<ReCAPTCHA theme="dark" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} onChange={handleChange} />
				</Center>
			),
			onClose,
		});
	};

	return openCaptchaModal;
};
