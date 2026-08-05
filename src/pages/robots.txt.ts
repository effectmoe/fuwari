import type { APIRoute } from "astro";

// 🔴 2026-08-05 全面簡素化（86行 → 8行）
//
// 【何が問題だったか】
// AIクローラ17種を個別に列挙し、それぞれに `Allow: /` を書いていた。
// コメントには「opt-in型クローラは `User-agent: *` の包括許可だけでは来訪しない」
// と書かれていたが、**これは誤り**。robots.txt の仕様上、
//
//   クローラは「自分の名前が書かれたグループ」だけを読み、`User-agent: *` を完全に無視する。
//   グループはマージされない。
//
// つまり UA を列挙して `Allow: /` を書いても**許可は1ミリも増えない**（元々許可されている）。
// 増えるのは管理コストだけで、さらに各グループに `Disallow: /admin/` を書き忘れると
// そのクローラだけ管理画面に入れてしまう。**純粋な劣化**だった。
//
// 【実測での裏付け】
// 自社AIクローラログ5サイト・76,015ヒットを横断調査した結果、
// llms.txt の取得はわずか7件（0.009%）。一方 robots.txt は1サイトだけで1,993回取得されている。
// AIクローラは robots.txt と sitemap は必ず読むが、「許可の明示」は必要としていない。
//
// 【ルール】CLAUDE.md「robots.txt は間口を最大限広く取る」＋ BONITO案件（71行→13行）と同じ判断。
// 制限は「クロールされると実害があるもの」（管理画面）だけに絞る。
//
// /_astro/ を Disallow すると Googlebot が JS/CSS を読めずリッチリザルト判定が壊れるため、
// JS/CSS は許可したまま（Google ガイドライン準拠）。
const robotsTxt = `
User-agent: *
Disallow: /admin/

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
