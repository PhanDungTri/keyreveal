import { GiveawayType, KeyStatus } from "@prisma/client";
import { z } from "zod";
import { createInvalidTypeErrorMessage, createLengthErrorMessage, createRequiredErrorMessage, createSizeErrorMessage } from "../utils";

const TextLength = {
	Key: { Min: 4, Max: 40 },
	Name: { Min: 5, Max: 100 },
	Url: { Max: 2048 },
	Title: { Min: 10, Max: 200 },
	Description: { Min: 10, Max: 2000 },
	Password: { Min: 4, Max: 32 },
};

const ListSize = {
	Key: {
		Min: 1,
		Max: {
			Normal: 100,
			Random: 1000,
		},
	},
};

export const NewKeySchema = z.object({
	key: z
		.string({
			invalid_type_error: createInvalidTypeErrorMessage("key", "string"),
			required_error: createRequiredErrorMessage("key"),
		})
		.min(TextLength.Key.Min, {
			message: createLengthErrorMessage("key", TextLength.Key.Min, "min"),
		})
		.max(TextLength.Key.Max, {
			message: createLengthErrorMessage("key", TextLength.Key.Max, "max"),
		}),
	name: z
		.string({
			invalid_type_error: createInvalidTypeErrorMessage("name", "string"),
			required_error: createRequiredErrorMessage("name"),
		})
		.min(TextLength.Name.Min, {
			message: createLengthErrorMessage("name", TextLength.Name.Min, "min"),
		})
		.max(TextLength.Name.Max, {
			message: createLengthErrorMessage("name", TextLength.Name.Max, "max"),
		}),
	url: z
		.string({
			invalid_type_error: createInvalidTypeErrorMessage("Url", "string"),
		})
		.max(TextLength.Url.Max, {
			message: createLengthErrorMessage("Url", TextLength.Url.Max, "max"),
		})
		.optional()
		.or(z.literal("")),
});

export const NewGiveawaySchema = z
	.object({
		title: z
			.string({
				invalid_type_error: createInvalidTypeErrorMessage("title", "string"),
				required_error: createRequiredErrorMessage("title"),
			})
			.min(TextLength.Title.Min, {
				message: createLengthErrorMessage("title", TextLength.Title.Min, "min"),
			})
			.max(TextLength.Title.Max, {
				message: createLengthErrorMessage("title", TextLength.Title.Max, "max"),
			}),
		description: z
			.string({
				invalid_type_error: createInvalidTypeErrorMessage("description", "string"),
			})
			.min(TextLength.Description.Min, {
				message: createLengthErrorMessage("description", TextLength.Description.Min, "min"),
			})
			.max(TextLength.Description.Max, {
				message: createLengthErrorMessage("description", TextLength.Description.Max, "max"),
			})
			.optional()
			.or(z.literal("")),
		public: z.boolean(),
		type: z.nativeEnum(GiveawayType),
		password: z
			.string({
				invalid_type_error: createInvalidTypeErrorMessage("password", "string"),
			})
			.min(TextLength.Password.Min, {
				message: createLengthErrorMessage("password", TextLength.Password.Min, "min"),
			})
			.max(TextLength.Password.Max, {
				message: createLengthErrorMessage("password", TextLength.Password.Max, "max"),
			})
			.optional()
			.or(z.literal("")),
		keys: NewKeySchema.array().min(ListSize.Key.Min, {
			message: createSizeErrorMessage("keys", ListSize.Key.Min, "min"),
		}),
	})
	.refine(
		(data) => data.keys.length <= ListSize.Key.Max[data.type],
		(data) => ({
			message: createSizeErrorMessage("key", ListSize.Key.Max[data.type], "max"),
			path: ["listSize"],
		})
	);

export type NewKey = z.infer<typeof NewKeySchema>;

export type NewGiveaway = z.infer<typeof NewGiveawaySchema>;

export type NewGiveawayResponse = {
	id: string;
};

export type GetKey = {
	index: number;
	name: string;
	url: string;
	status: KeyStatus;
};

export type GetGiveaway = {
	id: string;
	title: string;
	description: string | null;
	createdAt: Date;
	public: boolean;
	locked: boolean;
	keys: GetKey[];
};

export type GetKeyForReveal = {
	key: string;
};

export type LocalStorageViewedKey = {
	[giveawayId: string]: {
		[index: number]: {
			key: string;
			name: string;
			date: string;
		};
	};
};
