import prisma from "../prisma";
import { uid } from "../libs";
import { GetGiveaway, NewGiveaway } from "../models";

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

export const getGiveaway = async (id: string): Promise<GetGiveaway | null> => {
	if (!id) return null;

	return await prisma.giveaway.findUnique({
		where: { id },
		select: {
			id: true,
			title: true,
			description: true,
			keys: {
				select: {
					index: true,
					name: true,
					url: true,
				},
			},
		},
	});
};
