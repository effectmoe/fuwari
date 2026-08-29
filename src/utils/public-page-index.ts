type PublicPage = {
	href: string;
	label: string;
	description: string;
};

const pageSources = import.meta.glob("../pages/**/*.astro", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

const excludedRoutes = new Set([
	"/404/",
	"/about/",
	"/ai-central/",
	"/ai-traffic-report/",
	"/diagnosis/",
]);

const labelOverrides: Record<string, string> = {
	"/": "ホーム / AI CENTRAL",
	"/aicrawl/": "AI CRAWL",
	"/ai-agent-course/": "AI講座",
	"/ai-agent-course-advanced/": "AIエージェント実装講座（上級編）",
	"/ai-agent-course-corporate/": "法人向けClaude Code社内研修",
	"/ai-agent-course-select/": "AIエージェント講座 コース選択",
	"/archive/": "ブログアーカイブ",
	"/ask/": "AI相談",
	"/author/": "アバウト｜シュ コウメイ",
	"/ai-cyber-attack/": "AIサイバー攻撃ガイド",
	"/company/": "会社概要",
	"/dfb-complete-guide/": "DFB構造化メソッド大全",
	"/faq/": "総合FAQ",
	"/llmo/": "LLMO対策ガイド",
	"/sitemap/": "サイトマップ",
	"/structurepedia/": "構造化ペディア",
	"/trust/": "信頼性・制作方針",
};

function routeFromFilePath(filePath: string) {
	const relativePath = filePath
		.replace("../pages/", "")
		.replace(/\.astro$/, "");

	if (relativePath.includes("[") || relativePath.startsWith("admin/"))
		return null;

	const segments = relativePath.split("/");
	if (segments.at(-1) === "index") segments.pop();

	const href = segments.length ? `/${segments.join("/")}/` : "/";
	return excludedRoutes.has(href) ? null : href;
}

function sourceConstant(source: string, name: string) {
	const match = source.match(
		new RegExp(`const\\s+${name}\\s*=\\s*(?:\\n\\s*)?["']([^"']+)["']`),
	);
	return match?.[1];
}

function sourceAttribute(source: string, name: string) {
	const match = source.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`));
	return match?.[1];
}

function labelFromSource(source: string, href: string) {
	const pageTitle = sourceConstant(source, "pageTitle");
	if (pageTitle) return pageTitle.split("｜")[0].trim();

	return (
		labelOverrides[href] ||
		href.replace(/^\//, "").replace(/\/$/, "").replaceAll("-", " ") ||
		"ホーム"
	);
}

export function getPublicStaticPages(): PublicPage[] {
	return Object.entries(pageSources)
		.map(([filePath, source]) => {
			const href = routeFromFilePath(filePath);
			if (!href) return null;

			const label = labelOverrides[href] || labelFromSource(source, href);
			return {
				href,
				label,
				description:
					sourceConstant(source, "pageDescription") ||
					sourceAttribute(source, "description") ||
					`${label}の案内ページです。`,
			};
		})
		.filter((page): page is PublicPage => page !== null)
		.sort((a, b) => a.href.localeCompare(b.href, "ja"));
}
