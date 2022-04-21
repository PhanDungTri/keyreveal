import { NextApiHandler } from "next";
import { ZodError } from "zod";
import { HttpMethod } from "../../../constants";
import { BadRequest, BadRequestType, NewGiveaway, NewGiveawaySchema, WithCaptchaToken } from "../../../models";
import { createGiveaway, verifyCaptcha } from "../../../services";

const handler: NextApiHandler = async (req, res) => {
	const method = req.method;

	switch (method) {
		case HttpMethod.POST: {
			const { captchaToken, ...newGiveaway }: WithCaptchaToken<NewGiveaway> = req.body;

			try {
				verifyCaptcha(captchaToken);
				NewGiveawaySchema.parse(newGiveaway);

				const id = await createGiveaway(newGiveaway);

				res.status(201).json({ id });
			} catch (e) {
				if (e instanceof BadRequest) {
					res.status(400).json(e.toJSON());
				} else if (e instanceof ZodError) {
					res.status(400).json({
						type: BadRequestType.InvalidData,
						message: "The request contains invalid data, please verify and try again.",
					});
				} else {
					console.error(e);

					res.status(500).json({
						message: "Internal server error",
					});
				}
			}

			return;
		}
		default: {
			res.status(405).json({
				error: "Method not allowed",
			});
		}
	}
};

export default handler;
