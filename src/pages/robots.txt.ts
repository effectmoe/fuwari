import type { APIRoute } from "astro";

// /_astro/ を Disallow すると Googlebot が JS/CSS を読めず、
// ページが正しくレンダリングできずリッチリザルト判定が壊れる。
// Google ガイドラインに従い JS/CSS は許可する。
const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
