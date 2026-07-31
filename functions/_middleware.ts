const LEGACY_HOSTS = new Set(["tony.effect.moe", "www.tony.effect.moe"]);
const CANONICAL_ORIGIN = "https://effect.moe";

const LEGACY_REDIRECTS: Record<string, string> = {
	"/": "/blog/",
	"/about/": "/author/",
	"/author/": "/author/",
	"/blog/": "/blog/",
	"/archive/": "/archive/",
	"/structurepedia/": "/structurepedia/",
	"/dfb-complete-guide/": "/dfb-complete-guide/",
	"/ai-agent-course/": "/ai-agent-course/",
	"/ai-agent-course-select/": "/ai-agent-course-select/",
	"/ai-agent-course-advanced/": "/ai-agent-course-advanced/",
	"/faq/": "/faq/",
	"/rss.xml": "/rss.xml",
	"/robots.txt": "/robots.txt",
	"/sitemap.xml": "/sitemap-index.xml",
	"/sitemap-index.xml": "/sitemap-index.xml",
};

/* ------------------------------------------------------------------
 * AI クローラー巡回ログ
 *
 * Cloudflare Pages には Xserver/さくらのような access_log が無いため、
 * AI bot のリクエストだけをここで D1 に記録する。
 * これが週次 AI 流入レポート（月額3,300円プラン）の一次データ源になる。
 *
 * 【来歴】旧 tony.effect.moe では Vercel Edge Middleware が同等の記録を
 * Notion DB へ書いていた（2026-06〜07）。2026-08 の effect.moe 統合時に
 * その middleware を撤去したため計測が止まっていた。本実装はその後継。
 *
 * 🔴 大原則: 記録は「あってもなくてもページ配信に影響しない」こと。
 *   - 記録は waitUntil で完全に非同期（レスポンスを待たせない）
 *   - あらゆる例外を握り潰す（D1障害でサイトが落ちてはならない）
 *   - bot 以外は判定を即座に抜ける（人間のアクセスに負荷をかけない）
 * ------------------------------------------------------------------ */

import IP_RANGES from "./bot-ip-ranges.json";

// UA に含まれていたら AI bot とみなす識別子。
// 長い名前を先に評価する（"Claude-SearchBot" が "ClaudeBot" に食われないように）。
const AI_BOTS = [
	"Claude-SearchBot",
	"Applebot-Extended",
	"meta-externalagent",
	"Google-Extended",
	"Perplexity-User",
	"OAI-SearchBot",
	"PerplexityBot",
	"anthropic-ai",
	"ChatGPT-User",
	"Claude-User",
	"ClaudeBot",
	"Bytespider",
	"Amazonbot",
	"Googlebot",
	"Applebot",
	"cohere-ai",
	"GPTBot",
	"Bingbot",
	"YouBot",
	"CCBot",
] as const;

function matchBot(ua: string): string | null {
	const lower = ua.toLowerCase();
	for (const bot of AI_BOTS) {
		if (lower.includes(bot.toLowerCase())) return bot;
	}
	return null;
}

/** UTC の Date から JST の YYYY-MM-DD を得る（集計は日本時間の日付で行う） */
function jstDay(now: Date): string {
	const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
	return jst.toISOString().slice(0, 10);
}

/* --- IP 検証（UA 偽装対策）------------------------------------------
 * UA は誰でも名乗れる。「GPTBot が来た」と報告するからには、送信元 IP が
 * OpenAI の公表レンジに入っていることまで確かめる。
 *
 * 旧実装（Vercel 版）は verified=false の行を捨てていたが、それだと
 * 「IPレンジを公表していない bot（Bytespider 等）」が丸ごと欠測し、
 * 偽装がどれだけ来ているかも見えなくなる。ここでは全件記録した上で
 * verified フラグを立て、レポート側で区別できるようにする。
 * ------------------------------------------------------------------ */

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

	// IPv6 は未対応（該当時は verified=false のまま記録される）
	if (baseStr.includes(":") || ip.includes(":")) return false;
	if (!ip.includes(".") || !baseStr.includes(".")) return false;

	const ipNum = ipv4ToNumber(ip);
	const baseNum = ipv4ToNumber(baseStr);
	if (ipNum < 0 || baseNum < 0) return false;

	const mask = bits === 0 ? 0 : (~((1 << (32 - bits)) - 1)) >>> 0;
	return ((ipNum & mask) >>> 0) === ((baseNum & mask) >>> 0);
}

/** 送信元 IP が、その bot の公式レンジに含まれるか。
 *  レンジ未収録の bot は判定不能なので false（＝「偽装」ではなく「未検証」）。 */
function verifyCrawlerIP(bot: string, ip: string): boolean {
	const ranges = (IP_RANGES as { ranges: Record<string, string[]> }).ranges[bot];
	if (!ranges || ranges.length === 0) return false;
	for (const cidr of ranges) {
		if (cidrMatch(ip, cidr)) return true;
	}
	return false;
}

interface CrawlerEnv {
	effect_moe_crawler?: D1Database;
}

async function recordCrawlerHit(
	env: CrawlerEnv,
	request: Request,
	url: URL,
	bot: string,
	status: number,
): Promise<void> {
	const db = env.effect_moe_crawler;
	if (!db) return;

	const now = new Date();
	const ua = request.headers.get("user-agent") ?? "";
	// CF-Connecting-IP は Cloudflare が必ず付与する実クライアント IP
	const ip = request.headers.get("cf-connecting-ip") ?? "";
	const country =
		(request as Request & { cf?: { country?: string } }).cf?.country ?? "";
	const referer = request.headers.get("referer") ?? "";

	const verified = ip ? verifyCrawlerIP(bot, ip) : false;

	await db
		.prepare(
			`INSERT OR IGNORE INTO crawler_hits
			 (ts_iso, day, bot, path, status, ua, ip, country, referer, verified)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			now.toISOString(),
			jstDay(now),
			bot,
			url.pathname + url.search,
			status,
			ua.slice(0, 512),
			ip,
			country,
			referer.slice(0, 512),
			verified ? 1 : 0,
		)
		.run();
}

function withTrailingSlash(pathname: string) {
	if (pathname === "/" || pathname.includes(".")) return pathname;
	return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function resolveLegacyTarget(url: URL) {
	const pathname = withTrailingSlash(url.pathname);

	if (pathname.startsWith("/posts/")) {
		return new URL(`${pathname}${url.search}`, CANONICAL_ORIGIN);
	}

	const targetPath = LEGACY_REDIRECTS[pathname] ?? "/blog/";
	return new URL(`${targetPath}${url.search}`, CANONICAL_ORIGIN);
}

export const onRequest: PagesFunction<CrawlerEnv> = async (context) => {
	const { request, next, env, waitUntil } = context;
	const url = new URL(request.url);

	// --- 1. 旧ホストのリダイレクト（既存動作・変更しない） ---
	if (LEGACY_HOSTS.has(url.hostname)) {
		if (request.method !== "GET" && request.method !== "HEAD") {
			return new Response("This legacy host has moved to https://effect.moe/.", {
				status: 410,
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
					"X-Robots-Tag": "noindex, nofollow",
					"Cache-Control": "public, max-age=3600",
				},
			});
		}
		return Response.redirect(resolveLegacyTarget(url).toString(), 301);
	}

	// --- 2. 通常配信。AI bot なら巡回を記録する ---
	const response = await next();

	try {
		const ua = request.headers.get("user-agent");
		if (ua) {
			const bot = matchBot(ua);
			if (bot) {
				// レスポンスは既に確定している。記録はその後ろで走らせる。
				waitUntil(
					recordCrawlerHit(env, request, url, bot, response.status).catch(
						() => {
							/* 記録失敗はサイトの動作に影響させない */
						},
					),
				);
			}
		}
	} catch {
		/* 判定自体が失敗してもページ配信は継続する */
	}

	return response;
};
