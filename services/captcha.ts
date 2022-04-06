import axios from "axios";
import { CaptchaVerificationResponse, BadRequestType, BadRequest } from "../models";

export const verifyCaptcha = async (token: string): Promise<void> => {
	try {
		const { data } = await axios.post<CaptchaVerificationResponse>("https://www.google.com/recaptcha/api/siteverify", {
			secret: process.env.RECAPTCHA_SECRET_KEY,
			response: token,
		});

		if (!data.success) throw new BadRequest(BadRequestType.Captcha, "Captcha verification failed");
	} catch (e) {
		if (axios.isAxiosError(e)) {
			const message = "Error while verifying captcha token";

			console.error(`${message}: ${e.response?.data}`);
			throw new Error(message);
		}
	}
};
