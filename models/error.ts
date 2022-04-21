export enum BadRequestType {
	InvalidData,
	Captcha,
}

export class BadRequest extends Error {
	public readonly type: BadRequestType;

	constructor(type: BadRequestType, message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);

		this.type = type;
	}

	public toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			message: this.message,
		};
	}
}
