import { atomWithStorage } from "jotai/utils";
import { LocalStorageViewedKey } from "../models";

export const viewedKeysAtom = atomWithStorage<LocalStorageViewedKey>("viewed-keys", {});
