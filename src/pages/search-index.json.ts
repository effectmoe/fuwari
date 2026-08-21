import type { APIRoute } from "astro";
import { getSortedPosts } from "../utils/content-utils";
import { getPublicStaticPages } from "../utils/public-page-index";

const curatedSearchMetadata: Record<string, { title?: string; excerpt: string; section: string }> = {
	"/": {
		title: "AIセントラル",
		excerpt:
			"記憶を持ったAIを社内の中枢へ組み込むAIシステム。ローカルLLM、社内完結型AI、AIエージェントのセキュリティ設計にも対応。",
		section: "Service",
	},
	"/aicrawl/": {
		excerpt: "AIが自社をどう扱っているかを実測し、AIに紹介されるのを偶然から再現性に変える。",
		section: "Service",
	},
	"/ai-agent-course/": {
		excerpt: "AIエージェント、Claude Code、実務AI活用を学ぶ講座ページ。",
		section: "Course",
	},
	"/author/": {
		excerpt:
			"シュ コウメイのプロフィール。AI・DX、AIシステム、AIセキュリティ、AI検索、Notionの実装・講座・伴走を扱います。",
		section: "Author",
	},
	"/company/": {
		excerpt: "株式会社EFFECTとeffect.moeの提供体制、サービス、問い合わせ先。",
		section: "Company",
	},
	"/llmo/": {
		excerpt:
			"AI検索時代のSEO対策（LLMO）の考え方、Googleの案内の読み解き方、情報設計と測定の始め方。",
		section: "Guide",
	},
	"/structurepedia/": {
		excerpt: "DFB構造化メソッドをWikipedia風に体系化した大全ページ。",
		section: "Wiki",
	},
};

const supplementalSearchItems = [
	{
		url: "/#secure",
		title: "AIセントラル パーフェクトセキュア",
		excerpt:
			"顧客情報・個人情報・守秘義務が前提の業務向けに、社内PCや社内ネットワーク内でAIを扱う構成を検討できます。",
		section: "Security",
	},
	{
		url: "/faq/#security",
		title: "ローカルLLM・社内完結型AIのFAQ",
		excerpt:
			"クラウドAIとの違い、AIエージェントのセキュリティ対策、マスキング、権限管理、承認フローについて。",
		section: "FAQ",
	},
];

export const GET: APIRoute = async () => {
	const posts = await getSortedPosts();
	const staticPages = getPublicStaticPages().map((page) => {
		const metadata = curatedSearchMetadata[page.href];
		return {
			url: page.href,
			title: metadata?.title || page.label,
			excerpt: metadata?.excerpt || page.description,
			section: metadata?.section || "Page",
		};
	});
	const postItems = posts
		.filter((post) => !post.data.draft)
		.map((post) => ({
			url: `/posts/${post.slug}/`,
			title: post.data.title,
			excerpt: post.data.description || post.data.title,
			section: post.data.category || "Article",
			tags: post.data.tags || [],
		}));

	return new Response(JSON.stringify([...staticPages, ...supplementalSearchItems, ...postItems]), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "public, max-age=300",
		},
	});
};
