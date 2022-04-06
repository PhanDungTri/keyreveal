export type CaptchaVerificationRequest = {
	secret: string;
	response: string;
	remoteip?: string;
};

export type CaptchaVerificationResponse = {
	success: boolean;
	challenge_ts: Date;
	hostname: string;
	"error-codes"?: string[];
};

export type WithCaptchaToken<T> = T & { captchaToken: string };
