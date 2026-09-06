import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		/* 記事本文のH1だけ、語の途中で不自然に割れないよう表示行を明示する。
		   title・OGP・構造化データには使わず、未指定時は title をそのまま表示する。 */
		titleLines: z.array(z.string()).optional().default([]),
		fullTitle: z.boolean().optional().default(false),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		thumbnail: z.string().optional().default(""),
		/* カバー画像の alt（LLMO/SEO/アクセシビリティ強化・任意）
		   - 未指定時は「title｜description」が自動入る
		   - 漫画記事など、画像の内容が title と乖離する時に明示推奨
		   - 例: "アンドロイド・カガミがメモの星座を描く4コマ漫画。第2の脳構築を象徴する水彩イラスト" */
		imageAlt: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* 関連講座CTA: courseConfig の id を指定すると記事末にその講座を誘導表示。
		   未指定なら tags から自動マッチ（SEO/LLMO v2 2026-06-14）。
		   "none" を指定すると非表示。 */
		course: z.string().optional().default(""),

		/* 自社サービスCTA: serviceConfig の id（"aicrawl" / "ai-central"）。
		   未指定なら tags から自動マッチし、当たらなければ非表示（fallback無し）。
		   "none" で明示的に非表示。講座CTAより上に描画される。2026-08-01 */
		service: z.string().optional().default(""),

		/* 用語の補足・FAQ（クラスターFAQ / 難語の注記）。
		   記事末に表示 + FAQPage 構造化データ化（トピッククラスター・2026-06-14）*/
		faq: z
			.array(
				z.object({
					q: z.string(),
					a: z.string(),
				}),
			)
			.optional()
			.default([]),

		/* 関連リンク（コンポーネント描画。CTA の下に配置）。
		   講座リンクは CTA が自動表示するので、ここには他記事・出典のみ。2026-06-14 */
		relatedLinks: z
			.array(
				z.object({
					label: z.string(),
					href: z.string(),
				}),
			)
			.optional()
			.default([]),

		/* 参照した外部記事・ブックマーク。
		   記事末で、関連リンク・FAQ の後に表示する。 */
		sourceLinks: z
			.array(
				z.object({
					label: z.string(),
					href: z.string(),
				}),
			)
			.optional()
			.default([]),

		/* 一覧サムネ隅のアイキャッチ文字バッジ（A案）。
		   未指定なら tags[0] から自動。"none" で非表示。2026-06-14 */
		badge: z.string().optional().default(""),

		/* astro-blog skill v1.10 - TL;DR マンガ */
		manga_tldr: z
			.array(
				z.object({
					src: z.string(),
					caption: z.string(),
				}),
			)
			.optional(),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
