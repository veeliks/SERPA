/* @refresh reload */

import "virtual:uno.css";
import { render } from "solid-js/web";
import { createStore } from "solid-js/store";

const [state, _setState] = createStore({
	url: "https://www.solidjs.com/",
	title: "SolidJS · Reactive Javascript Library",
	favicon: "https://www.solidjs.com/img/favicons/favicon-32x32.png",
	description: "A declarative and flexible JavaScript library for building user interfaces.",
});

const Index = () => {
	return (
		<main class="w-lg p-lg b">
			<section class="flex flex-col gap-1.5">
				<div class="flex items-center gap-sm">
					<figure class="size-7 rounded-full overflow-hidden b b-neutral-300">
						<img src={state.favicon} alt="favicon" class="size-full bg-neutral-100" />
					</figure>

					<div class="flex flex-col">
						<span class="text-sm">{state.title}</span>

						<div class="flex items-center gap-xs">
							<span class="text-xs">{state.url}</span>
							<button
								type="button"
								class="size-4.5 i-mdi:more-vert bg-neutral-600 dark:bg-neutral-400"
							/>
						</div>
					</div>
				</div>

				<div class="flex flex-col gap-1">
					<span class="text-xl text-blue-800 dark:text-blue-200">{state.title}</span>
					<span class="text-sm">{state.description}</span>
				</div>
			</section>
		</main>
	);
};

// render onto index.html
render(Index, document.body);
