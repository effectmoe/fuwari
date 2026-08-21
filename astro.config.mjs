import sitemap from "@astrojs/sitemap";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeExternalLinks from "rehype-external-links"; /* External links → target="_blank" */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig } from "./src/config.ts";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const sitemapDateCache = new Map();

/**
 * 生成時に、URLに対応する公開ソースの最終Git更新日を返す。
 * Git情報のない環境ではファイル更新日時にフォールバックするため、
 * sitemap.xml の lastmod が空のままにならない。
 */
function getSourceModifiedDate(sourcePath) {
	if (!sourcePath || sitemapDateCache.has(sourcePath)) {
		return sitemapDateCache.get(sourcePath);
	}

	const absolutePath = path.join(projectRoot, sourcePath);
	if (!existsSync(absolutePath)) {
		sitemapDateCache.set(sourcePath, undefined);
		return undefined;
	}

	let date;
	let dateOnly;
	try {
		const output = execFileSync("git", ["log", "-1", "--format=%cI", "--", sourcePath], {
			cwd: projectRoot,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		if (output) {
			date = new Date(output);
			dateOnly = output.slice(0, 10);
		}
	} catch {
		// Cloudflareのビルド環境など、Git履歴がないケースは下記にフォールバックする。
	}

	if (!date || Number.isNaN(date.getTime())) {
		date = statSync(absolutePath).mtime;
		dateOnly = date.toISOString().slice(0, 10);
	}

	const result = { date, dateOnly };
	sitemapDateCache.set(sourcePath, result);
	return result;
}

function newestDate(sourcePaths) {
	const dates = sourcePaths.map(getSourceModifiedDate).filter(Boolean);
	return dates.length ? dates.reduce((latest, current) => current.date > latest.date ? current : latest) : undefined;
}

function getSitemapLastmod(url) {
	const pathname = decodeURIComponent(new URL(url).pathname);

	if (pathname.startsWith("/posts/")) {
		const slug = pathname.replace(/^\/posts\//, "").replace(/\/$/, "");
		return getSourceModifiedDate(`src/content/posts/${slug}/index.md`) ??
			getSourceModifiedDate(`src/content/posts/${slug}.md`);
	}

	// ブログ・アーカイブは、一覧で見える最新記事の更新日に合わせる。
	if (pathname === "/blog/" || /^\/blog\/\d+\/$/.test(pathname) || pathname === "/archive/") {
		return newestDate([
			pathname === "/archive/" ? "src/pages/archive.astro" : "src/pages/blog/[...page].astro",
			"src/content/posts",
		]);
	}

	const route = pathname === "/" ? "index" : pathname.replace(/^\//, "").replace(/\/$/, "");
	return getSourceModifiedDate(`src/pages/${route}.astro`) ??
		getSourceModifiedDate(`src/pages/${route}/index.astro`);
}

const sitemapIndexLastmod = newestDate(["src/pages", "src/content/posts"]);

// https://astro.build/config
export default defineConfig({
	site: "https://effect.moe/",
	base: "/",
	trailingSlash: "always",
	integrations: [
		tailwind({
			nesting: true,
		}),
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: ["main", "#toc"],
			smoothScrolling: true,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			// mailto: / tel: は Swup の SPA ナビゲーションから除外する。
			// （@swup/astro は linkSelector を受け付けず ignore オプションで指定する。
			//   デフォルトのままだと mailto も SPA 遷移として捕まえてしまい、
			//   ブラウザがメーラを起動できない不具合になる）
			// 固定LP・ブログ・百科ページの間で <main> だけを差し替えると、
			// ページ固有のHTML/CSS/JS適用タイミングがずれてコード片のような表示が
			// 一瞬見えることがあるため、内部リンクは通常遷移に戻す。
			ignore: [
				'a[href^="/"]',
				'a[href^="mailto:"]',
				'a[href^="tel:"]',
				'a[href^="javascript:"]',
				// fullWidth レイアウト（Wikipedia 風固定ページ）への遷移は SPA 化しない。
				// Swup は <main> だけを差し替えるため、fullWidth ↔ 通常レイアウトを
				// 跨ぐと grid-template-columns が引き継がれず壊れる。
				'a[href^="/dfb-complete-guide"]',
			],
		}),
		icon({
			include: {
				"preprocess: vitePreprocess(),": ["*"],
				"fa6-brands": ["*"],
				"fa6-regular": ["*"],
				"fa6-solid": ["*"],
				"simple-icons": ["*"],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton()
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					'shellsession': {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.75rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "none"
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250
				}
			},
			frames: {
				showCopyToClipboardButton: false,
			}
		}),
        svelte(),
		sitemap({
			// sitemap-index.xml 側にも、配下のURL群を最後に更新した日を明示する。
			lastmod: sitemapIndexLastmod?.date,
			filter: (page) => {
				const pathname = new URL(page).pathname;
				return !pathname.startsWith("/admin/") &&
					!pathname.startsWith("/ai-traffic-report/") &&
					pathname !== "/ai-central/" &&
					pathname !== "/diagnosis/" &&
					pathname !== "/about/";
			},
			serialize: (item) => {
				const lastmod = getSitemapLastmod(item.url);
				return lastmod ? { ...item, lastmod: lastmod.dateOnly } : item;
			},
		}),
		{
			name: "effect-sitemap-lastmod-date-only",
			hooks: {
				"astro:build:done": async ({ dir }) => {
					const outputDir = fileURLToPath(dir);
					const sitemapFiles = readdirSync(outputDir).filter((file) => /^sitemap(?:-index|-\d+)?\.xml$/.test(file));
					await Promise.all(sitemapFiles.map(async (file) => {
						const filePath = path.join(outputDir, file);
						const xml = await readFile(filePath, "utf8");
						let dateOnlyXml = xml.replace(/<lastmod>(\d{4}-\d{2}-\d{2})T[^<]+<\/lastmod>/g, "<lastmod>$1</lastmod>");
						if (file === "sitemap-index.xml" && sitemapIndexLastmod?.dateOnly) {
							dateOnlyXml = dateOnlyXml.replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${sitemapIndexLastmod.dateOnly}</lastmod>`);
						}
						if (dateOnlyXml !== xml) await writeFile(filePath, dateOnlyXml);
					}));
				},
			},
		},
	],
	markdown: {
		remarkPlugins: [
			remarkMath,
			remarkReadingTime,
			remarkExcerpt,
			remarkGithubAdmonitionsToDirectives,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
		],
		rehypePlugins: [
			rehypeKatex,
			rehypeSlug,
			[
				rehypeExternalLinks,
				{
					target: "_blank",
					rel: ["noopener", "noreferrer"],
				},
			],
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
						note: (x, y) => AdmonitionComponent(x, y, "note"),
						tip: (x, y) => AdmonitionComponent(x, y, "tip"),
						important: (x, y) => AdmonitionComponent(x, y, "important"),
						caution: (x, y) => AdmonitionComponent(x, y, "caution"),
						warning: (x, y) => AdmonitionComponent(x, y, "warning"),
					},
				},
			],
		],
	},
	vite: {
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					// temporarily suppress this warning
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
		},
	},
});
