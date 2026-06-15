/**
 * Vercel Edge Middleware — tony.effect.moe AI Crawler 監視
 *
 * effect.moe の functions/_middleware.js を Vercel Edge Runtime 向けに移植。
 * 元: ~/Projects/effect-site/acacia-studio/functions/_middleware.js
 *
 * 仕様:
 *   - 全リクエスト横断で User-Agent を 22 パターンの AI Bot とマッチ
 *   - 検出時に console.log で構造化 JSON を出力 → Vercel Logs に流れる
 *   - ページレスポンスには干渉しない（pass-through）
 *
 * 将来拡張:
 *   - effect.moe の POST /api/crawler-ingest を作って fetch することで R2 統合可能
 *   - Vercel Log Drain で Datadog / Logtail に流して集計
 */

export const config = {
	// 静的アセット・Vercel内部パスは除外（バンドルサイズ削減・性能影響ゼロ）
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

export default function middleware(request: Request) {
	const ua = request.headers.get("user-agent") || "";
	const uaLower = ua.toLowerCase();

	const crawler = AI_CRAWLERS.find((c) =>
		uaLower.includes(c.pattern.toLowerCase()),
	);

	if (crawler) {
		const url = new URL(request.url);
		// Vercel Logs に出る構造化ログ（後で grep / 集計可能）
		// プレフィックス [AI_CRAWLER] で識別しやすく
		console.log(
			`[AI_CRAWLER] ${JSON.stringify({
				ts: new Date().toISOString(),
				site: "tony.effect.moe",
				crawler: crawler.name,
				path: url.pathname + url.search,
				method: request.method,
				ip:
					request.headers.get("x-real-ip") ||
					request.headers.get("x-forwarded-for") ||
					request.headers.get("cf-connecting-ip") ||
					"",
				referer: request.headers.get("referer") || "",
				ua,
			})}`,
		);
	}

	// pass-through（書き換え・リダイレクトなし）
	return;
}
