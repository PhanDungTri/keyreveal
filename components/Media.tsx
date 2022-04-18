import { createMedia } from "@artsy/fresnel";

const AppMedia = createMedia({
	breakpoints: {
		mobileS: 320,
		mobileM: 375,
		mobileL: 425,
		tablet: 768,
		laptop: 1024,
		laptopL: 1440,
	},
});

export const mediaStyle = AppMedia.createMediaStyle();
export const { Media, MediaContextProvider: MediaProvider } = AppMedia;
