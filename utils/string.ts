export const capitalizeWord = (word: string): string => {
	if (word.length === 0 || word.match(/[^\s]+/g)?.length !== 1) throw new Error("Expected a single word");
	return word[0].toUpperCase() + word.slice(1);
};

export const pluralizeWord = (word: string, count: number): string => {
	if (word.length === 0 || word.match(/[^\s]+/g)?.length !== 1) throw new Error("Expected a single word");
	return `${word}${count === 1 ? "" : "s"}`;
};
