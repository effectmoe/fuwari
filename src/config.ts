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
			name: "FAQ",
			url: "/faq/",
		},
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
		"https://note.com/effectmoe", // note（国内発見チャネル）
		"https://kangmyung.substack.com", // Substack ニュースレター
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
		name: "シュ コウメイ（Tony Chu）",
		url: "/author/",
	},
	general: [
		{
			q: "AIにくわしくない初心者でも大丈夫ですか？",
			a: "はい。むしろ初心者の方こそ対象です。私の講座やこのブログでは、テクニックを教える前に「なぜそうなるのか」という仕組みから、専門用語をかみくだいて説明することを大切にしています。実際、受講生レビューでも「難しい言葉を使わないので、機械が苦手な私でも分かった」という声を多くいただいています。分からないところは、理解が追いつくまで根気よく一緒に進めますので、安心してください。",
			links: [
				{ label: "著者の教え方・実績を見る", href: "/author/" },
				{ label: "受講生の声（評価4.94／209件）", href: "/about/" },
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
			a: "スキルシェア最大手「ストアカ」で開講しています。2024年8月の登録から約2年で、累計受講435人・レビュー209件・評価4.94（5点満点）・プラチナランクの実績があります。各記事の最後に、その内容に関連する講座へのリンクを自動で置いているので、興味を持ったテーマからそのまま受講できます。",
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
