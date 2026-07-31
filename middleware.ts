export const config = {
	matcher: "/:path*",
};

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

export default function middleware(request: Request) {
	const url = new URL(request.url);
	if (!LEGACY_HOSTS.has(url.hostname)) return;

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
