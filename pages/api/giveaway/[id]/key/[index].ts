import { GiveawayType, KeyStatus } from "@prisma/client";
import { NextApiHandler } from "next";
import { z, ZodError } from "zod";
import { HttpMethod } from "../../../../../constants";
import { BadRequest, BadRequestType } from "../../../../../models";
import {
	closeGiveaway,
	getGiveawayType,
	getKeyForReveal,
	getKeyStatus,
	getRandomKey,
	shouldCloseGiveaway,
	updateKeyStatus,
	verifyCaptcha,
} from "../../../../../services";

const handler: NextApiHandler = async (req, res) => {
	const method = req.method;

	switch (method) {
		case HttpMethod.GET: {
			const { id, index, captchaToken } = req.query;

			const giveawayId = id as string;
			const keyIndex = parseInt(index as string);

			try {
				verifyCaptcha(captchaToken as string);

				const type = await getGiveawayType(giveawayId);

				if (type !== GiveawayType.Normal) return res.status(400).json({ message: "Cannot reveal key for this type of giveaway" });

				const key = await getKeyForReveal(giveawayId, keyIndex);

				if (key) {
					await updateKeyStatus(giveawayId, keyIndex, KeyStatus.Spoiled);
					res.status(200).json({ key });
				} else res.status(404).json({ message: "Key not found" });
			} catch (e) {
				if (e instanceof BadRequest) res.status(400).json(e.toJSON());
				else {
					console.error(e);

					res.status(500).json({
						message: "Internal server error",
					});
				}
			}

			return;
		}
		case HttpMethod.PUT: {
			const { id, index } = req.query;
			const { status } = req.body;

			const giveawayId = id as string;
			const keyIndex = parseInt(index as string);

			try {
				if (status === KeyStatus.Spoiled) res.status(400).json({ message: "Key cannot be revealed by this way" });
				else {
					z.nativeEnum(KeyStatus).parse(status);

					const currentStatus = await getKeyStatus(giveawayId, keyIndex);

					if (currentStatus) {
						if (currentStatus === KeyStatus.Mystic) res.status(400).json({ message: "Key has not been revealed yet" });
						else if (currentStatus === KeyStatus.Spoiled) {
							await updateKeyStatus(giveawayId, keyIndex, status);

							if (await shouldCloseGiveaway(giveawayId)) await closeGiveaway(giveawayId);

							res.status(200).json({ message: "Successful" });
						} else res.status(409).json({ message: "Key is already got feedback", status: currentStatus });
					} else res.status(404).json({ message: "Key not found" });
				}
			} catch (e) {
				if (e instanceof ZodError) {
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
