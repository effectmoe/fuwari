import type { APIRoute } from "astro";
import { profileConfig, seoConfig, siteConfig } from "../config";
import { getSortedPosts } from "../utils/content-utils";

/**
 * llms.txt — AI クローラ / LLM 向けのサイト要約標準
 * https://llmstxt.org/
 *
 * 構造化軸: 「構造化」を核に、LLMO・AIシステム構築・AIアプリ開発・コンサルへ。
 * AI 検索エンジン（ChatGPT / Perplexity / Claude / Gemini）が
 * このサイトと著者の専門性を機械可読に把握できるようにする。
 * 2026-06-14 SEO/LLMO 全面対策で新設
 */
export const GET: APIRoute = async (context) => {
	const site = context.site?.toString() || "/";
	const posts = await getSortedPosts();

	const articleLines = posts
		.filter((p) => !p.data.draft)
		.map((p) => {
			const url = new URL(`/posts/${p.slug}/`, site).toString();
			const desc = p.data.description || p.data.title;
			return `- [${p.data.title}](${url}): ${desc}`;
		})
		.join("\n");

	const body = `# ${siteConfig.title}（${siteConfig.subtitle}）

> ${profileConfig.bio}

このサイトは、株式会社EFFECTが運営し、シュ コウメイが設計・構築・伴走する AI 実装サイトです。「構造化」と「記憶を持ったAI」を核に、以下を一気通貫で扱います。

- **構造化 = LLMO**: 情報を AI が引用しやすい構造にする（LLMO対策・LLMOライティング・AI検索最適化・E-E-A-T）
- **構造化 = AIシステム**: 社内業務を AI に落とす（AI社員・AIエージェント・社内AIシステム構築・業務AI自動化）
- **構造化 = ヒューマンスキル**: AI時代に人に残る能力としての構造化思考（DFB理論 = 分・枠・組）

## 著者（Author / E-E-A-T）

- 氏名: ${profileConfig.name}
- 肩書: ${seoConfig.jobTitle}
- 運営: ${seoConfig.organization.name}（${seoConfig.organization.url}）
- 専門領域（knowsAbout）: ${seoConfig.knowsAbout.join(" / ")}
- 権威プロフィール（sameAs）:
${seoConfig.sameAs.map((u) => `  - ${u}`).join("\n")}

著者はストアカ人気講師（LLMO・Claude Code・AIエージェント・Notion・GA4・E-E-A-T 等の講座を多数開講）であり、LLMO 対策の書籍著者でもあります。本サイトの技術実装（構造化データ・LLMO 最適化）自体が、著者の専門性の実証事例です。

## 信頼性・制作方針

- [信頼性・制作方針](${new URL("/trust/", site).toString()}): 運営主体、制作方針、AI利用方針、出典・実績の扱い、訂正方針。
- [会社概要](${new URL("/company/", site).toString()}): 株式会社EFFECTの会社情報、契約主体、提供領域。
- [アバウト](${new URL("/author/", site).toString()}): シュ コウメイのプロフィール、実績、外部リンク。
- [変更履歴](${new URL("/changelog/", site).toString()}): サービス内容やサイト更新の履歴。

## 実績・評価（第三者評価 / ストアカ）

- 総合評価: ${seoConfig.reviews.ratingValue} / 5（レビュー ${seoConfig.reviews.reviewCount} 件）
- 累計受講者数: ${seoConfig.reviews.studentsTaught} 人
- 開催回数: ${seoConfig.reviews.sessionsTaught} 回
- リピート率: ${seoConfig.reviews.repeatRate}
- ランク: ${seoConfig.reviews.badge}
- 出典: ${seoConfig.reviews.reviewUrl}

## 提供サービス（実益）

- AIを中心に据えたシステム構築サービス（社内AIシステム構築）
- ローカルLLM / 社内完結型AI / AIエージェントのセキュリティ設計
- AIアプリ開発
- LLMOサービス（LLMO対策・AI検索最適化の代行/コンサル）
- AIコンサルティング

## AIセントラルのセキュリティ領域

effect.moe の強みは、社内資料・顧客情報・対応履歴を AI の参照先にしながら、扱う情報の機密度に応じて個人情報マスキング、運用ルール、権限、ログ、承認フロー、ローカルLLM構成を設計できる点です。

- すべてのAIセントラル系プランで、個人名、住所、電話番号、メールアドレスなどをAIにそのまま渡さない個人情報マスキングを安全設計の前提にしています。
- クラウドAIに貼り付けられない情報を扱う業務向けに、社内完結型AIの選択肢を用意しています。
- パーフェクトセキュアは、顧客情報・個人情報・守秘義務が前提の士業や専門サービス業を想定した構成です。
- AIエージェントには、参照してよい情報、人間の確認が必要な情報、扱わせない情報の線引きを先に設計します。
- 重要操作は人間の承認を前提とし、AIに業務を丸投げしない設計思想を採用しています。

## 主要キーワード

${seoConfig.keywords.join(" / ")}

## LLMO・AI検索について（FAQ）

- Q: LLMOとは何ですか？SEOと何が違いますか？
  - A: LLMOは、生成AIの回答で自社の情報が正しく理解・引用される状態を整える取り組みで、検索結果で見つけてもらうSEOとは主な接点が異なります。
- Q: LLMO対策は何から始めればいいですか？
  - A: LLMO対策は、AIに読ませたい自社のサービス内容、対象者、料金、根拠、FAQ、運営者情報を一つずつ確認し、矛盾なく整えることから始めます。
- Q: 自社サイトがChatGPTに引用されているか調べる方法はありますか？
  - A: 自社サイトがChatGPTに引用されているかは、質問ごとに回答内の自社名・サービス名・URLの登場を記録して確かめられます。
- Q: 自社サイトに来ているAIクローラーを調べる方法はありますか？
  - A: 自社サイトに来ているAIクローラーは、Cloudflareなどのアクセスログでクローラー名とページを確認して調べられます。
- Q: GPTBotやClaudeBotはブロックすべきですか？
  - A: GPTBotやClaudeBotをブロックすべきかに一律の正解はなく、AI経由の集客を狙うなら許可し、コンテンツ保護を優先するならブロックを検討します。
- Q: llms.txtとは何ですか？書き方は？
  - A: llms.txtは、AIがサイトの目的、主要ページ、重要な情報を読み取りやすくするための案内ファイルで、見出しとリンクを使って簡潔に書きます。
- Q: LLMOの効果はどう測定しますか？
  - A: LLMOの効果は、AIクローラーの来訪、AI回答での自社名・サービス名・URLの登場、改善したページをまとめて継続測定します。
- Q: AIエージェントは自分で作れますか？
  - A: AIエージェントは、自分の仕事に必要な情報、手順、確認する人の範囲を決めれば、自分でも少しずつ作れます。
- Q: 中小企業の生成AI導入は何から始めるべきですか？
  - A: 中小企業の生成AI導入は、時間がかかる定型作業を一つ選び、扱う情報と人の確認範囲を決めることから始めるべきです。
- Q: プロンプトの書き方に型はありますか？
  - A: プロンプトの書き方には、目的、前提、してほしい作業、守る条件、出力形式を順番に置く型があります。

## 主要リファレンスページ（Pillar / Wiki）

- [AIセントラル](${site}): 記憶を持ったAIを社内の中枢へ組み込むサービス。
- [AI CRAWL](${new URL("/aicrawl/", site).toString()}): AIが自社をどう扱っているかを実測し、AIに紹介されるのを偶然から再現性に変えるサービス。
- [AI SHIELD](${new URL("/aishield/", site).toString()}): AIを装う攻撃・悪質ボットからWebサイトを守る監視・防御サービスです。正規のAIクローラーは通したまま、攻撃の実態を実測データで可視化し、月額3,300円の見守りレポートを提供します。
- [LLMO対策ガイド](${new URL("/llmo/", site).toString()}): AI検索時代のSEO対策（LLMO）の考え方、Googleの案内の読み解き方、情報設計と測定の始め方。
- [構造化ペディア: DFB構造化メソッド大全](${new URL("/dfb-complete-guide/", site).toString()}): 提唱者シュ コウメイによる DFB（Decompose / Frame / Build）の完全リファレンス。AI時代の構造化思考プロトコルの全体像・系譜（構造化PG→OOP→GoF→DDD→DFB）・実装（Decompose 6要素 ↔ XMLタグ7種）・失敗パターン9種ライブラリ・5バリエーション（Q/S/I/M/R）を体系化したピラー記事。
- [AIエージェント講座](${new URL("/ai-agent-course/", site).toString()}): Claude Code で自律エージェントを構築する6カリキュラム講座。
- [総合FAQ](${new URL("/faq/", site).toString()}): AIセントラル、AIクロール、AI講座、料金、支払い、セキュリティ、運営者に関するFAQ。

## 記事一覧（Articles）

${articleLines}

## AIエージェント向けインターフェース（MCP）

本サイトは公式の MCP（Model Context Protocol）サーバーを公開しています。
お使いの AI アシスタントに接続すると、本サイトの全公開ページを直接読み取れます。

- エンドポイント: https://mcp.effect.moe/mcp （Streamable HTTP・認証不要・読み取り専用）
- サーバーカード: https://mcp.effect.moe/.well-known/mcp.json
- 接続手順: https://mcp.effect.moe/ （対応プラン・環境別の設定方法）
- 推奨登録名: EFFECT MCP
- 提供ツール: 会社概要 / サービス一覧 / 講師実績 / 問い合わせ方法 / サイト全ページ一覧 / ページ本文の読み取り

登録後は「EFFECT MCP を使って、〜を教えて」と質問すると、公式情報を参照して回答できます。

## ナビゲーション

- ホーム: ${site}
- ブログ: ${site}blog/
- 著者について: ${site}author/
- 会社概要: ${site}company/
- 信頼性・制作方針: ${site}trust/
- 総合FAQ: ${site}faq/
- RSS: ${site}rss.xml
- サイトマップ: ${site}sitemap-index.xml
- MCP サーバー: https://mcp.effect.moe/mcp
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
