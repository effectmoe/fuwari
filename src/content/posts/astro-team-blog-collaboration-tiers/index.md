---
title: "Astro でチームブログを運用するための 4 つの選択肢：個人から段階的に拡張する設計"
published: 2026-06-10
description: "Astro + Obsidian の弱点は「チームでの共同編集」と言われる。しかし Astro/Markdown の根幹を変えずに、Web エディタ・ヘッドレス CMS・自前管理画面の 4 階層を段階導入することで、個人ブログからチーム運用まで途切れなくスケールできる。"
image: "./cover.svg"
tags: ["Astro", "ヘッドレス CMS", "チーム運用", "Keystatic", "Cloudflare Access"]
category: "Tech"
draft: false
---

> **TL;DR**
>
> Astro + Obsidian は「チームコラボに弱い」と言われがちだが、それは **執筆 UI（authoring layer）** の問題であり、Astro/Markdown 自体はチーム化に対応している（Git がそのレイヤー）。
> Web エディタ・ヘッドレス CMS・自前管理画面の **4 階層** から、必要なものだけ段階的に被せる設計が可能で、個人ブログからチーム運用まで **「根幹を変えずに」** スケールできる。

## なぜこの記事？

Astro + Obsidian で個人ブログを運用していると、いつか必ず次の壁にぶつかる。

「複数人で書きたい」
「編集長が承認してから公開したい」
「役割別の権限管理がしたい」

これらの課題を Obsidian は単独機運用前提で設計されているため解決できない。

しかし「だから Notion / WordPress に移行しよう」と短絡するのは早計だ。**Astro/Markdown の根幹はそのまま維持して、執筆 UI だけ追加する** 設計が複数ある。本記事はその 4 階層を整理する。

## 問題の本質を分解する

「チームでサイトを作る」を 4 つの要件に分解すると、こうなる。

| # | 要件 | 個人運用 + Obsidian の状態 |
|---|---|---|
| 1 | 複数人が記事を書ける | ❌ Obsidian は単独機 |
| 2 | 編集者がレビューして承認 | ❌ 仕組みなし |
| 3 | 役割別の権限管理 | ❌ なし |
| 4 | モバイル対応 | △ Obsidian Sync で部分解決 |

すべて **「authoring layer（執筆 UI）」の問題** であり、Astro 本体は無関係だ。Git がチーム化のレイヤーとして既に存在しているため、その上に「人間が触る UI」を被せれば良い。

## 解決策の 4 階層

### Tier 0：GitHub ネイティブ運用

技術者中心のチームなら、追加実装ゼロで成立する。

```
ライター ──→ GitHub ブランチ作成 → Markdown 書く → PR 作成
                          ↓
            編集長 ──→ PR レビュー → コメント → Merge
                          ↓
                  Vercel 自動ビルド → 公開
```

ツール：
- **GitHub.dev**（リポジトリで `.` キー → Web エディタ起動、無料）
- **GitHub mobile アプリ**
- **VS Code Web**（vscode.dev）

メリット：
- ゼロ追加実装
- ネイティブな review・コメント機能
- Markdown 直編集（変換ロスゼロ）
- 完全無料

デメリット：
- 非技術者には git 概念が高ハードル

### Tier 1：ヘッドレス CMS（git-backed CMS）⭐ 最有力

**Astro/Markdown を一切いじらず、Web 管理画面だけ追加する** 選択肢。

主要な OSS / 商用 CMS：

| CMS | 特徴 | 学習コスト |
|---|---|---|
| **Decap CMS**（旧 Netlify CMS） | OSS / git-backed / 無料 / 静的サイト定番 | 中 |
| **TinaCMS** | Inline 編集（プレビュー見ながら） / git-backed | 中 |
| **Pages CMS**（pagescms.org） | 2024 年登場のモダン版・最もシンプル | 低 |
| **Keystatic** | 新興 / 型安全 / Astro 公式採用例あり | 中 |

Astro と特に相性が良いのは **Keystatic** か **Pages CMS** だ。

Keystatic は Astro の dev team が推奨しており、スキーマ定義で frontmatter を厳格管理できる。Pages CMS は設定 5 分でセットアップ完了する手軽さが強い。

動作フロー：

```
チームメンバー ──→ ブラウザで /admin/ にアクセス
                          ↓
                  Google OAuth / Cloudflare Access 認証
                          ↓
                  Web UI で記事編集（プレビュー付き）
                          ↓
                  「公開」ボタン
                          ↓
                  Markdown ファイルを git commit & push（自動）
                          ↓
                  Vercel 自動ビルド → 公開
```

メリット：
- **Astro/Markdown パイプライン完全維持**
- 非技術者でも Web UI で書ける
- モバイル対応
- プレビュー機能あり
- ロール管理可能（editor / author / viewer）
- **Cloudflare Access と統合で社内専用にできる**

デメリット：
- 初期セットアップ 1〜2 時間
- 認証設定が必要

### Tier 2：自前で薄い管理画面

```
Astro サイト (公開層)
    +
/admin/ パス ← Cloudflare Access で保護
    ↓
独自 Web UI（React / Svelte 等）
    ↓
GitHub API 経由で git commit
```

メリット：
- 完全カスタマイズ可能
- Wiki と連携した独自ワークフロー（社内 RAG 連携など）
- Cloudflare Access の既存資産活用

デメリット：
- 開発時間（数日〜数週間）
- メンテナンス負荷

### Tier 3：リアルタイム共同編集（HackMD 系）

HackMD で複数人が同時編集 → GitHub 同期。

メリット：
- Google Docs 的なリアルタイム編集

デメリット：
- HackMD 有料プラン必要
- 同期に時間差あり

## 段階的導入の美しさ

最大のポイントは、**どの Tier を足しても Astro/Markdown の根幹は不変** ということだ。

```
Phase 1（個人運用）: Obsidian + Obsidian Sync
                ├─ ソロで書ける
                └─ モバイル対応
                
Phase 2（チーム化したくなったら）: Tier 1 追加
                ├─ Keystatic or Pages CMS 導入
                ├─ Cloudflare Access で保護
                └─ ライター・編集者にアカウント発行

Phase 3（独自ワークフローが必要なら）: Tier 2
                ├─ 自前管理画面
                └─ 社内ナレッジ統合
```

この設計の何が良いか：
- Phase 1 → 2 → 3 のどれを足しても **既存実装は捨てない**
- 個人ブログから始めた人がチーム運用にスケールアップする時、書き直しが発生しない
- 「使わなくなった Tier を外す」ことも可能（撤退可能）

「捨てるフェーズが存在しない」設計は、長期運用において最大の価値を生む。

## まとめ：選定の指針

「チームコラボの弱点だから Astro はやめよう」と判断するのは、**問題の本質を見誤っている**。

要件を分解し、4 階層から必要なものだけ被せる発想を持てば、個人ブログから企業メディアまで途切れなくスケールできる。

判断のための問いは以下だ。

1. **今すぐチーム化が必要か？それとも将来的に？**
2. **チームメンバーは技術者か非技術者か？**
3. **記事承認ワークフローは必要か？**
4. **既存の Cloudflare Access / GitHub 資産はあるか？**

これらに沿って Tier を選べば、過剰投資せず適切な拡張ができる。

## 関連リンク

- [Keystatic 公式](https://keystatic.com/)
- [Pages CMS 公式](https://pagescms.org/)
- [Decap CMS 公式](https://decapcms.org/)
- [TinaCMS 公式](https://tina.io/)
- [GitHub.dev（ブラウザで使える Web エディタ）](https://github.com/dev)
- [Cloudflare Access 公式](https://www.cloudflare.com/zero-trust/products/access/)
