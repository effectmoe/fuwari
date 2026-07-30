import type { APIRoute } from "astro";
import { getSortedPosts } from "../utils/content-utils";

const staticPages = [
	{
		url: "/",
		title: "AIセントラル",
		excerpt: "記憶を持ったAIを社内の中枢へ組み込むAIシステム。",
		section: "Service",
	},
	{
		url: "/aicrawl/",
		title: "AI CRAWL",
		excerpt: "自社サイトへのAI流入を読み解き、AIが立ち寄るサイトへ変えるAI流入総合分析。",
		section: "Service",
	},
	{
		url: "/ai-agent-course/",
		title: "AI講座",
		excerpt: "AIエージェント、Claude Code、実務AI活用を学ぶ講座ページ。",
		section: "Course",
	},
	{
		url: "/blog/",
		title: "ブログ",
		excerpt: "AI実装、LLMO、知識管理、構造化の公開ノート。",
		section: "Blog",
	},
	{
		url: "/structurepedia/",
		title: "構造化ペディア",
		excerpt: "DFB構造化メソッドをWikipedia風に体系化した大全ページ。",
		section: "Wiki",
	},
	{
		url: "/company/",
		title: "会社概要",
		excerpt: "株式会社EFFECTとeffect.moeの提供体制、サービス、問い合わせ先。",
		section: "Company",
	},
	{
		url: "/changelog/",
		title: "チェンジログ",
		excerpt: "effect.moeのサイト、サービス、問い合わせ導線の改善履歴。",
		section: "Changelog",
	},
];

export const GET: APIRoute = async () => {
	const posts = await getSortedPosts();
	const postItems = posts
		.filter((post) => !post.data.draft)
		.map((post) => ({
			url: `/posts/${post.slug}/`,
			title: post.data.title,
			excerpt: post.data.description || post.data.title,
			section: post.data.category || "Article",
			tags: post.data.tags || [],
		}));

	return new Response(JSON.stringify([...staticPages, ...postItems]), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=300",
		},
	});
};
