import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "シュ コウメイの構造化ブログ",
	subtitle: "by Tony Chu / 株式会社EFFECT — AIで事業を構造化して加速する",
	lang: "ja", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 220, // Deep navy / steel blue — AI軍師ブランドを象徴する落ち着いた色
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/tony-banner.jpg", // 桜と愛犬を抱えるトニーのワイドバナー
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
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
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/tony-avatar.jpg", // 桜の中のトニー（正方形クロップ）
	name: "Tony Chu / シュ コウメイ",
	bio: "株式会社EFFECT 代表 / AI軍師。Claude Code・Cloudflare・自社プロダクト群で「AIで事業を構造化して加速する」実装ノートを発信。DFB（Decompose/Frame/Build = 分・枠・組）理論の提唱者。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/effectmoe",
		},
		{
			name: "ストアカ講師",
			icon: "fa6-solid:graduation-cap",
			url: "https://www.street-academy.com/",
		},
		{
			name: "お問い合わせ",
			icon: "fa6-solid:envelope",
			url: "mailto:info@effect.moe",
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
