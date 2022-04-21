import axios from "axios";
import { CaptchaVerificationResponse, BadRequestType, BadRequest } from "../models";

export const verifyCaptcha = async (token: string): Promise<void> => {
	if (!token) throw new BadRequest(BadRequestType.Captcha, "Captcha verification failed");

	const { data } = await axios.post<CaptchaVerificationResponse>(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
	);

	if (!data.success) {
		console.error(data);
		throw new BadRequest(BadRequestType.Captcha, "Captcha verification failed");
	}
};
