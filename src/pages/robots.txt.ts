import type { APIRoute } from "astro";

// /_astro/ を Disallow すると Googlebot が JS/CSS を読めず、
// ページが正しくレンダリングできずリッチリザルト判定が壊れる。
// Google ガイドラインに従い JS/CSS は許可する。
//
// 末尾に AI クローラ・LLM 学習ボットの「明示許可ブロック」を追加。
// ClaudeBot / anthropic-ai 等は opt-in 型クローラで、`User-agent: *`
// の包括許可だけでは来訪しない設計のため、UA を 1 つずつ明示する。
// 出典: Anthropic Trust Center / Google Search Central / Perplexity Help
const robotsTxt = `
User-agent: *
Disallow: /admin/
Allow: /

# === AI クローラ・LLM 学習ボット 明示許可 ===
# (LLMO 観点で AI 検索エコシステム全体に露出させるため)

# Anthropic (Claude / Claude.ai 引用元)
User-agent: ClaudeBot
Disallow: /admin/
Allow: /

User-agent: anthropic-ai
Disallow: /admin/
Allow: /

User-agent: Claude-Web
Disallow: /admin/
Allow: /

# OpenAI (ChatGPT 学習・ライブ検索)
User-agent: GPTBot
Disallow: /admin/
Allow: /

User-agent: ChatGPT-User
Disallow: /admin/
Allow: /

User-agent: OAI-SearchBot
Disallow: /admin/
Allow: /

# Google (Gemini / AI Overviews 学習)
User-agent: Google-Extended
Disallow: /admin/
Allow: /

# Perplexity (検索引用)
User-agent: PerplexityBot
Disallow: /admin/
Allow: /

User-agent: Perplexity-User
Disallow: /admin/
Allow: /

# Microsoft (Bing / Copilot)
User-agent: Bingbot
Disallow: /admin/
Allow: /

# Apple (Siri / Apple Intelligence)
User-agent: Applebot
Disallow: /admin/
Allow: /

User-agent: Applebot-Extended
Disallow: /admin/
Allow: /

# Common Crawl (大多数の LLM 学習基盤)
User-agent: CCBot
Disallow: /admin/
Allow: /

# Meta (Llama 学習)
User-agent: Meta-ExternalAgent
Disallow: /admin/
Allow: /

User-agent: FacebookBot
Disallow: /admin/
Allow: /

# Mistral
User-agent: MistralAI-User
Disallow: /admin/
Allow: /

# You.com
User-agent: YouBot
Disallow: /admin/
Allow: /

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
Host: ${new URL(import.meta.env.SITE).host}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
