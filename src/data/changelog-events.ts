export type ChangelogEvent = {
	date: string;
	version: string;
	product: string;
	status: string;
	title: string;
	items: string[];
	href: string;
	type: "system" | "service";
};

export const importantChangelogEvents: ChangelogEvent[] = [
	{
		date: "2026-07-30",
		version: "SYSTEM",
		product: "サイト基盤",
		status: "更新",
		title: "横断検索とグローバルナビを整備",
		items: [
			"ヘッダーからサイト内検索を開けるように調整",
			"商品別アンカーリンクをモバイルでは折りたたみ表示に変更",
			"ブログ・会社概要・構造化ペディア・変更履歴への導線を整理",
		],
		href: "/changelog/",
		type: "system",
	},
	{
		date: "2026-07-30",
		version: "SERVICE",
		product: "AIセントラル",
		status: "更新",
		title: "AIセントラルLPの訴求とCTAを整理",
		items: [
			"ヒーロー画像とファーストビューを更新",
			"無料相談を主要CTAとして各ページに配置",
			"PLUS以上限定の類似検索ラベルを明示",
		],
		href: "/",
		type: "service",
	},
	{
		date: "2026-07-30",
		version: "SERVICE",
		product: "AIクロール",
		status: "更新",
		title: "AI CRAWLページの料金・FAQ・運用者情報を整理",
		items: [
			"3プラン構成を整理",
			"AI流入総合分析の訴求を追加",
			"FAQとストアカPro講師ブロックを追加",
		],
		href: "/aicrawl/",
		type: "service",
	},
	{
		date: "2026-07-30",
		version: "SERVICE",
		product: "AI講座",
		status: "更新",
		title: "AI講座ページをリノベーション",
		items: [
			"AIエージェント講座のページ構成を調整",
			"講師・料金・無料相談導線を整理",
			"不要なメルマガボタンを削除",
		],
		href: "/ai-agent-course/",
		type: "service",
	},
];
