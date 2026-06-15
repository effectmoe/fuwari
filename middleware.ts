/**
 * Vercel Edge Middleware — tony.effect.moe AI Crawler 監視
 *
 * effect.moe の functions/_middleware.js (Cloudflare Pages) を Vercel Edge Runtime 向けに移植。
 * 元: ~/Projects/effect-site/acacia-studio/functions/_middleware.js
 *
 * 動作:
 *   1. 全リクエスト横断で User-Agent を 22 パターンの AI Bot とマッチ
 *   2. 検出時に [AI_CRAWLER] プレフィックスで Vercel Logs に構造化 JSON 出力
 *   3. 環境変数 NOTION_API_TOKEN + TONY_HITS_DB_ID が設定されていれば、
 *      Notion DB に行を 1 件 POST（waitUntil でレスポンス遅延ゼロ）
 *
 * Vercel Logs 検索: https://vercel.com/effectmoes-projects/fuwari/logs → [AI_CRAWLER]
 * Notion ダッシュボード: https://app.notion.com/p/380b802cb0c681c3b2c1d760ae38ba0f
 */

export const config = {
	// 静的アセット・Vercel内部パスは除外（性能影響ゼロ）
	matcher:
		"/((?!_vercel|_astro|favicon|robots\\.txt|sitemap|.*\\.(?:js|css|mjs|map|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp4|webm|pdf)$).*)",
};

const AI_CRAWLERS: ReadonlyArray<{ name: string; pattern: string }> = [
	{ name: "GPTBot", pattern: "GPTBot" },
	{ name: "ChatGPT-User", pattern: "ChatGPT-User" },
	{ name: "ClaudeBot", pattern: "ClaudeBot" },
	{ name: "anthropic-ai", pattern: "anthropic-ai" },
	{ name: "PerplexityBot", pattern: "PerplexityBot" },
	{ name: "Google-Extended", pattern: "Google-Extended" },
	{ name: "Googlebot", pattern: "Googlebot" },
	{ name: "Bingbot", pattern: "bingbot" },
	{ name: "BingPreview", pattern: "BingPreview" },
	{ name: "Bytespider", pattern: "Bytespider" },
	{ name: "CCBot", pattern: "CCBot" },
	{ name: "cohere-ai", pattern: "cohere-ai" },
	{ name: "YouBot", pattern: "YouBot" },
	{ name: "FacebookBot", pattern: "FacebookBot" },
	{ name: "Applebot", pattern: "Applebot" },
	{ name: "Diffbot", pattern: "Diffbot" },
	{ name: "ImagesiftBot", pattern: "ImagesiftBot" },
	{ name: "omgili", pattern: "omgili" },
	{ name: "Pinterestbot", pattern: "Pinterestbot" },
	{ name: "SemrushBot", pattern: "SemrushBot" },
	{ name: "AhrefsBot", pattern: "AhrefsBot" },
	{ name: "DotBot", pattern: "DotBot" },
];

const NOTION_VERSION = "2022-06-28";

interface VercelEdgeContext {
	waitUntil(promise: Promise<unknown>): void;
}

async function recordToNotion(
	token: string,
	dbId: string,
	row: {
		ts: string;
		crawler: string;
		path: string;
		ip: string;
		referer: string;
		ua: string;
		region: string;
	},
): Promise<void> {
	const refererUrl = (() => {
		try {
			if (row.referer) return new URL(row.referer).toString();
		} catch {
			// invalid URL → null 扱い
		}
		return null;
	})();

	const body = {
		parent: { database_id: dbId },
		properties: {
			Title: {
				title: [
					{
						text: {
							content: `${row.crawler} ${row.path}`.slice(0, 200),
						},
					},
				],
			},
			Timestamp: { date: { start: row.ts } },
			Crawler: { select: { name: row.crawler } },
			Path: { rich_text: [{ text: { content: row.path.slice(0, 1900) } }] },
			IP: { rich_text: [{ text: { content: row.ip.slice(0, 200) } }] },
			Referer: refererUrl ? { url: refererUrl } : { url: null },
			UserAgent: { rich_text: [{ text: { content: row.ua.slice(0, 1900) } }] },
			Region: { rich_text: [{ text: { content: row.region.slice(0, 200) } }] },
		},
	};

	try {
		const r = await fetch("https://api.notion.com/v1/pages", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Notion-Version": NOTION_VERSION,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		if (!r.ok) {
			const text = await r.text();
			console.error(`[NOTION_ERR] ${r.status}: ${text.slice(0, 200)}`);
		}
	} catch (e) {
		console.error(
			`[NOTION_ERR] fetch failed: ${e instanceof Error ? e.message : String(e)}`,
		);
	}
}

export default function middleware(
	request: Request,
	context: VercelEdgeContext,
) {
	const ua = request.headers.get("user-agent") || "";
	const uaLower = ua.toLowerCase();

	const crawler = AI_CRAWLERS.find((c) =>
		uaLower.includes(c.pattern.toLowerCase()),
	);

	if (!crawler) return;

	const url = new URL(request.url);
	const row = {
		ts: new Date().toISOString(),
		crawler: crawler.name,
		path: url.pathname + url.search,
		ip:
			request.headers.get("x-real-ip") ||
			request.headers.get("x-forwarded-for") ||
			request.headers.get("cf-connecting-ip") ||
			"",
		referer: request.headers.get("referer") || "",
		ua,
		region: request.headers.get("x-vercel-id") || "",
	};

	// Vercel Logs に [AI_CRAWLER] プレフィックス付きで構造化出力
	console.log(
		`[AI_CRAWLER] ${JSON.stringify({ site: "tony.effect.moe", ...row })}`,
	);

	// Notion DB に同時記録（環境変数が両方揃っているときのみ）
	const token = process.env.NOTION_API_TOKEN;
	const dbId = process.env.TONY_HITS_DB_ID;
	if (token && dbId && context?.waitUntil) {
		context.waitUntil(recordToNotion(token, dbId, row));
	}

	// pass-through（書き換え・リダイレクトなし）
	return;
}
