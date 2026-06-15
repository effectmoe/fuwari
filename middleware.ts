/**
 * Vercel Edge Middleware — tony.effect.moe AI Crawler 監視（IP検証版）
 *
 * 1. UA を 22 パターンの AI Bot とマッチ
 * 2. **クライアント IP を公式 IP レンジと CIDR 照合**（偽装 UA を弾く）
 * 3. ✅ verified 時のみ Notion DB に記録
 * 4. ❌ verified 失敗 (UA詐称) は Vercel Logs に [AI_CRAWLER_REJECTED] として記録（DB には入れない）
 *
 * IP レンジ出典 (bot-ip-ranges.json):
 *   - OpenAI: https://openai.com/{gptbot,chatgpt-user,searchbot}.json
 *   - Google: https://developers.google.com/search/apis/ipranges/*.json
 *   - Anthropic ClaudeBot: 160.79.104.0/23 (公式公表分)
 *
 * 制限:
 *   - IPv6 アドレスは現状 verified=false（要追加実装）
 *   - 検証対象外のクローラ (Bytespider, Bingbot 等) は verified=false で DB 書込しない
 */

import IP_RANGES from "./bot-ip-ranges.json";

export const config = {
	matcher:
		"/((?!_vercel|_astro|favicon|robots\\.txt|sitemap|.*\\.(?:js|css|mjs|map|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp4|webm|pdf)$).*)",
};

const AI_CRAWLERS: ReadonlyArray<{ name: string; pattern: string }> = [
	{ name: "GPTBot", pattern: "GPTBot" },
	{ name: "ChatGPT-User", pattern: "ChatGPT-User" },
	{ name: "OAI-SearchBot", pattern: "OAI-SearchBot" },
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

// === IPv4 CIDR matching ===
function ipv4ToNumber(ip: string): number {
	const parts = ip.split(".");
	if (parts.length !== 4) return -1;
	let n = 0;
	for (const oct of parts) {
		const o = Number.parseInt(oct, 10);
		if (Number.isNaN(o) || o < 0 || o > 255) return -1;
		n = n * 256 + o;
	}
	return n;
}

function cidrMatch(ip: string, cidr: string): boolean {
	const slash = cidr.indexOf("/");
	const baseStr = slash === -1 ? cidr : cidr.slice(0, slash);
	const bits = slash === -1 ? 32 : Number.parseInt(cidr.slice(slash + 1), 10);

	// IPv6 は現状未対応
	if (baseStr.includes(":") || ip.includes(":")) return false;
	if (!ip.includes(".") || !baseStr.includes(".")) return false;

	const ipNum = ipv4ToNumber(ip);
	const baseNum = ipv4ToNumber(baseStr);
	if (ipNum < 0 || baseNum < 0) return false;

	const mask = bits === 0 ? 0 : (~((1 << (32 - bits)) - 1)) >>> 0;
	return ((ipNum & mask) >>> 0) === ((baseNum & mask) >>> 0);
}

function verifyCrawlerIP(crawler: string, ip: string): boolean {
	const ranges = (IP_RANGES.ranges as Record<string, string[]>)[crawler];
	if (!ranges || ranges.length === 0) return false;
	for (const cidr of ranges) {
		if (cidrMatch(ip, cidr)) return true;
	}
	return false;
}

// === Notion 書き込み ===
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
			/* invalid URL */
		}
		return null;
	})();

	const body = {
		parent: { database_id: dbId },
		properties: {
			Title: {
				title: [
					{ text: { content: `${row.crawler} ${row.path}`.slice(0, 200) } },
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

// === Middleware 本体 ===
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
	const ip =
		(request.headers.get("x-real-ip") ||
			request.headers.get("x-forwarded-for") ||
			"")
			.split(",")[0]
			.trim();

	const verified = verifyCrawlerIP(crawler.name, ip);

	const baseRow = {
		ts: new Date().toISOString(),
		crawler: crawler.name,
		path: url.pathname + url.search,
		ip,
		referer: request.headers.get("referer") || "",
		ua,
		region: request.headers.get("x-vercel-id") || "",
	};

	if (verified) {
		// 本物 → Vercel Logs + Notion
		console.log(
			`[AI_CRAWLER] ${JSON.stringify({ site: "tony.effect.moe", verified: true, ...baseRow })}`,
		);
		const token = process.env.NOTION_API_TOKEN;
		const dbId = process.env.TONY_HITS_DB_ID;
		if (token && dbId && context?.waitUntil) {
			context.waitUntil(recordToNotion(token, dbId, baseRow));
		}
	} else {
		// 偽装 UA → Vercel Logs にだけ記録（DB には入れない）
		console.warn(
			`[AI_CRAWLER_REJECTED] ${JSON.stringify({ site: "tony.effect.moe", verified: false, reason: "ip_not_in_official_range", ...baseRow })}`,
		);
	}

	return;
}
