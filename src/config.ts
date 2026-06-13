import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "構造化脳ブログ",
	subtitle: "物事や事象を構造化",
	lang: "ja", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 220, // Deep navy / steel blue — AI軍師ブランドを象徴する落ち着いた色
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false, // 巨大化問題のため一時的に無効化（Fuwari banner は vh 単位で巨大表示される仕様）
		src: "assets/images/tony-banner.jpg",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "ストアカ",
			url: "https://www.street-academy.com/steachers/271053",
			external: true,
		},
	],
};

/* Substack メールマガ購読フォーム埋込 URL（サイドバープロフィール下に常設）
   - publication URL: https://<publication>.substack.com/embed の形
   - 正式 URL 未確定の場合は空文字 ""（コンポーネントで空なら非表示）
   v1.15: 2026-06-10 追加 */
export const substackEmbedUrl = "https://kangmyung.substack.com/embed";

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/tony-avatar.jpg", // 桜の中のトニー（正方形クロップ）
	name: "Tony Chu / シュ コウメイ",
	bio: "株式会社EFFECT 代表 / AI軍師。Claude Code・Cloudflare・自社プロダクト群で「AIで事業を構造化して加速する」実装ノートを発信。DFB（Decompose/Frame/Build = 分・枠・組）理論の提唱者。",
	links: [
		{
			name: "ストアカ講師ページ",
			icon: "fa6-solid:chalkboard-user",
			url: "https://www.street-academy.com/steachers/271053",
		},
		{
			name: "Amazon Kindle",
			icon: "fa6-brands:amazon",
			url: "https://www.amazon.co.jp/dp/B0F7QQF392",
		},
		{
			name: "LinkedIn",
			icon: "fa6-brands:linkedin",
			url: "https://www.linkedin.com/in/%E5%89%9B%E6%98%8E-%E6%9C%B1-66a45b2b8/",
		},
		{
			name: "Substack",
			icon: "simple-icons:substack",
			url: "https://substack.com/", // TODO: 個人 publication URL 要差替
		},
	],
};

/* ============================================================
   SEO / LLMO 設定（構造化マスターアーキテクチャ）
   ------------------------------------------------------------
   サイト軸 =「構造化」。ブランド（構造化脳/DFB/AI軍師）と
   実益（AIシステム構築/AIアプリ開発/LLMO/コンサル）を一本化。

   - keywords     : meta keywords + 軸キーワード
   - knowsAbout   : Person JSON-LD の専門領域（ストアカ講座由来=E-E-A-T証明）
   - sameAs       : 著者の権威プロフィール（書籍/講師ページ/LinkedIn）
   - organization : 運営組織（株式会社EFFECT）

   この設定は Layout / 記事ページ / astro-blog スキルが参照する
   単一の真実源（SSOT）。キーワード戦略を変える時はここだけ直す。
   2026-06-14 SEO/LLMO 全面対策で追加
   ============================================================ */
export const seoConfig = {
	// 軸キーワード（トップ meta keywords・llms.txt に反映）
	keywords: [
		// 母艦語
		"構造化",
		"構造化思考",
		"構造化脳",
		"DFB理論",
		// 構造化=LLMO
		"LLMO",
		"LLMO対策",
		"LLMOライティング",
		"AI検索最適化",
		"GEO",
		"AIO対策",
		"E-E-A-T",
		// 構造化=AIシステム
		"AI社員",
		"AIエージェント",
		"社内AIシステム構築",
		"業務AI自動化",
		// 実益サービス
		"AIシステム構築",
		"AIアプリ開発",
		"AIコンサルティング",
		// 権威・指名
		"AI軍師",
		"Claude Code",
	],
	// Person JSON-LD knowsAbout（ストアカ講座群＝専門証明）
	knowsAbout: [
		"構造化思考",
		"LLMO",
		"LLMO対策",
		"LLMOライティング",
		"SEO",
		"E-E-A-T",
		"生成エンジン最適化(GEO)",
		"AI検索最適化",
		"Claude",
		"Claude Code",
		"Claude Cowork",
		"Claude Design",
		"AIエージェント",
		"AI社員",
		"Codex",
		"Notion",
		"Obsidian",
		"ローカルLLM",
		"GA4",
		"Nano Banana Pro",
		"AIアプリ開発",
		"社内AIシステム構築",
		"AIコンサルティング",
		"DFB理論",
	],
	// 著者の権威プロフィール（E-E-A-T の sameAs）
	sameAs: [
		"https://www.street-academy.com/steachers/271053", // ストアカ人気講師
		"https://office.street-academy.com/teacher/shu-koumei", // オフィスク法人研修講師
		"https://www.amazon.co.jp/dp/B0F7QQF392", // LLMO 書籍（著者性）
		"https://www.linkedin.com/in/%E5%89%9B%E6%98%8E-%E6%9C%B1-66a45b2b8/", // LinkedIn
	],
	// 運営組織
	organization: {
		name: "株式会社EFFECT",
		url: "https://effect.moe",
	},
	// 著者の肩書（Person.jobTitle）
	jobTitle: "株式会社EFFECT 代表 / AI軍師",
	alternateName: ["シュ コウメイ", "朱 剛明", "AI軍師", "Tony Chu"],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
