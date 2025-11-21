import { defineConfig } from "unocss";
import { transformerVariantGroup } from "unocss";
import { presetWind4, presetIcons, presetWebFonts } from "unocss";

export default defineConfig({
	presets: [
		presetWind4({
			dark: "media",
		}),

		presetWebFonts({
			fonts: {
				sans: "Roboto",
			},
		}),

		presetIcons({
			extraProperties: {
				display: "inline-block",
			},
		}),
	],

	rules: [
		["no-scrollbar", { "scrollbar-width": "none" }],
		["trim", { "text-box": "trim-both cap alphabetic" }],
	],

	transformers: [transformerVariantGroup()],
});
