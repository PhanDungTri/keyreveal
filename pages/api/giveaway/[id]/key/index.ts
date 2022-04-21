import { GiveawayType, KeyStatus } from "@prisma/client";
import { NextApiHandler } from "next";
import { HttpMethod } from "../../../../../constants";
import { BadRequest } from "../../../../../models";
import { closeGiveaway, getGiveawayStatus, getRandomKey, shouldCloseGiveaway, updateKeyStatus, verifyCaptcha } from "../../../../../services";

const handler: NextApiHandler = async (req, res) => {
	const method = req.method;

	switch (method) {
		case HttpMethod.GET: {
			const { id, captchaToken } = req.query;

			const giveawayId = id as string;

			try {
				await verifyCaptcha(captchaToken as string);

				const status = await getGiveawayStatus(giveawayId);

				if (status === null) return res.status(404).json({ message: "Giveaway not found" });
				if (status.ended) return res.status(400).json({ message: "Giveaway has ended" });
				if (status.type !== GiveawayType.Random) return res.status(400).json({ message: "Cannot pull random key for this type of giveaway" });

				const key = await getRandomKey(giveawayId);

				if (key) {
					await updateKeyStatus(giveawayId, key.index, KeyStatus.Spoiled);

					if (await shouldCloseGiveaway(giveawayId)) await closeGiveaway(giveawayId);

					res.status(200).json(key);
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
		default: {
			res.status(405).json({
				error: "Method not allowed",
			});
		}
	}
};

export default handler;
