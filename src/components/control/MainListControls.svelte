<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

export let availableTags: string[] = [];
export let availableCategories: string[] = [];
export let shareUrl = "";
export let shareTitle = "";

let selectedTags: string[] = [];
let selectedCategories: string[] = [];
let sortOrder: "newest" | "oldest" = "newest";

let tagOpen = false;
let categoryOpen = false;
let copyToast = false;

const encodedUrl = () => encodeURIComponent(shareUrl);
const encodedTitle = () => encodeURIComponent(shareTitle);

async function copyUrl() {
	try {
		await navigator.clipboard.writeText(shareUrl);
	} catch {
		try {
			const ta = document.createElement("textarea");
			ta.value = shareUrl;
			ta.style.position = "fixed";
			ta.style.top = "-1000px";
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			document.body.removeChild(ta);
		} catch {
			return;
		}
	}
	copyToast = true;
	setTimeout(() => {
		copyToast = false;
	}, 1800);
}

let visibleCount = 0;

function toggleTag(tag: string) {
	selectedTags = selectedTags.includes(tag)
		? selectedTags.filter((t) => t !== tag)
		: [...selectedTags, tag];
	apply();
}

function toggleCategory(cat: string) {
	selectedCategories = selectedCategories.includes(cat)
		? selectedCategories.filter((c) => c !== cat)
		: [...selectedCategories, cat];
	apply();
}

function setSort(order: "newest" | "oldest") {
	sortOrder = order;
	apply();
}

function clearAll() {
	selectedTags = [];
	selectedCategories = [];
	apply();
}

function apply() {
	if (typeof document === "undefined") return;
	const cards = Array.from(
		document.querySelectorAll<HTMLElement>("[data-post-card]"),
	);
	let shown = 0;

	type Pair = { card: HTMLElement; sep: HTMLElement | null };
	const pairs: Pair[] = cards.map((card) => {
		const next = card.nextElementSibling as HTMLElement | null;
		const isSep =
			next &&
			next.classList.contains("border-t-[1px]") &&
			next.classList.contains("border-dashed");
		return { card, sep: isSep ? next : null };
	});

	for (const { card, sep } of pairs) {
		const tagStr = card.dataset.postTags ?? "";
		const cat = card.dataset.postCategory ?? "";
		const cardTags = tagStr ? tagStr.split("|") : [];

		const tagMatch =
			selectedTags.length === 0 ||
			cardTags.some((t) => selectedTags.includes(t));
		const catMatch =
			selectedCategories.length === 0 || selectedCategories.includes(cat);

		const show = tagMatch && catMatch;
		card.style.display = show ? "" : "none";
		if (sep) sep.style.display = show ? "" : "none";
		if (show) shown++;
	}

	const parent = cards[0]?.parentElement;
	if (parent) {
		const visiblePairs = pairs.filter((p) => p.card.style.display !== "none");
		visiblePairs.sort((a, b) => {
			const da = new Date(a.card.dataset.postPublished ?? 0).getTime();
			const db = new Date(b.card.dataset.postPublished ?? 0).getTime();
			return sortOrder === "newest" ? db - da : da - db;
		});
		for (const { card, sep } of visiblePairs) {
			parent.appendChild(card);
			if (sep) parent.appendChild(sep);
		}
	}

	visibleCount = shown;
}

onMount(() => {
	apply();
});
</script>

<div class="card-base px-4 py-3 mb-4 text-sm">
    <!-- 1 行目: ボタン群 -->
    <div class="flex flex-row flex-wrap items-center gap-2">
        <!-- タグ ボタン -->
        <button
            on:click={() => { tagOpen = !tagOpen; }}
            class="flex items-center gap-1 px-3 py-1.5 rounded-full font-medium transition active:scale-95"
            style={selectedTags.length > 0
                ? "background: var(--primary); color: white;"
                : "background: var(--btn-plain-bg); color: var(--btn-content);"}
        >
            <span>タグ</span>
            {#if selectedTags.length > 0}
                <span class="text-xs opacity-90">({selectedTags.length})</span>
            {/if}
            <span class="text-xs">{tagOpen ? "▲" : "▼"}</span>
        </button>

        <!-- カテゴリ ボタン -->
        <button
            on:click={() => { categoryOpen = !categoryOpen; }}
            class="flex items-center gap-1 px-3 py-1.5 rounded-full font-medium transition active:scale-95"
            style={selectedCategories.length > 0
                ? "background: var(--primary); color: white;"
                : "background: var(--btn-plain-bg); color: var(--btn-content);"}
        >
            <span>カテゴリ</span>
            {#if selectedCategories.length > 0}
                <span class="text-xs opacity-90">({selectedCategories.length})</span>
            {/if}
            <span class="text-xs">{categoryOpen ? "▲" : "▼"}</span>
        </button>

        <!-- ソート ボタン群 -->
        <div class="flex items-center gap-1 ml-1">
            <button
                on:click={() => setSort("newest")}
                class="px-3 py-1.5 rounded-full text-xs font-medium transition active:scale-95"
                style={sortOrder === "newest"
                    ? "background: var(--primary); color: white;"
                    : "background: var(--btn-plain-bg); color: var(--btn-content);"}
            >
                ↓ 新着順
            </button>
            <button
                on:click={() => setSort("oldest")}
                class="px-3 py-1.5 rounded-full text-xs font-medium transition active:scale-95"
                style={sortOrder === "oldest"
                    ? "background: var(--primary); color: white;"
                    : "background: var(--btn-plain-bg); color: var(--btn-content);"}
            >
                ↑ 古い順
            </button>
        </div>

        <!-- 件数 + クリア (ソートの直後) -->
        <div class="flex items-center gap-2 text-xs text-50 ml-2">
            <span>{visibleCount} 件</span>
            {#if selectedTags.length > 0 || selectedCategories.length > 0}
                <button
                    on:click={clearAll}
                    class="underline hover:text-75 active:scale-95"
                >
                    クリア
                </button>
            {/if}
        </div>

        <!-- 右側：シェア -->
        <div class="ml-auto flex items-center gap-2 text-xs text-50">
            {#if shareUrl}
                <div class="flex items-center gap-1 mr-1 relative">
                    <button
                        type="button"
                        on:click={copyUrl}
                        aria-label="URLをコピー"
                        title="URLをコピー"
                        class="share-mini flex items-center justify-center w-7 h-7 rounded-full transition active:scale-95 hover:scale-110"
                        style="background: var(--btn-plain-bg); color: var(--btn-content);"
                    >
                        <Icon icon="material-symbols:content-copy-rounded" width="14" height="14" />
                    </button>
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebookで共有"
                        title="Facebookで共有"
                        class="share-mini flex items-center justify-center w-7 h-7 rounded-full transition active:scale-95 hover:scale-110"
                        style="background: var(--btn-plain-bg); color: var(--btn-content);"
                    >
                        <Icon icon="fa6-brands:facebook-f" width="12" height="12" />
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodedUrl()}&text=${encodedTitle()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Xで共有"
                        title="Xで共有"
                        class="share-mini flex items-center justify-center w-7 h-7 rounded-full transition active:scale-95 hover:scale-110"
                        style="background: var(--btn-plain-bg); color: var(--btn-content);"
                    >
                        <Icon icon="fa6-brands:x-twitter" width="12" height="12" />
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedInで共有"
                        title="LinkedInで共有"
                        class="share-mini flex items-center justify-center w-7 h-7 rounded-full transition active:scale-95 hover:scale-110"
                        style="background: var(--btn-plain-bg); color: var(--btn-content);"
                    >
                        <Icon icon="fa6-brands:linkedin-in" width="12" height="12" />
                    </a>
                    {#if copyToast}
                        <span class="absolute -bottom-6 right-0 text-xs text-[var(--primary)] font-medium whitespace-nowrap">
                            ✓ コピーしました
                        </span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    <!-- 2 行目: タグ展開（チップ） -->
    {#if tagOpen}
        <div class="mt-3 pt-3 border-t border-black/5 dark:border-white/5">
            <div class="flex flex-wrap gap-1.5">
                {#each availableTags as tag}
                    <button
                        on:click={() => toggleTag(tag)}
                        class="px-3 py-1 rounded-full text-xs font-medium transition active:scale-95"
                        style={selectedTags.includes(tag)
                            ? "background: var(--primary); color: white;"
                            : "background: var(--btn-plain-bg); color: var(--btn-content);"}
                    >
                        {tag}
                    </button>
                {/each}
            </div>
        </div>
    {/if}

    <!-- 2 行目: カテゴリ展開（チップ） -->
    {#if categoryOpen}
        <div class="mt-3 pt-3 border-t border-black/5 dark:border-white/5">
            <div class="flex flex-wrap gap-1.5">
                {#each availableCategories as cat}
                    <button
                        on:click={() => toggleCategory(cat)}
                        class="px-3 py-1 rounded-full text-xs font-medium transition active:scale-95"
                        style={selectedCategories.includes(cat)
                            ? "background: var(--primary); color: white;"
                            : "background: var(--btn-plain-bg); color: var(--btn-content);"}
                    >
                        {cat}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
.share-mini:hover {
    background: var(--btn-plain-bg-hover) !important;
    color: var(--primary) !important;
}
</style>
