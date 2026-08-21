<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount, tick } from "svelte";
import type { SearchResult } from "@/global";

let keyword = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;
let isPanelOpen = false;
let searchInput: HTMLInputElement;

type FallbackSearchItem = {
	url: string;
	title: string;
	excerpt: string;
	section?: string;
	tags?: string[];
};

let fallbackIndex: FallbackSearchItem[] | null = null;

const escapeRegExp = (value: string): string =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlight = (text: string, keyword: string): string => {
	if (!keyword.trim()) return text;
	const pattern = new RegExp(`(${escapeRegExp(keyword.trim())})`, "ig");
	return text.replace(pattern, "<mark>$1</mark>");
};

const loadFallbackIndex = async (): Promise<FallbackSearchItem[]> => {
	if (fallbackIndex) return fallbackIndex;
	const response = await fetch(url("/search-index.json"));
	if (!response.ok) {
		throw new Error(`Fallback search index not found: ${response.status}`);
	}
	fallbackIndex = await response.json();
	return fallbackIndex || [];
};

const fallbackSearch = async (keyword: string): Promise<SearchResult[]> => {
	const normalizedKeyword = keyword.trim().toLowerCase();
	const index = await loadFallbackIndex();
	return index
		.map((item) => {
			const haystack = [
				item.title,
				item.excerpt,
				item.section,
				...(item.tags || []),
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			if (!haystack.includes(normalizedKeyword)) return null;

			return {
				url: url(item.url),
				meta: { title: item.title },
				excerpt: highlight(item.excerpt, keyword),
			} satisfies SearchResult;
		})
		.filter((item): item is SearchResult => Boolean(item))
		.slice(0, 10);
};

const openPanel = async () => {
	const panel = document.getElementById("search-panel");
	isPanelOpen = true;
	panel?.classList.remove("float-panel-closed");
	await tick();
	searchInput?.focus();
};

const closePanel = () => {
	const panel = document.getElementById("search-panel");
	isPanelOpen = false;
	panel?.classList.add("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel) return;

	if (show && isPanelOpen) {
		panel.classList.remove("float-panel-closed");
	} else {
		isPanelOpen = false;
		panel.classList.add("float-panel-closed");
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else {
			searchResults = await fallbackSearch(keyword);
		}

		result = searchResults;
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(false, isDesktop);
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		console.log("Pagefind status on init:", pagefindLoaded);
		if (keyword) search(keyword, true);
	};

	if (import.meta.env.DEV) {
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			console.log("Pagefind ready event received.");
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			console.warn(
				"Pagefind load error event received. Search functionality will be limited.",
			);
			initializeSearch(); // Initialize with pagefindLoaded as false
		});

		// Fallback in case events are not caught or pagefind is already loaded by the time this script runs
		setTimeout(() => {
			if (!initialized) {
				console.log("Fallback: Initializing search after timeout.");
				initializeSearch();
			}
		}, 2000); // Adjust timeout as needed
	}
});

$: if (initialized && keyword) {
	(async () => {
		await search(keyword, true);
	})();
}
</script>

<!-- search trigger -->
<button on:click={openPanel} aria-label="検索を開く" id="search-switch"
        class="btn-plain scale-animation search-trigger w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search-rounded" class="text-[1.75rem]"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" hidden={!isPanelOpen} class:float-panel-closed={!isPanelOpen} class="float-panel search-panel fixed md:w-[34rem]
top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-3">

    <div id="search-bar" class="flex relative transition-all items-center h-12 rounded-xl
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder="{i18n(I18nKey.search)}" bind:this={searchInput} bind:value={keyword}
               class="pl-10 pr-12 absolute inset-0 text-sm bg-transparent outline-0 text-black/70 dark:text-white/70"
        >
        <button type="button" on:click={closePanel} aria-label="検索を閉じる"
                class="absolute right-2 grid place-items-center w-8 h-8 rounded-lg text-black/45 hover:text-black/70 hover:bg-black/[0.06] dark:text-white/45 dark:hover:text-white/70 dark:hover:bg-white/10">
            <Icon icon="material-symbols:close-rounded" class="text-[1.15rem]"></Icon>
        </button>
    </div>

    <!-- search results -->
    {#each result as item}
        <a href={item.url}
           class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
            <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                {item.meta.title}<Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
            </div>
            <div class="transition text-sm text-50">
                {@html item.excerpt}
            </div>
        </a>
    {/each}
    {#if initialized && keyword && !isSearching && result.length === 0}
        <div class="px-3 py-4 text-sm text-50">
            検索結果が見つかりませんでした。
        </div>
    {/if}
</div>

<style>
  input:focus {
    outline: 0;
  }
  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    z-index: 10000;
  }
  .search-trigger {
    display: inline-grid;
    place-items: center;
    color: #2b2722;
    background: transparent;
    border: 0;
    box-shadow: none;
  }
  .search-trigger:hover {
    color: #8a6408;
    background: transparent;
    transform: translateY(-1px);
  }
</style>
