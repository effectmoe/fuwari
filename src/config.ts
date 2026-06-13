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

	// ストアカ実績・レビュー（第三者評価＝E-E-A-T Trustworthiness の核）
	// 出典: https://www.street-academy.com/steachers/271053#review（2026-06-14 時点）
	reviews: {
		ratingValue: 4.94,
		reviewCount: 209,
		bestRating: 5,
		studentsTaught: 435,
		sessionsTaught: 428,
		repeatRate: "53.6%",
		periodStart: "2024-08", // 実際の講師登録月（管理画面の2019はプラットフォーム起点で誤り）
		activeSince: "2024年8月", // 表示用：登録2年弱でこの実績＝スピード訴求
		badge: "ストアカ プラチナランク（2026年7月よりProランク昇格）",
		profileUrl: "https://www.street-academy.com/steachers/271053",
		reviewUrl: "https://www.street-academy.com/steachers/271053#review",
		// 代表的な受講生レビュー（ストアカ掲載のまま・表示名は公開準拠）
		// 上限12件・1トピック1件の網羅優先。先頭5件をAboutで表示、残りは「もっと見る」。
		// 網羅: LLMO/構造化EEAT/ClaudeCode/Codex/Obsidian/AIエージェント/AI導入/コンサル月額/バイブ/Cowork/Notion
		testimonials: [
			{
				course: "SEOはLLMOへ！AI検索に選ばれるWEBサイトを作る60分",
				reviewer: "女性",
				date: "2026-06",
				rating: 5,
				text: "これまでのSEOとLLMOがどう違うのか、というところから丁寧に教えてもらえて、頭の中が整理されました。JSON-LDやSchema.orgでの構造化データの作り方を、実際のサイトのソースコードやリッチリザルトの検証画面を見ながら解説してもらえたのが特によかったです。FAQや内部リンク、ピラー＆クラスターでサイトを回遊できる形にする考え方、医療系で重要なE-E-A-T（監修・出典・権威性）の話も具体的で、自社サイトのどこを直せばいいかが明確になりました。すぐ実践できる内容で、また次の講座も受けたいと思います。",
			},
			{
				course: "ChatGPT Codex速習講座｜独自機能とClaude連携が◎",
				reviewer: "女性",
				date: "2026-06",
				rating: 5,
				text: "まず一番最初にお伝えしたいのは、「AIの構造を理解した上で使うこと」の大切さを教えてくださる先生だということです。世の中にはAIのテクニックや便利な使い方を教える講座はたくさんありますが、こうめい先生はその前に「なぜそうなるのか」という本質的な部分から丁寧に教えてくださいます。こちらの理解が追いつくまで根気強く伴走してくださるので、知識がなくても安心して学ぶことができます。上辺だけのテクニックを教えたり、すぐに高額講座へ誘導したりすることもありません。LLM WikiやE-E-A-Tの考え方を学び、自分が積み上げてきたものを「資産」として残していく道筋が見え始めています。AIを学びたい方はもちろん、自分の経験や知識を整理したい方、自分の強みを形にしていきたい方にもおすすめしたい先生です。",
			},
			{
				course: "【限定】Claude Codeであなたの作りたいを講師が伴走し構築",
				reviewer: "男性 40代",
				date: "2026-06",
				rating: 5,
				text: "claude codeの基礎的なところから教えていただき、非常にためになりました。しっかり最後まで、伴走していただいたおかげで、最終的な成果物は満足ものになりました。非常にオススメです！！",
			},
			{
				course: "ChatGPT Codex速習講座｜独自機能とClaude連携が◎",
				reviewer: "男性 30代",
				date: "2026-05",
				rating: 5,
				text: "すごく話しやすく、説明がわかりやすい先生でした。自分のわかっていない状況を把握してくださり、必要に応じた説明をしてくださいました。実際にCODEXを画面共有しながらとにかく1回動かしてみて理解を確認することができました。実践している方からCODEXを教われてよかったです。今後も教えていただければと思います。",
			},
			{
				course: "AI×知識管理で劇的時短！Obsidian＆Claude活用術",
				reviewer: "女性 50代",
				date: "2026-05",
				rating: 5,
				text: "Obsidian＆Claudeの繋ぎ方は、とても1人でできるものではなく、先生の的確なご指導があってこそだと思いました。有難うございました。",
			},
			{
				course: "ChatGPT Codex速習講座｜独自機能とClaude連携が◎",
				reviewer: "男性 50代",
				date: "2026-06",
				rating: 5,
				text: "CodexとChatGPTがどんなふうに違うのか、とてもわかりやすく解説してくださいました。教えることにも慣れている先生でした。こちらの画面共有の時にも、ここをクリックとか、ここを選択とか、リアルタイムの書き込みで示してくださいました。すごくやりやすかったですね。またリピートしたいと思いました。",
			},
			{
				course: "【小規模事業向け：課題解決】1人で10倍の成果を設計！AI導入指南",
				reviewer: "男性 40代",
				date: "2026-05",
				rating: 5,
				text: "AIを壁打ちだけでしか使っていなかったため、今後は作業や自動化、書類管理、時間管理含めて、総合的に俯瞰して考えないといけないことがよくわかりました。1人で10人分位のことができるように目指してAIツールをよく理解して、最適な使い方ができるように頑張れればと思います。他講座もいくつか予約させて頂きましたので、引き続きよろしくお願いいたします。",
			},
			{
				course: "【小規模事業向け：課題解決】1人で10倍の成果を設計！AI導入指南",
				reviewer: "女性",
				date: "2026-05",
				rating: 5,
				text: "1年ぶりに、先生の講座を受講させていただきました。先生は、いつも前提から丁寧に説明してくださるので、なんとなく分からないまま進んでしまうという不安がなく、安心して受講することができます。AIの自動化についても、本当に毎日のように新しい情報が入ってきて、「結局何を選べばいいの？」「自分はどう動けばいいの？」と不安でいっぱいでした。でも、先生のお話を伺って、これなら私でもできるかもしれない、置いてけぼりにならずに済むかもしれないと思えて、とても安心感を覚えました。今後も月額サービスでお世話になります。引き続きよろしくお願いいたします。",
			},
			{
				course: "最強AIツール！Claude Code バイブコーディング講座",
				reviewer: "その他 30代",
				date: "2026-05",
				rating: 5,
				text: "全くの初心者ですが、ペースを合わせてくださったので安心してとても楽しく学べました。教えていただいたことを復習して色々活用してみます。またよろしくお願いします。",
			},
			{
				course: "Claude Coworkで変わる仕事術｜AI自律実行を使いこなす",
				reviewer: "男性 40代",
				date: "2026-05",
				rating: 5,
				text: "claude code初心者でしたが非常にわかりやすく、概念から教えていただいたので、理解が定着しました。今後、どんどん使い倒して、神ツールにしていきたいと思います。",
			},
			{
				course: "Claude Coworkで変わる仕事術｜AI自律実行を使いこなす",
				reviewer: "男性",
				date: "2026-06",
				rating: 5,
				text: "イラストも描きながら説明をしていただけるのでとてもわかりやすかったです。難しい言葉も使わないので余計に入ってきました。初心者の方にお勧めの講師ではないでしょうか。",
			},
			{
				course: "ご希望のツールを一緒に作る！そして学ぶ！Notion実践講座",
				reviewer: "女性 40代",
				date: "2026-06",
				rating: 5,
				text: "いつもとても参考になっています！定期的に受講していきたいです！",
			},
		],
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
			title: "E-E-A-T 講座｜権威性で検索とAIに信頼される",
			url: "https://www.street-academy.com/myclass/216408?sessiondetailid=22239230",
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
			url: "https://www.street-academy.com/subscription/services/4690",
			topics: ["AIコンサルティング", "AIシステム構築", "AIアプリ開発", "DX", "経営"],
			pitch: "AIシステム構築・LLMO・業務自動化を、月額で継続伴走。事業をAIで構造化して加速します。",
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
