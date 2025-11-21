/// <reference types="@types/chrome" />

import { defineConfig } from "vite";
import { default as uno } from "unocss/vite";
import { default as solid } from "vite-plugin-solid";
import { default as browserslist } from "browserslist";
import { browserslistToTargets } from "lightningcss";

export default defineConfig({
	plugins: [uno(), solid()],

	resolve: {
		tsconfigPaths: true,
	},

	build: {
		cssMinify: "lightningcss",
	},

	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets: browserslistToTargets(browserslist()),
		},
	},
});
