import prisma from "../prisma";
import { uid } from "../libs";
import { GetGiveaway, GetKey, NewGiveaway } from "../models";
import { KeyStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

export const createGiveaway = async (newGiveaway: NewGiveaway): Promise<string> => {
	const { keys, ...payload } = newGiveaway;
	const id: string = uid(6);

	if (payload.password) {
		const salt = bcrypt.genSaltSync(5);
		payload.password = bcrypt.hashSync(payload.password, salt);
	}

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
	if (id == undefined) return null;

	const giveaway = await prisma.giveaway.findUnique({
		where: { id },
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			public: true,
			password: true,
			keys: {
				select: {
					index: true,
					name: true,
					url: true,
					status: true,
				},
			},
		},
	});

	if (giveaway) {
		const { password, ...rest } = giveaway;

		return {
			...rest,
			keys: password ? [] : rest.keys,
			locked: !!password,
		};
	}

	return null;
};

export const getKeyForReveal = async (giveawayId: string, index: number): Promise<string | null> => {
	if (giveawayId == undefined || index == undefined) return null;

	const giveaway = await prisma.key.findFirst({
		where: {
			index,
			giveawayId,
			status: {
				in: [KeyStatus.Mystic, KeyStatus.Spoiled],
			},
		},
		select: {
			key: true,
		},
	});

	return giveaway?.key || null;
};

export const getKeyStatus = async (giveawayId: string, index: number): Promise<KeyStatus | null> => {
	if (giveawayId == undefined || index == undefined) return null;

	const giveaway = await prisma.key.findFirst({
		where: {
			index,
			giveawayId,
		},
		select: {
			status: true,
		},
	});

	return giveaway?.status || null;
};

export const updateKeyStatus = async (giveawayId: string, index: number, status: KeyStatus): Promise<void> => {
	if (giveawayId == undefined || index == undefined || !Object.values(KeyStatus).includes(status)) return;

	await prisma.key.update({
		where: {
			index_giveawayId: {
				giveawayId,
				index,
			},
		},
		data: {
			status,
		},
	});
};

export const unlockGiveaway = async (giveawayId: string, password: string): Promise<boolean> => {
	if (giveawayId == undefined || password == undefined) return false;

	const giveaway = await prisma.giveaway.findUnique({
		where: {
			id: giveawayId,
		},
		select: {
			password: true,
		},
	});

	return !!giveaway?.password && bcrypt.compareSync(password, giveaway.password);
};

export const getKeys = async (giveawayId: string): Promise<GetKey[]> => {
	if (giveawayId == undefined) return [];

	const keys = await prisma.key.findMany({
		where: {
			giveawayId,
		},
		select: {
			index: true,
			name: true,
			url: true,
			status: true,
		},
	});

	return keys;
};
