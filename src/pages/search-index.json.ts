import type { APIRoute } from "astro";
import { getSortedPosts } from "../utils/content-utils";

const staticPages = [
	{
		url: "/",
		title: "AIセントラル",
		excerpt: "記憶を持ったAIを社内の中枢へ組み込むAIシステム。ローカルLLM、社内完結型AI、AIエージェントのセキュリティ設計にも対応。",
		section: "Service",
	},
	{
		url: "/#secure",
		title: "AIセントラル パーフェクトセキュア",
		excerpt: "顧客情報・個人情報・守秘義務が前提の業務向けに、社内PCや社内ネットワーク内でAIを扱う構成を検討できます。",
		section: "Security",
	},
	{
		url: "/faq/#security",
		title: "ローカルLLM・社内完結型AIのFAQ",
		excerpt: "クラウドAIとの違い、AIエージェントのセキュリティ対策、マスキング、権限管理、承認フローについて。",
		section: "FAQ",
	},
	{
		url: "/aicrawl/",
		title: "AI CRAWL",
		excerpt: "AIが自社をどう扱っているかを実測し、AIに紹介されるのを偶然から再現性に変える。",
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
