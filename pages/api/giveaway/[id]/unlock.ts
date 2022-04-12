import { NextApiHandler } from "next";
import { HttpMethod } from "../../../../constants";
import { getKeys, unlockGiveaway } from "../../../../services";

const handler: NextApiHandler = async (req, res) => {
	const method = req.method;

	switch (method) {
		case HttpMethod.POST: {
			const { id } = req.query;
			const { password } = req.body;

			try {
				if (await unlockGiveaway(id as string, password as string)) {
					const keys = await getKeys(id as string);

					return res.status(200).json(keys);
				}

				return res.status(403).json({ message: "Wrong password" });
			} catch (e) {
				console.error(e);

				return res.status(500).json({ message: "Internal server error" });
			}
		}
		default: {
			res.status(405).json({
				error: "Method not allowed",
			});
		}
	}
};

export default handler;
