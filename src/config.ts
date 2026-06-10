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
			name: "GitHub",
			url: "https://github.com/effectmoe",
			external: true,
		},
		{
			name: "📧 メールマガ登録",
			url: "https://substack.com/", // TODO: トニーの Substack publication URL に差替予定
			external: true,
		},
	],
};

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
