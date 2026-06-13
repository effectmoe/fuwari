import type { APIRoute } from "astro";
import { profileConfig, seoConfig, siteConfig } from "../config";
import { getSortedPosts } from "../utils/content-utils";

/**
 * llms.txt — AI クローラ / LLM 向けのサイト要約標準
 * https://llmstxt.org/
 *
 * 構造化軸: 「構造化」を核に、LLMO・AIシステム構築・AIアプリ開発・コンサルへ。
 * AI 検索エンジン（ChatGPT / Perplexity / Claude / Gemini）が
 * このサイトと著者の専門性を機械可読に把握できるようにする。
 * 2026-06-14 SEO/LLMO 全面対策で新設
 */
export const GET: APIRoute = async (context) => {
	const site = context.site?.toString() || "/";
	const posts = await getSortedPosts();

	const articleLines = posts
		.filter((p) => !p.data.draft)
		.map((p) => {
			const url = new URL(`/posts/${p.slug}/`, site).toString();
			const desc = p.data.description || p.data.title;
			return `- [${p.data.title}](${url}): ${desc}`;
		})
		.join("\n");

	const body = `# ${siteConfig.title}（${siteConfig.subtitle}）

> ${profileConfig.bio}

このサイトは「**構造化**」を核に据えた AI 実装ノートです。「構造化できる人＝AI時代の勝者」という思想のもと、以下を一気通貫で扱います。

- **構造化 = LLMO**: 情報を AI が引用しやすい構造にする（LLMO対策・LLMOライティング・AI検索最適化・E-E-A-T）
- **構造化 = AIシステム**: 社内業務を AI に落とす（AI社員・AIエージェント・社内AIシステム構築・業務AI自動化）
- **構造化 = ヒューマンスキル**: AI時代に人に残る能力としての構造化思考（DFB理論 = 分・枠・組）

## 著者（Author / E-E-A-T）

- 氏名: ${profileConfig.name}
- 肩書: ${seoConfig.jobTitle}
- 運営: ${seoConfig.organization.name}（${seoConfig.organization.url}）
- 専門領域（knowsAbout）: ${seoConfig.knowsAbout.join(" / ")}
- 権威プロフィール（sameAs）:
${seoConfig.sameAs.map((u) => `  - ${u}`).join("\n")}

著者はストアカ人気講師（LLMO・Claude Code・AIエージェント・Notion・GA4・E-E-A-T 等の講座を多数開講）であり、LLMO 対策の書籍著者でもあります。本サイトの技術実装（構造化データ・LLMO 最適化）自体が、著者の専門性の実証事例です。

## 実績・評価（第三者評価 / ストアカ）

- 総合評価: ${seoConfig.reviews.ratingValue} / 5（レビュー ${seoConfig.reviews.reviewCount} 件）
- 累計受講者数: ${seoConfig.reviews.studentsTaught} 人
- 開催回数: ${seoConfig.reviews.sessionsTaught} 回
- リピート率: ${seoConfig.reviews.repeatRate}
- ランク: ${seoConfig.reviews.badge}
- 出典: ${seoConfig.reviews.reviewUrl}

## 提供サービス（実益）

- AIを中心に据えたシステム構築サービス（社内AIシステム構築）
- AIアプリ開発
- LLMOサービス（LLMO対策・AI検索最適化の代行/コンサル）
- AIコンサルティング

## 主要キーワード

${seoConfig.keywords.join(" / ")}

## 記事一覧（Articles）

${articleLines}

## ナビゲーション

- ホーム: ${site}
- 記事アーカイブ: ${site}archive/
- 著者について: ${site}about/
- RSS: ${site}rss.xml
- サイトマップ: ${site}sitemap-index.xml
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
