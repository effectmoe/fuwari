<script lang="ts">
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];

// URL クエリパラメータから初期フィルタ取得（既存挙動を維持）
if (typeof window !== "undefined") {
	const params = new URLSearchParams(window.location.search);
	if (params.has("tag")) tags = params.getAll("tag");
	if (params.has("category")) categories = params.getAll("category");
}

interface Post {
	slug: string;
	data: {
		title: string;
		tags: string[];
		category?: string;
		published: Date;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

// 利用可能な全タグ・全カテゴリを集計
const availableTags: string[] = Array.from(
	new Set(sortedPosts.flatMap((p) => p.data.tags || []))
).sort();
const availableCategories: string[] = Array.from(
	new Set(sortedPosts.map((p) => p.data.category).filter((c): c is string => !!c))
).sort();

// 選択状態（リアクティブ）
let selectedTags: string[] = tags;
let selectedCategories: string[] = categories;
let sortOrder: "newest" | "oldest" = "newest";

function toggleTag(tag: string) {
	selectedTags = selectedTags.includes(tag)
		? selectedTags.filter((t) => t !== tag)
		: [...selectedTags, tag];
}
function toggleCategory(cat: string) {
	selectedCategories = selectedCategories.includes(cat)
		? selectedCategories.filter((c) => c !== cat)
		: [...selectedCategories, cat];
}
function clearAll() {
	selectedTags = [];
	selectedCategories = [];
}

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

// リアクティブにフィルタ + ソート結果を計算
$: filteredPosts = (() => {
	let result = [...sortedPosts];
	if (selectedTags.length > 0) {
		result = result.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => selectedTags.includes(tag)),
		);
	}
	if (selectedCategories.length > 0) {
		result = result.filter(
			(post) =>
				post.data.category &&
				selectedCategories.includes(post.data.category),
		);
	}
	// ソート
	result.sort((a, b) => {
		const ta = new Date(a.data.published).getTime();
		const tb = new Date(b.data.published).getTime();
		return sortOrder === "newest" ? tb - ta : ta - tb;
	});
	return result;
})();

$: groups = (() => {
	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = new Date(post.data.published).getFullYear();
			if (!acc[year]) acc[year] = [];
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);
	const arr: Group[] = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));
	arr.sort((a, b) => (sortOrder === "newest" ? b.year - a.year : a.year - b.year));
	return arr;
})();
</script>

<!-- フィルタ + ソートバー -->
<div class="card-base px-6 py-5 mb-4">
    <!-- タグ -->
    {#if availableTags.length > 0}
        <div class="mb-3">
            <div class="text-sm font-bold text-75 mb-2">タグで絞り込み</div>
            <div class="flex flex-wrap gap-1.5">
                {#each availableTags as tag}
                    <button
                        on:click={() => toggleTag(tag)}
                        class="px-3 py-1 rounded-full text-xs font-medium transition active:scale-95"
                        class:bg-primary={selectedTags.includes(tag)}
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

    <!-- カテゴリ -->
    {#if availableCategories.length > 0}
        <div class="mb-3">
            <div class="text-sm font-bold text-75 mb-2">カテゴリで絞り込み</div>
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

    <!-- ソート + クリア -->
    <div class="flex flex-row items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-75">並び順</span>
            <button
                on:click={() => (sortOrder = "newest")}
                class="px-3 py-1 rounded-full text-xs font-medium transition active:scale-95"
                style={sortOrder === "newest"
                    ? "background: var(--primary); color: white;"
                    : "background: var(--btn-plain-bg); color: var(--btn-content);"}
            >
                新着順
            </button>
            <button
                on:click={() => (sortOrder = "oldest")}
                class="px-3 py-1 rounded-full text-xs font-medium transition active:scale-95"
                style={sortOrder === "oldest"
                    ? "background: var(--primary); color: white;"
                    : "background: var(--btn-plain-bg); color: var(--btn-content);"}
            >
                古い順
            </button>
        </div>
        {#if selectedTags.length > 0 || selectedCategories.length > 0}
            <button
                on:click={clearAll}
                class="text-xs underline text-50 hover:text-75 active:scale-95"
            >
                絞り込みクリア
            </button>
        {/if}
    </div>

    <!-- 件数表示 -->
    <div class="text-xs text-50 mt-3 pt-3 border-t border-black/5 dark:border-white/5">
        {filteredPosts.length} 件の記事
        {#if selectedTags.length > 0 || selectedCategories.length > 0}
            （絞り込み中）
        {/if}
    </div>
</div>

<!-- 結果リスト -->
<div class="card-base px-8 py-6">
    {#if groups.length === 0}
        <div class="text-center py-8 text-50">
            条件に合う記事がありません
        </div>
    {/if}
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                        class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                    ></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                </div>
            </div>

            {#each group.posts as post}
                <a
                    href={getPostUrlBySlug(post.slug)}
                    aria-label={post.data.title}
                    class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
                >
                    <div class="flex flex-row justify-start items-center h-full">
                        <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div
                                class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
                            ></div>
                        </div>
                        <div
                            class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
                        >
                            {post.data.title}
                        </div>
                        <div
                            class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
                        >
                            {formatTag(post.data.tags)}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
</div>
