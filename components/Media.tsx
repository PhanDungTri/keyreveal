import { createMedia } from "@artsy/fresnel";

const AppMedia = createMedia({
	breakpoints: {
		xs: 432,
		sm: 648,
		md: 768,
		lg: 1024,
	},
});

export const mediaStyle = AppMedia.createMediaStyle();
export const { Media, MediaContextProvider: MediaProvider } = AppMedia;
