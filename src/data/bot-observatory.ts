import rawBotData from "./bots-data.json";

export const botData = rawBotData;
export const botMetrics = {
	bytespider: botData.bots.bytespider,
	claudebot: botData.bots.claudebot,
};

export type BotSlug = keyof typeof botMetrics;

type ReferenceRow =
	| { label: string; metric: keyof typeof botData.bots.reference }
	| { label: string; bot: BotSlug };

export type BotDefinition = {
	slug: BotSlug;
	profileNumber: string;
	pageTitle: string;
	pageDescription: string;
	keywords: string;
	catalogCategory: "rogue" | "training";
	catalogDescription: string;
	searchExcerpt: string;
	heroLead: string;
	asideEyebrow: string;
	asideTitle: string;
	referenceRows: ReferenceRow[];
	chapters: {
		title: string;
		paragraphs: string[];
		listIntro?: string;
		listItems?: { label?: string; text: string }[];
		referenceLinks?: { label: string; href: string; external?: boolean }[];
	}[];
	faqItems: { question: string; answer: string }[];
	relatedLinks: { lead: string; title: string; href: string }[];
	cta: {
		eyebrow: string;
		title: string;
		body: string;
		primaryHref: string;
		primaryText: string;
		primaryLabel: string;
		secondaryHref: string;
		secondaryText: string;
		secondaryLabel: string;
	};
};

export const botPageDefinitions: BotDefinition[] = [
	{
		slug: "bytespider",
		profileNumber: "001",
		pageTitle: "Bytespiderとは？ブロック方法を実測ログで解説",
		pageDescription:
			"Bytespiderとは何のボットか、ブロックすべきかを、当サイトの実測ログ（{{period}}・{{month_hits}}件で全クローラー最多）とともに解説。robots.txtが効かない理由と対策の考え方まで。",
		keywords:
			"Bytespider, Bytespiderとは, Bytespider ブロック, AIクローラー, ボット対策",
		catalogCategory: "rogue",
		catalogDescription: "公式の確認手段が限られ、挙動を継続して観測する対象",
		searchExcerpt:
			"Bytespiderの量、扱い、判断材料をeffect.moeの実測ログとともに整理したAIボット観測所の図鑑ページ。",
		heroLead: "実測ログから、ボットの量・扱い・判断材料を分けて見ます。",
		asideEyebrow: "WHAT IS IT",
		asideTitle: "名前だけで、\n判断しない。",
		referenceRows: [
			{ label: "Googlebot", metric: "googlebot_month" },
			{ label: "ClaudeBot", bot: "claudebot" },
		],
		chapters: [
			{
				title: "Bytespiderとは何のクローラーですか？",
				paragraphs: [
					"Bytespider（バイトスパイダー）は、TikTokの親会社であるByteDance社が運営するクローラーです。AI開発のためのデータ収集が目的とみられていますが、GoogleやOpenAIのクローラーと違い、公式の説明ドキュメントや管理方法がほとんど公開されていません。",
					"海外の調査では、世界で最もリクエスト数の多いAIクローラーと報告されたこともあります。",
				],
			},
			{
				title: "なぜBytespiderは問題視されているのですか？",
				paragraphs: [],
				listIntro: "理由は3つあります。",
				listItems: [
					{
						label: "アクセス量が多い",
						text: "当サイトの実測でも、{{period}}で{{month_hits}}件と全クローラー中最多でした。検索エンジンのGooglebot（{{googlebot_month}}件）の2倍以上です。",
					},
					{
						label: "robots.txt に従わないという報告が多い",
						text: "サイト側が「読まないでください」と指定しても従わないケースが第三者の検証で繰り返し報告されています。",
					},
					{
						label: "素性の確認手段がない",
						text: "公式のIPアドレス一覧が公開されていないため、「Bytespiderを名乗るアクセスが本物かどうか」を名乗りから確認できません。",
					},
				],
			},
		],
		faqItems: [
			{
				question: "Bytespiderとは何のボットですか？",
				answer:
					"TikTokの親会社ByteDance社のクローラーです。AI開発のためのデータ収集が目的とみられますが、公式の説明はほとんど公開されていません。",
			},
			{
				question: "Bytespiderはブロックすべきですか？",
				answer:
					"判断の材料は「得られるものと負担の比較」です。Bytespiderを許可して得られる露出のメリットは現時点で不明確な一方、アクセス量は多く、挙動への懸念報告もあります。当観測所の分類では「悪質・不明系」です。ブロックを選ぶサイトが増えていますが、実施の際は影響確認とセットで行ってください。",
			},
			{
				question: "Bytespiderはrobots.txtに従いますか？",
				answer:
					"従わないという報告が第三者の検証で繰り返し共有されています。robots.txtは「お願い」であり、従うかどうかはボット側次第です。確実に止めたい場合は、サイトに届く前の段階で制御する方法が現実的です。",
			},
			{
				question: "BytespiderをブロックするとSEOやAI検索に影響はありますか？",
				answer:
					"Google・Bingの検索順位や、ChatGPT・Perplexity等のAI検索での紹介には影響しません（それぞれ別のクローラーが担当しているためです）。TikTok系サービスでの露出への影響は不明です。",
			},
			{
				question: "Bytespiderはどれくらいアクセスしてきますか？",
				answer:
					"当サイトの実測では、{{period}}で{{month_hits}}件でした。これは検索エンジンのGooglebot（{{googlebot_month}}件）を大きく上回り、全クローラー中で最多です。（数字は毎週更新されます）",
			},
			{
				question: "BytespiderはTikTokと関係がありますか？",
				answer:
					"運営元のByteDance社はTikTokの親会社です。ただし、収集したデータがどのサービスにどう使われるかの詳細は公開されていません。",
			},
			{
				question: "Bytespiderを名乗るアクセスが本物か確認できますか？",
				answer:
					"公式のIPアドレス一覧が公開されていないため、名乗りだけでは確認できません。発信元や挙動から総合的に判定する必要があり、当社ではこの判定を継続的に行っています。",
			},
		],
		relatedLinks: [
			{
				lead: "AIサイバー攻撃の全体像はこちら",
				title: "AIサイバー攻撃とは？事例と対策を実測データで解説",
				href: "/ai-cyber-attack/",
			},
		],
		cta: {
			eyebrow: "AI SHIELD / NEXT STEP",
			title: "このボット、あなたのサイトにも来ていませんか？",
			body: "当サイトには{{period}}だけで{{month_hits}}件来ました。あなたのサイトの数字は、測らないと分かりません。",
			primaryHref: "/aishield/",
			primaryText: "偽装・悪質ボットを見守る",
			primaryLabel: "AI SHIELD",
			secondaryHref: "/aicrawl/",
			secondaryText: "AIクローラーの読まれ方を測る",
			secondaryLabel: "AI CRAWL",
		},
	},
	{
		slug: "claudebot",
		profileNumber: "002",
		pageTitle: "ClaudeBotとは？実測データとブロックの考え方 - AIボット観測所",
		pageDescription:
			"ClaudeBotとは何のボットか、ブロックすべきかを実測データで解説。当サイトでは{{reported_month_period}}で{{reported_month_hits}}件と、検索エンジンのGooglebot（{{reported_googlebot_hits}}件）を上回りました。本物の確認方法まで紹介します。",
		keywords:
			"ClaudeBot, ClaudeBotとは, ClaudeBot ブロック, Anthropic, AIクローラー",
		catalogCategory: "training",
		catalogDescription:
			"AIモデルの学習に使う正規クローラー。公式のIP一覧で確認できる対象",
		searchExcerpt:
			"ClaudeBotの量、扱い、確認方法をeffect.moeの実測データとともに整理したAIボット観測所の図鑑ページ。",
		heroLead: "実測ログから、ボットの量・扱い・判断材料を分けて見ます。",
		asideEyebrow: "WHAT IS IT",
		asideTitle: "正規のAIも、\n確認して通す。",
		referenceRows: [{ label: "Googlebot", metric: "googlebot_month" }],
		chapters: [
			{
				title: "ClaudeBotとは何のクローラーですか？",
				paragraphs: [
					"ClaudeBot（クロードボット）は、AIアシスタント「Claude」を開発するAnthropic社のクローラーです。AIモデルの学習のためにWebページを収集します。",
					"Anthropicは公式ヘルプで、用途の異なる3種類のクローラーを文書化しています。",
				],
				listItems: [
					{ text: "ClaudeBot — AIの学習のための収集" },
					{
						text: "Claude-User — ユーザーがClaudeに質問した瞬間の取得（当サイトでも観測）",
					},
					{ text: "Claude-SearchBot — 検索品質の改善のための収集" },
				],
			},
			{
				title: "なぜClaudeBotが注目されているのですか？",
				paragraphs: [
					"いずれも robots.txt の指示に従うと公式に明言されています。",
					"当サイトの実測で、{{reported_month_period}}にClaudeBotは{{reported_month_hits}}件アクセスし、検索エンジンのGooglebot（{{reported_googlebot_hits}}件）を上回りました。「検索よりAIの方が多くサイトを読みに来る」時代の象徴が、このボットです。",
					"AIに引用・紹介される機会が増えている一方で、ClaudeBotを名乗る偽装アクセスも観測されており、名乗りだけで信用できない状況も同時に進んでいます。",
				],
			},
			{
				title: "ClaudeBotが本物か、IPアドレスで確認できますか？",
				paragraphs: [
					"できます。Anthropicは2026年8月から、クローラーの正規IPアドレス一覧を公式に公開しています（claude.com/crawling/bots.json）。名乗りがClaudeBotでも、発信元がこの一覧に無ければ偽物です。",
					"公式の確認手段が用意されている点が、一覧を公開していないBytespiderとの大きな違いです。",
				],
				referenceLinks: [
					{
						label: "https://claude.com/crawling/bots.json",
						href: "https://claude.com/crawling/bots.json",
						external: true,
					},
					{ label: "/bots/bytespider/", href: "/bots/bytespider/" },
				],
			},
		],
		faqItems: [
			{
				question: "ClaudeBotとは何のボットですか？",
				answer:
					"Anthropic社（AIアシスタント「Claude」の開発元）の公式クローラーで、AIの学習のためにWebページを収集します。公式ヘルプに文書化された正規のボットです。",
			},
			{
				question: "ClaudeBotはブロックすべきですか？",
				answer:
					"当観測所の分類は「正規AI系」で、基本は通す判断をおすすめします。ブロックすると、Claudeがあなたのサイトを知る機会が減り、AI経由で紹介される可能性を自ら狭めることになります。学習だけを避けたい場合は、robots.txtでClaudeBotのみを個別に制御する選択肢もあります。",
			},
			{
				question: "ClaudeBotはrobots.txtに従いますか？",
				answer:
					"従うと公式に明言されており、当サイトの観測でも指示に反する挙動は確認していません。ただし、ClaudeBotを名乗る偽装アクセスは別問題です（名乗り自体が嘘のため、robots.txtでは止まりません）。",
			},
			{
				question: "ClaudeBotをブロックするとSEOやAI検索に影響はありますか？",
				answer:
					"GoogleやBingの検索順位には影響しません。注意点は、robots.txtでAnthropicの3ボットをまとめて拒否すると、学習（ClaudeBot）だけでなく、Claudeでの検索・紹介（Claude-SearchBot・Claude-User）まで失われることです。目的に応じて個別に指定してください。",
			},
			{
				question: "ClaudeBotはどれくらいアクセスしてきますか？",
				answer:
					"当サイトの実測では、{{reported_month_period}}で{{reported_month_hits}}件でした。検索エンジンのGooglebot（{{reported_googlebot_hits}}件）を上回っています。（数字は毎週更新されます）",
			},
			{
				question: "ClaudeBotとClaude-Userは何が違いますか？",
				answer:
					"ClaudeBotはAIの学習のための定期的な収集、Claude-Userは「ユーザーがClaudeに質問した瞬間」にページを取りに来るアクセスです。Claude-Userが来ている＝あなたのサイトがAIへの質問の答えとして参照されている、というサインです。",
			},
			{
				question: "ClaudeBotを名乗るアクセスが本物か確認できますか？",
				answer:
					"できます。Anthropicが公式のIPアドレス一覧（claude.com/crawling/bots.json）を公開しているため、発信元と照合すれば判定できます。当社ではこの照合を継続的に行っています。",
			},
		],
		relatedLinks: [
			{
				lead: "AIサイバー攻撃の全体像はこちら",
				title: "AIサイバー攻撃とは？事例と対策を実測データで解説",
				href: "/ai-cyber-attack/",
			},
			{
				lead: "一覧を公開していないボットとの違い",
				title: "Bytespiderの観測結果",
				href: "/bots/bytespider/",
			},
		],
		cta: {
			eyebrow: "AI CRAWL / NEXT STEP",
			title: "このボット、あなたのサイトにも来ていませんか？",
			body: "当サイトには{{reported_month_period}}だけで{{reported_month_hits}}件来ました。あなたのサイトの数字は、測らないと分かりません。",
			primaryHref: "/aicrawl/",
			primaryText: "AIクローラーの読まれ方を測る",
			primaryLabel: "AI CRAWL",
			secondaryHref: "/aishield/",
			secondaryText: "AIを装う偽装を見守る",
			secondaryLabel: "AI SHIELD",
		},
	},
];

export function getBotDefinition(slug: string) {
	return botPageDefinitions.find((definition) => definition.slug === slug);
}

export function getBotMetric(slug: BotSlug) {
	return botMetrics[slug];
}

export function formatNumber(value: number) {
	return new Intl.NumberFormat("ja-JP").format(value);
}

export function formatBotText(text: string, slug: BotSlug) {
	const bot = getBotMetric(slug);
	const reported = "reported_month" in bot ? bot.reported_month : undefined;
	const replacements: Record<string, string> = {
		"{{period}}": botData.period,
		"{{month_hits}}": formatNumber(bot.month_hits),
		"{{googlebot_month}}": formatNumber(botData.bots.reference.googlebot_month),
		"{{reported_month_period}}": reported?.period || botData.period,
		"{{reported_month_hits}}": formatNumber(reported?.hits || bot.month_hits),
		"{{reported_googlebot_hits}}": formatNumber(
			reported?.googlebot_hits || botData.bots.reference.googlebot_month,
		),
	};
	return Object.entries(replacements).reduce(
		(value, [token, replacement]) => value.replaceAll(token, replacement),
		text,
	);
}
