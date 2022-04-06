import prisma from "../prisma";
import { uid } from "../libs";
import { NewGiveaway } from "../models";

export const createGiveaway = async (newGiveaway: NewGiveaway): Promise<string> => {
	const { keys, ...payload } = newGiveaway;
	const id: string = uid(6);

	await prisma.giveaway.create({
		data: {
			...payload,
			id,
			keys: {
				create: keys.map((k, index) => ({ ...k, index })),
			},
		},
	});

	return id;
};
