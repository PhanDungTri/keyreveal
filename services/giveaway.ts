import { KeyStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ItemsPerPage } from "../constants";
import { uid } from "../libs";
import { GetGiveaway, GetGiveawayListItem, GetGiveawayStatus, GetKey, GetRandomKey, NewGiveaway } from "../models";
import prisma from "../prisma";

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
			ended: true,
			password: true,
			type: true,
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

export const getRandomKey = async (giveawayId: string): Promise<GetRandomKey | null> => {
	if (giveawayId == undefined) return null;

	const keys = await prisma.key.findMany({
		where: {
			giveawayId,
			status: {
				in: [KeyStatus.Mystic, KeyStatus.Spoiled],
			},
		},
		select: {
			key: true,
			index: true,
			status: true,
		},
	});

	if (keys.length == 0) return null;
	if (keys.length == 1) return keys[0].key;

	const randomIndex = Math.floor(Math.random() * keys.length);

	return keys[randomIndex];
};

export const getGiveawayList = async (page = 1): Promise<GetGiveawayListItem[]> => {
	const giveaways = await prisma.giveaway.findMany({
		skip: (page - 1) * ItemsPerPage,
		take: ItemsPerPage,
		select: {
			id: true,
			title: true,
			createdAt: true,
			password: true,
			type: true,
			ended: true,
			keys: {
				select: {
					status: true,
				},
			},
		},
		where: {
			public: true,
		},
		orderBy: [
			{
				ended: "asc",
			},
			{
				createdAt: "desc",
			},
		],
	});

	return giveaways.map(({ password, keys, ...ga }) => ({
		...ga,
		locked: !!password,
		totalKeys: keys.length,
		remainingKeys: keys.filter((k) => k.status === KeyStatus.Mystic || k.status === KeyStatus.Spoiled).length,
	}));
};

export const closeGiveaway = async (giveawayId: string): Promise<void> => {
	if (giveawayId == undefined) return;

	await prisma.giveaway.update({
		where: {
			id: giveawayId,
		},
		data: {
			ended: true,
		},
	});
};

export const shouldCloseGiveaway = async (giveawayId: string): Promise<boolean> => {
	if (giveawayId == undefined) return false;

	const count = await prisma.key.count({
		where: {
			giveawayId,
			status: {
				in: [KeyStatus.Mystic, KeyStatus.Spoiled],
			},
		},
	});

	return count === 0;
};

export const getTotalPagesOfGiveaways = async (): Promise<number> => {
	const count = await prisma.giveaway.count({
		where: {
			public: true,
			ended: false,
		},
	});

	return Math.ceil(count / ItemsPerPage);
};

export const getGiveawayStatus = async (giveawayId: string): Promise<GetGiveawayStatus | null> => {
	if (giveawayId == undefined) return null;

	const giveaway = await prisma.giveaway.findUnique({
		where: {
			id: giveawayId,
		},
		select: {
			ended: true,
			type: true,
		},
	});

	return giveaway;
};
