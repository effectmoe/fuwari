import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		thumbnail: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* 関連講座CTA: courseConfig の id を指定すると記事末にその講座を誘導表示。
		   未指定なら tags から自動マッチ（SEO/LLMO v2 2026-06-14）。
		   "none" を指定すると非表示。 */
		course: z.string().optional().default(""),

		/* 用語の補足・FAQ（クラスターFAQ / 難語の注記）。
		   記事末に表示 + FAQPage 構造化データ化（トピッククラスター・2026-06-14）*/
		faq: z.array(z.object({
			q: z.string(),
			a: z.string(),
		})).optional().default([]),

		/* astro-blog skill v1.10 - TL;DR マンガ */
		manga_tldr: z.array(z.object({
			src: z.string(),
			caption: z.string(),
		})).optional(),

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
