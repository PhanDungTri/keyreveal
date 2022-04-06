import { capitalizeWord, pluralizeWord } from "./string";

export const createInvalidTypeErrorMessage = (name: string, expectedType: string): string => `${capitalizeWord(name)} must be a ${expectedType}`;

export const createRequiredErrorMessage = (name: string): string => `${capitalizeWord(name)} is required`;

export const createLengthErrorMessage = (name: string, limit: number, minOrMax: "min" | "max"): string =>
	`${capitalizeWord(name)} must contain at ${minOrMax === "min" ? "least" : "most"} ${limit} ${pluralizeWord("character", limit)}`;

export const createSizeErrorMessage = (name: string, limit: number, minOrMax: "min" | "max"): string =>
	`Must contain at ${minOrMax === "min" ? "least" : "most"} ${limit} ${pluralizeWord(name, limit)}`;
