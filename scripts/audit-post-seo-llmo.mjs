import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const postsDir = path.join(root, "src/content/posts");
const strict = process.argv.includes("--strict");
const externalDomainAllowList = [
	"astro.build",
	"docs.astro.build",
	"github.com",
	"obsidian.md",
	"webtan.impress.co.jp",
	"suzukikenichi.com",
	"xtrend.nikkei.com",
	"x.com",
	"facebook.com",
	"developers.google.com",
	"lifehacker.jp",
	"keystatic.com",
	"pagescms.org",
	"decapcms.org",
	"tina.io",
	"cloudflare.com",
	"vercel.com",
	"wordpress.org",
];

function listIndexFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) return listIndexFiles(fullPath);
		return entry.isFile() && entry.name === "index.md" ? [fullPath] : [];
	});
}

function frontmatterOf(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---/);
	return match?.[1] || "";
}

function valueOf(frontmatter, key) {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
	return match?.[1]?.trim().replace(/^["']|["']$/g, "") || "";
}

function blockCount(frontmatter, key) {
	const lines = frontmatter.split("\n");
	const start = lines.findIndex((line) => line.trim() === `${key}:`);
	if (start === -1) return 0;
	const block = [];
	for (const line of lines.slice(start + 1)) {
		if (/^[A-Za-z_][\w-]*:/.test(line)) break;
		block.push(line);
	}
	return block.filter((line) => /^\s*-\s+/.test(line)).length;
}

function existsImage(postPath, src) {
	if (!src || src.startsWith("http") || src.startsWith("data:")) return true;
	const normalized = src.replace(/^["']|["']$/g, "");
	const target = normalized.startsWith("/")
		? path.join(root, "public", normalized)
		: path.join(path.dirname(postPath), normalized);
	return fs.existsSync(target);
}

// `/blog/` のカードは Astro の相対画像ではなく、公開ディレクトリの
// `/blog-thumbs/<slug>.jpg` を直接参照する。frontmatter の thumbnail だけを
// 検査すると、記事本体では画像が見えても一覧カードだけ壊れるため、別途検査する。
function hasBlogCardThumbnail(slug) {
	return fs.existsSync(path.join(root, "public", "blog-thumbs", `${slug}.jpg`));
}

function hasExternalSource(raw) {
	const urls = raw.match(/https?:\/\/[^\s)>"']+/g) || [];
	return urls.some((rawUrl) => {
		try {
			const host = new URL(rawUrl).hostname.replace(/^www\./, "");
			return host !== "effect.moe" && externalDomainAllowList.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
		} catch {
			return false;
		}
	});
}

const files = listIndexFiles(postsDir);
const rows = [];
const errors = [];
const warnings = [];

for (const file of files) {
	const raw = fs.readFileSync(file, "utf8");
	const frontmatter = frontmatterOf(raw);
	const slug = path.relative(postsDir, path.dirname(file));
	const isDraft = /^draft:\s*true\s*$/m.test(frontmatter);
	if (isDraft) continue;

	const title = valueOf(frontmatter, "title");
	const description = valueOf(frontmatter, "description");
	const image = valueOf(frontmatter, "image");
	const thumbnail = valueOf(frontmatter, "thumbnail");
	const imageAlt = valueOf(frontmatter, "imageAlt");
	const tagsCount = blockCount(frontmatter, "tags") || (valueOf(frontmatter, "tags").match(/,/g)?.length || 0) + (valueOf(frontmatter, "tags") ? 1 : 0);
	const relatedCount = blockCount(frontmatter, "relatedLinks");
	const faqCount = blockCount(frontmatter, "faq");
	const h2Count = (raw.match(/^##\s+/gm) || []).length;
	const internalLinks = (raw.match(/\]\(\/|href="\/|href: "\//g) || []).length;
	const originalConceptArticle = /DFBとは/.test(title);

	function addIssue(bucket, message) {
		bucket.push(`${slug}: ${message}`);
	}

	if (!title) addIssue(errors, "title がありません");
	if (!description || description.length < 45) addIssue(warnings, "description が短い、またはありません");
	if (!image) addIssue(errors, "image がありません");
	if (image && !existsImage(file, image)) addIssue(errors, `image の実体が見つかりません: ${image}`);
	if (!thumbnail) addIssue(warnings, "thumbnail がありません");
	if (thumbnail && !existsImage(file, thumbnail)) addIssue(errors, `thumbnail の実体が見つかりません: ${thumbnail}`);
	if (!hasBlogCardThumbnail(slug)) addIssue(errors, `一覧カード用サムネイルが見つかりません: public/blog-thumbs/${slug}.jpg`);
	if (!imageAlt || imageAlt.length < 25) addIssue(warnings, "imageAlt が短い、またはありません");
	if (tagsCount < 3) addIssue(warnings, "tags が3個未満です");
	if (!valueOf(frontmatter, "category")) addIssue(warnings, "category がありません");
	if (h2Count < 3) addIssue(warnings, "h2見出しが少なすぎます");
	if (relatedCount < 2) addIssue(warnings, "relatedLinks が2件未満です");
	if (faqCount < 2) addIssue(warnings, "faq が2件未満です");
	if (internalLinks < 1) addIssue(warnings, "本文内の内部リンクがありません");
	if (!hasExternalSource(raw) && !originalConceptArticle) addIssue(warnings, "本文内の外部出典リンクがありません");
	if (/tony\.effect\.moe/.test(raw)) addIssue(errors, "旧ブログドメイン tony.effect.moe が残っています");
	if (/kangmyung\.j@gmail/.test(raw)) addIssue(errors, "個人メールアドレスが残っています");

	rows.push({
		slug,
		title: title ? "ok" : "ng",
		description: description ? "ok" : "ng",
		image: image ? "ok" : "ng",
		imageAlt: imageAlt ? "ok" : "ng",
		tags: tagsCount,
		related: relatedCount,
		faq: faqCount,
	});
}

console.log("# Blog SEO/LLMO audit");
console.log("");
console.log(`posts: ${rows.length}`);
console.log(`errors: ${errors.length}`);
console.log(`warnings: ${warnings.length}`);
console.log("");
console.table(rows);

if (errors.length) {
	console.log("\n## Errors");
	errors.forEach((error) => console.log(`- ${error}`));
}

if (warnings.length) {
	console.log("\n## Warnings");
	warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length || (strict && warnings.length)) {
	process.exit(1);
}
