/* @refresh reload */

import "virtual:uno.css";
import { render } from "solid-js/web";
import { createMemo, createResource, Show } from "solid-js";

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

const fetchPageMetadata = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (!tab.id) {
		throw new Error("No active tab");
	}

	const [query] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			const getMeta = (name: string) => {
				const element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
				return element instanceof HTMLMetaElement ? element.content : String();
			};

			return {
				url: window.location.href,
				title: document.title,
				description: getMeta("description"),
			};
		},
	});

	if (!query?.result) {
		throw new Error("Failed to fetch metadata");
	}

	return {
		...query.result,
		favicon: tab.favIconUrl || undefined,
	};
};

const Index = () => {
	const [metadata, { mutate }] = createResource(fetchPageMetadata);

	const getURL = createMemo(() => {
		const state = metadata();
		return state?.url ? formatURL(state?.url) : formatURL("https://undefined.com/");
	});

	const getTitle = createMemo(() => {
		const state = metadata();
		return state?.title || getHostname(getURL());
	});

	const getFavicon = createMemo(() => {
		const state = metadata();
		return state?.favicon || "https://api.iconify.design/mdi/web.svg?color=gray";
	});

	const handleMutateTitle = (value: string) => {
		mutate((prev) => (prev ? { ...prev, title: value } : undefined));
	};

	const handleMutateDescription = (value: string) => {
		mutate((prev) => (prev ? { ...prev, description: value } : undefined));
	};

	const handleMutateURL = (value: string) => {
		mutate((prev) => (prev ? { ...prev, url: value } : undefined));
	};

	return (
		<main class="w-xl p-lg flex flex-col gap-xl">
			<Show when={metadata()} fallback={"Could not find an active tab"}>
				{(state) => (
					<>
						<section class="flex flex-col gap-xs">
							<label class="flex flex-col gap-1 p-2 b b-neutral-400 rounded-0.5">
								<span class="text-xs font-bold text-neutral-600 dark:text-neutral-400">Title</span>
								<input
									type="text"
									class="outline-none"
									value={state().title}
									onInput={(ev) => handleMutateTitle(ev.target.value)}
								/>
							</label>

							<label class="flex flex-col gap-1 p-2 b b-neutral-400 rounded-0.5">
								<span class="text-xs font-bold text-neutral-600 dark:text-neutral-400">
									Description
								</span>
								<div class="flex max-h-40 overflow-y-auto no-scrollbar">
									<textarea
										value={state().description}
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
									value={state().url}
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
								{state().description && (
									<span class="text-sm line-clamp-2">{state().description}</span>
								)}
							</div>
						</section>
					</>
				)}
			</Show>
		</main>
	);
};

// render onto index.html
render(Index, document.body);
