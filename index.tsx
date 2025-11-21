/* @refresh reload */

import "virtual:uno.css";
import { render } from "solid-js/web";
import { createStore, produce } from "solid-js/store";
import { createMemo } from "solid-js";

const [state, setState] = createStore({
	url: "https://www.solidjs.com/",
	title: "SolidJS · Reactive Javascript Library",
	favicon: "https://www.solidjs.com/img/favicons/favicon-32x32.png",
	description: "A declarative and flexible JavaScript library for building user interfaces.",
});

const stripTrailingSlash = (url: string) => {
	return url.endsWith("/") ? url.slice(0, -1) : url;
};

const getHostname = (url: string) => {
	try {
		return new URL(url).hostname;
	} catch {
		return url || "Invalid URL";
	}
};

const formatURL = (value: string) => {
	try {
		const url = new URL(stripTrailingSlash(value));
		const pathSegments = url.pathname.split("/").filter(Boolean);

		if (pathSegments.length === 0) {
			return value;
		}

		const base = `${url.protocol}//${url.hostname}`;
		const segments = pathSegments.slice(0, 4);

		return `${base} › ${segments.join(" › ")}`;
	} catch {
		return value;
	}
};

const Index = () => {
	const getURL = createMemo(() => {
		return state.url ? formatURL(state.url) : formatURL("https://undefined.com/");
	});

	const getTitle = createMemo(() => {
		return state.title || getHostname(getURL());
	});

	const getFavicon = createMemo(() => {
		return state.favicon || "https://api.iconify.design/mdi/web.svg?color=gray";
	});

	const handleMutateTitle = (value: string) => {
		setState(
			produce((state) => {
				state.title = value;
			}),
		);
	};

	const handleMutateDescription = (value: string) => {
		setState(
			produce((state) => {
				state.description = value;
			}),
		);
	};

	const handleMutateURL = (value: string) => {
		setState(
			produce((state) => {
				state.url = value;
			}),
		);
	};

	return (
		<main class="w-xl p-lg flex flex-col gap-xl b">
			<section class="flex flex-col gap-xs">
				<label class="flex flex-col gap-1 p-2 b b-neutral-400 rounded-0.5">
					<span class="text-xs font-bold text-neutral-600 dark:text-neutral-400">Title</span>
					<input
						type="text"
						class="outline-none"
						value={state.title}
						onInput={(ev) => handleMutateTitle(ev.target.value)}
					/>
				</label>

				<label class="flex flex-col gap-1 p-2 b b-neutral-400 rounded-0.5">
					<span class="text-xs font-bold text-neutral-600 dark:text-neutral-400">Description</span>
					<div class="flex max-h-40 overflow-y-auto no-scrollbar">
						<textarea
							value={state.description}
							class="grow outline-none min-h-fit field-sizing-content"
							onInput={(ev) => handleMutateDescription(ev.target.value)}
						/>
					</div>
				</label>

				<label class="flex flex-col gap-1 p-2 b b-neutral-400 rounded-0.5">
					<span class="text-xs font-bold text-neutral-600 dark:text-neutral-400">URL</span>
					<input
						type="text"
						class="outline-none"
						value={state.url}
						onInput={(ev) => handleMutateURL(ev.target.value)}
					/>
				</label>
			</section>

			<section class="flex flex-col gap-1.5 my-xs">
				<div class="flex items-center gap-sm">
					<figure class="size-7 rounded-full overflow-hidden shrink-0 b b-neutral-300">
						<img src={getFavicon()} alt="favicon" class="size-full bg-neutral-100" />
					</figure>

					<div class="flex flex-col min-w-0">
						<span class="text-sm truncate">{getTitle()}</span>

						<div class="flex items-center gap-xs min-w-0">
							<span class="text-xs truncate">{getURL()}</span>
							<button
								type="button"
								class="size-4.5 i-mdi:more-vert shrink-0 bg-neutral-600 dark:bg-neutral-400"
							/>
						</div>
					</div>
				</div>

				<div class="flex flex-col gap-1 min-w-0">
					<span class="text-xl text-blue-800 dark:text-blue-200 truncate">{getTitle()}</span>
					{state.description && <span class="text-sm line-clamp-3">{state.description}</span>}
				</div>
			</section>
		</main>
	);
};

// render onto index.html
render(Index, document.body);
