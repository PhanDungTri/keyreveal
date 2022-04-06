export enum BadRequestType {
	InvalidData,
	Captcha,
}

export class BadRequest extends Error {
	public readonly type: BadRequestType;

	constructor(type: BadRequestType, message: string) {
		super(message);

		this.type = type;

		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this);
	}

	public toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			message: this.message,
		};
	}
}
