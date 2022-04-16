import { useMantineTheme } from "@mantine/core";
import { SVGProps, memo } from "react";

export const KeyrevealLogo = memo((props: SVGProps<SVGSVGElement>): JSX.Element => {
	const { colors } = useMantineTheme();

	return (
		<svg fill={colors.yellow[5]} width={57.547} height={52.003} viewBox="0 0 15.226 13.759" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M7.611 0a8.47 8.47 0 0 0-7.48 4.513L0 4.763l.13.249a8.47 8.47 0 0 0 6.952 4.496v1.076H5.495v1.058h1.587v.53H5.495v1.058h1.587v.529H8.14v-4.25a8.472 8.472 0 0 0 6.955-4.503l.131-.25-.13-.248A8.47 8.47 0 0 0 7.61 0zm0 1.068c2.637 0 5.037 1.426 6.36 3.69-1.232 2.115-3.403 3.5-5.83 3.679v-.544a3.184 3.184 0 0 0 2.646-3.13c0-1.747-1.428-3.175-3.176-3.175S4.435 3.016 4.435 4.763a3.184 3.184 0 0 0 2.647 3.13v.544c-2.426-.178-4.597-1.561-5.828-3.674 1.32-2.266 3.72-3.693 6.357-3.695zm0 1.508c1.214 0 2.188.974 2.188 2.187S8.825 6.95 7.61 6.95s-2.187-.972-2.187-2.186.974-2.187 2.187-2.187z"
				color="#000"
				fillRule="evenodd"
				style={{
					stroke: "none",
				}}
			/>
		</svg>
	);
});
