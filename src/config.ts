import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";
// ストアカ実績の単一情報源（毎日 06:00 LaunchAgent `com.streetacademy.fuwari-sync` が
// ストアカ管理画面から自動取得して上書きする）
import storacaStats from "./data/storaca-stats.json";

export const siteConfig: SiteConfig = {
	title: "effect.moe",
	subtitle: "AIに選ばれる会社へ。AIが働く現場へ。",
	lang: "ja", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 220, // Deep navy / steel blue — AI軍師ブランドを象徴する落ち着いた色
		fixed: false,
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
		{
			name: "ホーム",
			url: "/",
		},
		{
			name: "AIセントラル",
			url: "/",
		},
		{
			name: "AIクロール",
			url: "/aicrawl/",
		},
		{
			name: "AI講座",
			url: "/ai-agent-course/",
		},
		{
			name: "ブログ",
			url: "/blog/",
		},
		{
			name: "FAQ",
			url: "/faq/",
		},
		{
			name: "アバウト",
			url: "/author/",
		},
	],
};

export const analyticsConfig = {
	// GTM is the primary delivery layer. GA4 is configured inside this container.
	googleTagManagerId:
		import.meta.env.PUBLIC_GOOGLE_TAG_MANAGER_ID || "GTM-T9L3VSK2",
	googleAnalyticsMeasurementId:
		import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || "G-571MN39B7X",
	// effect.moe is verified in Search Console as a DNS-verified Domain property
	// (covers all subdomains/protocols), so the HTML tag method is not needed here.
	googleSearchConsoleVerification:
		import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION || "",
	// Microsoft Clarity project "effect.moe" (created 2026-08-01, owner: info@effect.moe)
	microsoftClarityProjectId:
		import.meta.env.PUBLIC_MICROSOFT_CLARITY_PROJECT_ID || "xv67ecazgl",
};

/* Substack メールマガ購読フォーム埋込 URL（サイドバープロフィール下に常設）
   - publication URL: https://<publication>.substack.com/embed の形
   - 正式 URL 未確定の場合は空文字 ""（コンポーネントで空なら非表示）
   v1.15: 2026-06-10 追加 */
export const substackEmbedUrl = "https://kangmyung.substack.com/embed";

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/tony-avatar.jpg", // 桜の中のトニー（正方形クロップ）
	name: "シュ コウメイ",
	bio: "AI時代の必須スキル【構造化】を日々研究し、そこで培ったスキルを「開発」「講座」「コンサル」に活用中。自ら考案したメソッド「DFB理論」によるエニタイム構造化を提唱する。",
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
			name: "note",
			icon: "simple-icons:note",
			url: "https://note.com/effectmoe",
		},
		{
			name: "Substack",
			icon: "simple-icons:substack",
			url: "https://kangmyung.substack.com",
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
		// 権威・指名（表記揺れ吸収・SEO クエリ用）
		"AI軍師",
		"Claude Code",
		"シュ コウメイ",
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
		"https://note.com/effectmoe", // note（国内発見チャネル）
		"https://kangmyung.substack.com", // Substack ニュースレター
	],
	// 運営組織
	organization: {
		name: "株式会社EFFECT",
		url: "https://effect.moe",
	},
	// 著者の肩書（Person.jobTitle）
	jobTitle: "AI・SEO＆LLMO・Notion・システム開発エンジニア兼コンサルタント",
	// 🔴 alternateName は「表示に使う名前」ではなく「AIが同一人物と結びつけるための別名」。
	//   対外署名は「シュ コウメイ」に統一するブランド規約（memory: reference_effect_official_name）
	//   を維持したうえで、**検索・AI回答で辿り着くための表記ゆれ**をここに集約する。
	//   2026-08-20 実測: 漢字「朱 剛明」で検索しても構造化データに一切含まれず、
	//   AIが同一人物と判定できない状態だった。一方 sameAs の LinkedIn URL は
	//   既に漢字「剛明-朱」で公開済みで、漢字表記は事実上すでに対外露出している。
	//   → 署名では使わない。しかし「知られるため」の別名としては載せる。
	alternateName: [
		"朱 剛明",      // 漢字表記（LinkedIn で公開済み）
		"朱剛明",       // 空白なし表記
		"Shu Koumei",  // ラテン文字
		"Tony Chu",    // 英語圏での呼称
	],

	// ストアカ実績・レビュー（第三者評価＝E-E-A-T Trustworthiness の核）
	// 数値は storaca-stats.json から直接 import（LaunchAgent が毎日 06:00 自動更新）
	// 出典: ストアカ管理画面ダッシュボード https://www.street-academy.com/dashboard/steachers
	reviews: {
		ratingValue: storacaStats.ratingValue,
		reviewCount: storacaStats.reviewCount,
		bestRating: 5,
		studentsTaught: storacaStats.studentsTaught,
		sessionsTaught: storacaStats.sessionsTaught,
		// JSON は数値 (54.2) で保存・サイト表示は "54.2%" 表記に整形
		repeatRate: `${storacaStats.repeatRate}%`,
		periodStart: "2024-08", // 実際の講師登録月（管理画面の2019はプラットフォーム起点で誤り）
		activeSince: "2024年8月", // 表示用：登録2年弱でこの実績＝スピード訴求
		badge: "ストアカ プロランク（最高レベル）",
		profileUrl: "https://www.street-academy.com/steachers/271053",
		reviewUrl: "https://www.street-academy.com/steachers/271053#review",
		// 受講生レビュー（最新 13 件・公開ページ /steachers/271053#review から自動取得）
		// 取得スクリプト: ~/Projects/commandc-pwa/streetacademy/sa-public-reviews.js
		// 個人情報リスクなし（ストアカが既に「男性 40代」等の属性に匿名化済み）
		// 注: 過去はトニーが手書きで headline を要約していたが、自動化に伴いストアカ側で投稿者が
		//     付けた一行見出し（「この講座は『〜』でした」の〜部分）をそのまま使用する。
		testimonials: storacaStats.testimonials,
	},
};

/* ============================================================
   講座カタログ（記事末の関連講座CTA自動誘導）2026-06-14
   ------------------------------------------------------------
   記事の tags / category と各講座の topics を照合し、
   最も一致する講座を記事末に CTA カードとして自動表示する。
   - 記事 frontmatter に `course: "<id>"` があればそれを最優先（手動指定）
   - なければ topics のタグ重複数が最大の講座を自動選択
   - どれも一致しなければ fallback（AIコンサル）を表示
   topics は記事の tags（構造化軸キーワード）と揃えると当たりやすい。
   新講座が増えたらここに1件足すだけで全記事の自動誘導に乗る（SSOT）。
   ============================================================ */
/* ============================================================
   サービスCTA（記事末：自社サービスへの誘導・SSOT）

   講座CTA（courseConfig）が「学びたい人」を受けるのに対し、
   こちらは「自社の課題を解きたい人」を受ける。記事末では
   サービスCTA → 講座CTA の順に置く（商品接触を先にする）。

   出し分け:
   - frontmatter `service: "<id>"` があればそれを最優先
   - なければ tags / category が match に当たったものを表示
   - どれも当たらなければ何も出さない（無関係なCTAを貼らない）
   - `service: "none"` で明示的に非表示

   🔴 誇大表現の禁止: ここに書く文言は商品の実態と一致させること。
   AI CRAWL の 3,300円プランは「集計（事実の可視化）」であり、
   人的な読解・改善提案は上位プランの領域。
   （strategy-ai-traffic-report-tier-differentiation-20260728.md の運用憲法）
   ============================================================ */
export const serviceConfig = {
	services: [
		{
			id: "aicrawl",
			label: "自社サイトのAI流入を、毎週見る",
			title: "AI CRAWL 週次レポート（月額3,300円）",
			pitch:
				"ChatGPT や Claude が、自社サイトのどのページを読みに来たか。毎週月曜、実数でお届けします。続けるほど、先月と今月を比べられるようになります。",
			// 相場を1行だけ添える。お得さを自称せず、事実を置いて読者に判断してもらう。
			// 効果の保証・数値の断定はしない（2026-08-01 文面改稿）
			note: "AI別・ページ別の巡回数と、AI経由の訪問・問い合わせなどの成果を自動集計。同種の計測サービスは月1万円台〜が中心です。",
			url: "https://effect.moe/aicrawl/",
			cta: "プランの詳細を見る",
			match: [
				"LLMO", "AIO", "AI流入", "AIクローラー", "GPTBot", "ClaudeBot",
				"SEO", "検索順位", "Search Console", "GA4", "アクセス解析",
				"AI検索", "生成AI", "構造化データ", "E-E-A-T", "被引用",
			],
		},
		{
			id: "ai-central",
			label: "社内のAI活用を設計する",
			title: "AI CENTRAL（記憶を持ったAIを社内の中枢へ）",
			pitch:
				"社内資料・顧客情報・対応履歴を、AIが参照できる社内基盤として整えます。まずは一部署・一業務から。",
			note: "個人情報を扱う場合はローカルLLM構成もご相談いただけます。",
			url: "https://effect.moe/",
			cta: "AI CENTRAL を見る",
			match: [
				"社内AI", "ナレッジ", "知識管理", "Obsidian", "Notion",
				"業務効率化", "ローカルLLM", "RAG", "議事録", "情報整理",
			],
		},
	],
} as const;

export const courseConfig = {
	// マッチしなかった記事に出す保険CTA（実益=コンサルへ）
	fallbackId: "ai-consulting",
	courses: [
		{
			id: "claude-obsidian",
			title: "Claude × Obsidian｜AI×知識管理で劇的時短 活用術",
			url: "https://www.street-academy.com/myclass/198519?sessiondetailid=22072787",
			topics: ["Obsidian", "Obsidian Sync", "Claude", "メモ管理", "知識管理", "ワークフロー", "ナレッジ"],
			pitch: "Obsidian の大量メモを Claude と連携し『最強のアイデア源』に変える方法を、実演で学べます。",
		},
		{
			id: "notion-claude",
			title: "NotionとClaude｜ご希望のツールを一緒に作る Notion実践講座",
			url: "https://www.street-academy.com/myclass/212265?sessiondetailid=22073584",
			topics: ["Notion", "Claude", "CMS", "ツール作成", "業務効率化"],
			pitch: "Notion × Claude で、あなたの業務に合わせたツールを一緒に作りながら学べます。",
		},
		{
			id: "claude-code",
			title: "Claude Code 講座｜AIコーディングを実務で使いこなす",
			url: "https://www.street-academy.com/myclass/214883?sessiondetailid=22072529",
			topics: ["Claude Code", "コーディング", "開発", "実装"],
			pitch: "Claude Code を基礎から実務まで。初心者でも『作りたい』を形にできるようになります。",
		},
		{
			id: "claude-code-agent",
			title: "Claude Code AIエージェント講座｜自律エージェントを構築する",
			url: "https://www.street-academy.com/myclass/214012?sessiondetailid=22073339",
			topics: ["AIエージェント", "AI社員", "Claude Code", "自律実行", "業務AI自動化"],
			pitch: "AIエージェント（AI社員）の作り方を実装ベースで。社内業務をAIに落とす第一歩。",
		},
		{
			id: "claude-cowork",
			title: "Claude Coworkで変わる仕事術｜AI自律実行を使いこなす",
			url: "https://www.street-academy.com/myclass/213188?sessiondetailid=22072409",
			topics: ["Claude Cowork", "AI自律実行", "仕事術", "AI活用"],
			pitch: "Claude Cowork で AI に仕事を任せる。即使い始められる自律実行の実演講座。",
		},
		{
			id: "codex",
			title: "ChatGPT Codex 速習講座｜独自機能とClaude連携",
			url: "https://www.street-academy.com/myclass/215436?sessiondetailid=22074702",
			topics: ["Codex", "ChatGPT", "Claude連携", "AIコーディング"],
			pitch: "Codex と ChatGPT の違いから実践まで。実際に動かして理解できます。",
		},
		{
			id: "claude-design",
			title: "Claude Design 講座｜AIでデザインを形にする",
			url: "https://www.street-academy.com/myclass/215435?sessiondetailid=22073713",
			topics: ["Claude Design", "デザイン", "UI", "AI活用"],
			pitch: "Claude でデザインを生成・実装。アイデアを形にするデザインAI活用講座。",
		},
		{
			id: "seo-llmo",
			title: "SEOはLLMOへ！AI検索に選ばれるWEBサイトを作る",
			url: "https://www.street-academy.com/myclass/196061?sessiondetailid=22073948",
			topics: ["LLMO", "LLMO対策", "SEO", "AI検索", "構造化データ", "JSON-LD", "構造化"],
			pitch: "SEOとLLMOの違いから、JSON-LD・E-E-A-T・回遊設計まで。AI検索に選ばれるサイトの作り方。",
		},
		{
			id: "llmo-writing",
			title: "LLMOライティング講座｜AIに引用される文章術",
			url: "https://www.street-academy.com/myclass/203152?sessiondetailid=22073831",
			topics: ["LLMOライティング", "ライティング", "LLMO", "AI検索", "コンテンツ"],
			pitch: "AIに引用されやすい構造化された文章の書き方を実例で習得できます。",
		},
		{
			id: "eeat",
			title: "AI検索×SEO×LLMO E-E-A-T実践講座",
			url: "https://www.street-academy.com/myclass/216408",
			topics: ["E-E-A-T", "権威性", "SEO", "信頼性", "監修"],
			pitch: "経験・専門性・権威性・信頼性をサイトにどう実装するかを具体的に学べます。",
		},
		{
			id: "ga4",
			title: "GA4 講座｜AI時代のアクセス解析とAI流入計測",
			url: "https://www.street-academy.com/myclass/197827?sessiondetailid=22074573",
			topics: ["GA4", "アクセス解析", "AI流入", "計測", "データ分析"],
			pitch: "GA4 でAI検索からの流入まで計測。データで打ち手を決められるようになります。",
		},
		{
			id: "local-llm",
			title: "ローカルLLM（ローカルAI）講座｜手元でAIを動かす",
			url: "https://www.street-academy.com/myclass/209048?sessiondetailid=22074182",
			topics: ["ローカルLLM", "ローカルAI", "MLX", "プライバシー", "AI活用"],
			pitch: "手元のMacでAIを動かす。コストとプライバシーを両立するローカルLLM入門。",
		},
		{
			id: "nanobanana-canva",
			title: "Nano Banana Pro × Canva 講座｜AI画像をデザインに",
			url: "https://www.street-academy.com/myclass/208379?sessiondetailid=22074299",
			topics: ["Nano Banana Pro", "Canva", "画像生成", "デザイン", "AI画像"],
			pitch: "AI画像生成（Nano Banana Pro）と Canva で、プロ級のビジュアルを作る方法。",
		},
		{
			id: "ai-intro",
			title: "AI講座｜AIの本質から学ぶ実践活用",
			url: "https://www.street-academy.com/myclass/211441?sessiondetailid=22074444",
			topics: ["AI", "AI活用", "生成AI", "入門", "構造化思考"],
			pitch: "テクニックの前に『なぜそうなるか』から。AIの本質を理解して使いこなす講座。",
		},
		{
			id: "ai-consulting",
			title: "AI×LLM 経営伴走コンサルティング（月額）",
			url: "https://www.street-academy.com/subscription/services/4780?trigger=same_teachers_continued_service-subscription_service",
			topics: ["AIコンサルティング", "AIシステム構築", "AIアプリ開発", "DX", "経営"],
			pitch: "AIシステム構築・LLMO・業務自動化を、月額で継続伴走。事業をAIで構造化して加速します。",
		},
	],
};

/* ============================================================
   ピラーFAQ（トピッククラスターのハブ）2026-06-14
   ------------------------------------------------------------
   /faq ページに表示 + FAQPage 構造化データ化（LLMO に強い）。
   - general : 著者/サービス/講座についてのよくある質問
   - glossary: AI用語集（各記事の難語の「正典の説明」。記事側の
              クラスターFAQ から「もっと詳しく→用語集」でここへ集約）
   やさしい言葉ルール（rules/writing-voice.md）に従って平易に書く。
   ============================================================ */
export const faqConfig = {
	// 回答した著者（「著者が実際に答えている」E-E-A-T 明示）
	answeredBy: {
		name: "シュ コウメイ",
		url: "/author/",
	},
	general: [
		{
			q: "AIにくわしくない初心者でも大丈夫ですか？",
			a: "はい。むしろ初心者の方こそ対象です。私の講座やこのブログでは、テクニックを教える前に「なぜそうなるのか」という仕組みから、専門用語をかみくだいて説明することを大切にしています。実際、受講生レビューでも「難しい言葉を使わないので、機械が苦手な私でも分かった」という声を多くいただいています。分からないところは、理解が追いつくまで根気よく一緒に進めますので、安心してください。",
			links: [
				{ label: "著者の教え方・実績を見る", href: "/author/" },
				{ label: `受講生の声（評価${storacaStats.ratingValue}／${storacaStats.reviewCount}件）`, href: "/about/" },
			],
		},
		{
			q: "どんなことを教えてもらえますか？",
			a: "大きく分けて、①AIツールの活用（Claude / Claude Code / Codex など）、②知識管理（Notion・Obsidian）、③LLMO（AI検索に選ばれる対策）、④AIエージェント（AI社員）づくり、⑤ローカルAI、の5つが柱です。どれも「知っておく」だけでなく、あなたの実際の仕事に合わせて一緒に手を動かして作りながら学べるのが特徴です。各テーマは、このブログの記事でも実例つきで読めます。",
			links: [
				{ label: "Obsidian×Claudeでメモをアイデア源に", href: "/posts/obsidian-claude-idea-source/" },
				{ label: "AI時代に「シニア有利」の本質は構造化能力", href: "/posts/ai-era-senior-structuring-power/" },
				{ label: "AI用語集で各キーワードを確認", href: "/faq/" },
			],
		},
		{
			q: "個人や小さな会社でも相談できますか？",
			a: "はい、むしろ個人・小規模事業の方にこそ効果が大きいです。AIをうまく使えば、1人でも何人分もの仕事をこなせるようになります。作業の自動化・書類管理・時間の使い方まで、全体を見渡して「どこをAIに任せるか」を一緒に設計します。単発の講座のほか、継続して伴走する月額のコンサルティングもあります。",
			links: [
				{ label: "「構造化能力」がAI時代の鍵になる理由", href: "/posts/ai-era-senior-structuring-power/" },
				{ label: "著者・サービスの詳細", href: "/author/" },
			],
		},
		{
			q: "AIシステムやアプリの開発も頼めますか？",
			a: "はい。記事や講座だけでなく、社内向けのAIシステム構築、AIアプリ開発、LLMO対策の代行まで対応しています。「AIで事業を構造化して加速する」のが私たちの専門で、このブログ自体も、その考え方と技術で実際に作られています。何ができるかは、まず著者ページのサービス案内をご覧ください。",
			links: [
				{ label: "著者・提供サービスを見る", href: "/author/" },
			],
		},
		{
			q: "講座はどこで受けられますか？",
			a: `スキルシェア最大手「ストアカ」で開講しています。2024年8月の登録から約2年で、累計受講${storacaStats.studentsTaught}人・レビュー${storacaStats.reviewCount}件・評価${storacaStats.ratingValue}（5点満点）・プロランク（最高レベル）の実績があります。各記事の最後に、その内容に関連する講座へのリンクを自動で置いているので、興味を持ったテーマからそのまま受講できます。`,
			links: [
				{ label: "ストアカ講師ページ", href: "https://www.street-academy.com/steachers/271053" },
				{ label: "著者の実績・経歴", href: "/author/" },
			],
		},
		{
			q: "このブログは何がテーマですか？",
			a: "「構造化」が軸です。物事を整理し、構造化できる人が、AI時代にいちばん得をする——という考えのもと、AIを実際に使って事業や知識を構造化する方法を、机上論ではなく実装しながら発信しています。構造化はLLMO（AI検索対策）にも、社内のAIシステム化にも、AI時代に人に残るスキルにも、すべて通じる共通の土台です。",
			links: [
				{ label: "「構造化能力」とは何かを掘り下げた記事", href: "/posts/ai-era-senior-structuring-power/" },
				{ label: "著者について", href: "/author/" },
			],
		},
	],
	// AI用語集（各記事のクラスターFAQから集約される正典の説明）
	glossary: [
		{
			q: "Claude（クロード）とは？",
			a: "Anthropic社が作った対話型AIです。文章の作成・要約・分析や、プログラムのコードを書くのが得意で、長い文章を丁寧に扱えるのが特徴です。このブログで扱う「Claude Code」「Claude Cowork」などは、すべてこのClaudeをベースにした使い方です。",
			links: [
				{ label: "ObsidianのメモをClaudeでアイデア源にする実例", href: "/posts/obsidian-claude-idea-source/" },
			],
		},
		{
			q: "Claude Code（クロードコード）とは？",
			a: "Claude を、コード作成・開発に特化させた道具です。「こういうアプリやツールを作りたい」と日本語で頼むだけで、AIが実際にコードを書いて形にしてくれます。プログラミング未経験でも、伴走してもらいながら「作りたい」を実現できるのが大きな魅力です。",
			links: [
				{ label: "Claude Code 講座（ストアカ）", href: "https://www.street-academy.com/myclass/214883?sessiondetailid=22072529" },
			],
		},
		{
			q: "Codex（コーデックス）とは？",
			a: "OpenAI（ChatGPTを作った会社）のコード作成AIです。Claude Code と似た役割で、プログラムを書くのを手伝ってくれます。Claude Code とどちらが良いかは目的によるので、両方を実際に動かして比べてみるのがおすすめです。",
			links: [
				{ label: "Codex 速習講座（ストアカ）", href: "https://www.street-academy.com/myclass/215436?sessiondetailid=22074702" },
			],
		},
		{
			q: "MCP とは？",
			a: "AIに「このフォルダやアプリを使っていいよ」と許可を出し、AIが自分でファイルを読み書きしたり、外部の道具を使えるようにする「橋渡しの仕組み」です。たとえばこれを使うと、Claude が自分でメモを開いて読み、必要な情報を探してくれます。正式名称は Model Context Protocol。便利な反面、見せる範囲はしっかり絞ることが大切です。",
			links: [
				{ label: "MCPでObsidianのメモをClaudeにつなぐ実例", href: "/posts/obsidian-claude-idea-source/" },
			],
		},
		{
			q: "Obsidian（オブシディアン）とは？",
			a: "文字（マークダウン）でメモを書きためるアプリです。メモ同士をリンクでつなげられ、自分だけの知識データベースを作れます。データは自分のパソコンに保存されるので安心で、シンプルな文字なのでAIにも渡しやすいのが強みです。スマホとパソコンで同期したい場合は、有料のObsidian Syncを使います。",
			links: [
				{ label: "Obsidian×Claudeでメモをアイデア源に変える", href: "/posts/obsidian-claude-idea-source/" },
				{ label: "Obsidianのモバイル運用とSyncの価値", href: "/posts/obsidian-sync-mobile-astro-blog/" },
			],
		},
		{
			q: "Notion（ノーション）とは？",
			a: "メモ・文書・データベース・タスク管理をまとめてできる万能ツールです。チームでの共有や、見やすい資料づくりが得意です。一方で、ブログの土台（CMS）として使うと手間が増える場面もあるので、用途に応じて使い分けるのがコツです。",
			links: [
				{ label: "なぜNotionをCMSにすると面倒くさいのか", href: "/posts/why-notion-cms-is-painful-for-astro/" },
				{ label: "Notion実践講座（ストアカ）", href: "https://www.street-academy.com/myclass/212265?sessiondetailid=22073584" },
			],
		},
		{
			q: "LLMO とは？",
			a: "ChatGPTやPerplexityなどのAI検索に、自分のサイトを見つけてもらい・引用してもらうための対策です。これまでのSEO（Google検索対策）の、AI時代版にあたります。情報を構造化し、AIが読み取りやすい形に整えることが核心で、まさにこのブログの「構造化」というテーマそのものです。",
			links: [
				{ label: "SEOはLLMOへ｜AI検索に選ばれる講座（ストアカ）", href: "https://www.street-academy.com/myclass/196061?sessiondetailid=22073948" },
				{ label: "著者のLLMO実績・書籍", href: "/author/" },
			],
		},
		{
			q: "AIエージェント（AI社員）とは？",
			a: "指示を出すと、複数の作業を自分で順番に考えて実行してくれるAIです。まるで社員のように、調べもの・資料作成・データ処理などをまかせられます。「AI社員」とも呼び、社内の定型業務をAIに落としていくことで、小さなチームでも大きな成果を出せるようになります。",
			links: [
				{ label: "Claude Code AIエージェント講座（ストアカ）", href: "https://www.street-academy.com/myclass/214012?sessiondetailid=22073339" },
			],
		},
		{
			q: "ローカルLLM（ローカルAI）とは？",
			a: "インターネット上のサービスではなく、自分のパソコンの中で動かすAIのことです。情報が外に出ないので、プライバシーやコスト面で安心して使えます。お客様情報など外に出せないデータを扱う仕事と、特に相性がよい使い方です。",
			links: [
				{ label: "ローカルLLM（ローカルAI）講座（ストアカ）", href: "https://www.street-academy.com/myclass/209048?sessiondetailid=22074182" },
			],
		},
		{
			q: "E-E-A-T とは？",
			a: "経験・専門性・権威性・信頼性（Experience / Expertise / Authoritativeness / Trustworthiness）の頭文字です。GoogleやAIが「この情報は信頼できるか」を判断する目安で、発信者が実際に経験しているか・専門家か・実績があるか・出典が明確かが見られます。このブログでは、著者ページや受講生レビュー、構造化データでこれを示しています。",
			links: [
				{ label: "著者ページ（経歴・専門・実績）", href: "/author/" },
				{ label: "E-E-A-T 講座（ストアカ）", href: "https://www.street-academy.com/myclass/216408?sessiondetailid=22239230" },
			],
		},
		{
			q: "構造化データ（JSON-LD）とは？",
			a: "ページの内容を、検索エンジンやAIが正確に読み取れる「決まった書式の説明書き」です。記事の著者・日付・評価・よくある質問などを機械に伝えることで、検索やAIに引用されやすくなります。このブログ自体も、全ページにこの構造化データを入れています（まさにLLMO対策の実例です）。",
			links: [
				{ label: "著者のLLMO・構造化データの専門性", href: "/author/" },
				{ label: "SEOはLLMOへ｜構造化データを学ぶ講座", href: "https://www.street-academy.com/myclass/196061?sessiondetailid=22073948" },
			],
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
