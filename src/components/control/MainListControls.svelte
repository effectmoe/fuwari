<script lang="ts">
import { onMount } from "svelte";

export let availableTags: string[] = [];
export let availableCategories: string[] = [];

let selectedTags: string[] = [];
let selectedCategories: string[] = [];
let sortOrder: "newest" | "oldest" = "newest";

// ドロップダウン開閉状態
let tagOpen = false;
let categoryOpen = false;

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

	// 各カードに対応する separator (mobile 下罫線) を事前取得
	type Pair = { card: HTMLElement; sep: HTMLElement | null };
	const pairs: Pair[] = cards.map((card) => {
		const next = card.nextElementSibling as HTMLElement | null;
		const isSep =
			next &&
			next.classList.contains("border-t-[1px]") &&
			next.classList.contains("border-dashed");
		return { card, sep: isSep ? next : null };
	});

	// フィルタ適用
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

	// ソート適用（DOM 並び替え・card と separator をペアで動かす）
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

function closeOnOutside(e: MouseEvent) {
	const target = e.target as HTMLElement;
	if (!target.closest("[data-mlc-dropdown]")) {
		tagOpen = false;
		categoryOpen = false;
	}
}

onMount(() => {
	apply();
	document.addEventListener("click", closeOnOutside);
	return () => document.removeEventListener("click", closeOnOutside);
});
</script>

<div class="card-base px-4 py-3 mb-4 flex flex-row flex-wrap items-center gap-2 text-sm relative" style="z-index: 100;">
    <!-- タグ ドロップダウン -->
    <div class="relative" style="z-index: 101;" data-mlc-dropdown>
        <button
            on:click|stopPropagation={() => { tagOpen = !tagOpen; categoryOpen = false; }}
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
        {#if tagOpen}
            <div
                class="absolute mt-2 left-0 min-w-[14rem] max-h-72 overflow-y-auto rounded-xl card-base p-2 shadow-lg"
                style="background: var(--card-bg); z-index: 9999;"
                on:click|stopPropagation
            >
                {#each availableTags as tag}
                    <button
                        on:click={() => toggleTag(tag)}
                        class="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <span class="w-4 inline-block text-[var(--primary)]">
                            {selectedTags.includes(tag) ? "✓" : ""}
                        </span>
                        <span>{tag}</span>
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <!-- カテゴリ ドロップダウン -->
    <div class="relative" style="z-index: 101;" data-mlc-dropdown>
        <button
            on:click|stopPropagation={() => { categoryOpen = !categoryOpen; tagOpen = false; }}
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
        {#if categoryOpen}
            <div
                class="absolute mt-2 left-0 min-w-[12rem] rounded-xl card-base p-2 shadow-lg"
                style="background: var(--card-bg); z-index: 9999;"
                on:click|stopPropagation
            >
                {#each availableCategories as cat}
                    <button
                        on:click={() => toggleCategory(cat)}
                        class="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <span class="w-4 inline-block text-[var(--primary)]">
                            {selectedCategories.includes(cat) ? "✓" : ""}
                        </span>
                        <span>{cat}</span>
                    </button>
                {/each}
            </div>
        {/if}
    </div>

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

    <!-- 右側：件数 + クリア -->
    <div class="ml-auto flex items-center gap-2 text-xs text-50">
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
</div>
