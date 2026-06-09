---
title: "Obsidian でブログ運用するときのモバイル問題：Obsidian Sync の戦略的価値"
published: 2026-06-10
description: "Obsidian + Astro でブログ運用すると「モバイル編集が弱い」問題に直面する。Notion 移行を考える前に、月 10 ドルの Obsidian Sync が何を解決するのか、なぜパイプラインの入口を広げる設計が美しいのかを解説する。"
image: "./cover.svg"
tags: ["Obsidian", "Obsidian Sync", "Astro", "モバイル運用", "ワークフロー"]
category: "Tech"
draft: false
---

> **TL;DR**
>
> Obsidian + Astro で運用するブログの最大の弱点は「モバイル編集」。
> ただし **Obsidian Sync（月 $10）** で一発解決する。
> Sync は単なる同期機能ではなく、**「Markdown ネイティブパイプラインの入口を iPhone まで延伸する」**設計上の意味を持つ。
> Notion 移行で全パイプラインを壊すより、月 1,500 円で入口だけ広げる方が桁違いに安い。

## なぜこの記事？

Astro + Obsidian でブログを構築すると、最初にぶつかる壁が **「モバイルで書けない」** 問題だ。

「移動中にアイデアが湧いた」「カフェで下書きしたい」「ベッドで思いついた一行をメモしたい」。
これに対応できないと、ブログ執筆のリズムが取れない。

Notion 移行で解決しようとする前に、もっと安く・既存パイプラインを壊さず解決する手段がある。それが **Obsidian Sync** だ。本記事はその選択の戦略的意味を整理する。

## Obsidian Sync の仕様

| 項目 | 内容 |
|---|---|
| **料金** | $10/月（Sync 単体）/ $12/月（Catalyst バンドル） |
| 暗号化 | End-to-End（Obsidian 社も中身を見ない） |
| バージョン履歴 | 1 年保持 |
| ストレージ | 5GB（Vault のみ。`.obsidian/` 設定も同期） |
| 対応端末 | Mac / Windows / iPhone / iPad / Android（全部） |
| **部分同期** | サブフォルダ単位で選択可 |
| 同時編集 | 同時間に複数端末で編集 OK（コンフリクト自動解消） |

このサービスが解決するのは、まさに **「Mac で持っている Vault を iPhone でもそのまま触れる」** こと。

## 何が解決するのか

### モバイル編集問題

iPhone Obsidian アプリで Fuwari の Vault を完全同期できる。

```
平日朝の通勤電車：
  iPhone Obsidian で記事の見出し構造を作る
   ↓
昼休みカフェ：
  iPad Obsidian で本文を書き進める
   ↓
帰宅後の Mac：
  Obsidian で frontmatter を整理し、画像を追加、commit-and-sync
   ↓
Vercel ビルド → 公開
```

これが **一つの Vault で繋がっている** という状態は、執筆のリズムを劇的に変える。

### 既存パイプラインの完全保全

ここが最も重要なポイントだ。

Sync の導入で、以下のものは **一切変更不要** である。

- Astro / Fuwari のテンプレート
- Markdown フロントマター仕様
- Vercel ビルド設定
- GitHub リポジトリ構造
- 自作の自動投稿スクリプト
- 既存のブログ記事

つまり、**「上流で書く場所を増やすだけ」**で、下流のパイプラインはそのまま動く。
これは「移行」ではなく **「延伸」** であり、設計コストが極小化される。

### 「Mac 故障 = ブログ消失」のリスクヘッジ

副次的だが重要な効果として、暗号化バックアップとしても機能する。

ローカル単独運用だと、Mac が物理破損した場合に未 commit 分のドラフトが消える。Sync があれば iPhone / iPad に最新版が残る。

## なぜ Notion 移行ではなく Sync を選ぶのか

Obsidian Sync を「単なるモバイル対応」と捉えると、月 $10 が高く感じるかもしれない。だが本質はそうではない。

### 設計上の意味

Sync は **「Markdown ネイティブパイプラインの入口を iPhone まで延伸する」** ことだ。

```
Mac:                          iPhone:
LLM Wiki(MD)  ──Sync──→  LLM Wiki(MD)
Fuwari(MD)    ──Sync──→  Fuwari(MD)

下流：Astro / GitHub / Vercel は一切変更なし
```

入口だけ広がる。パイプラインの構造は不変。これは設計上 **極めて美しい**。

対照的に、Notion 移行は **「下流のパイプラインを根本から作り直す」** 選択になる。

- 既存自動化スクリプトの全書き換え
- Astro Content Layer の活用方法変更
- Notion API 連携の実装
- 型安全性の二重管理
- Notion 障害時の公開停止リスク

これらをすべて引き受けて得るものが「モバイル編集」だとすれば、Obsidian Sync の $10/月のほうが **桁違いに安い**。

### 数十時間の書き直しコスト vs. 月 1,500 円

スキルやスクリプトの書き直しに必要な時間を考えると、Sync の年間 $120 は安すぎる。

仮にスクリプト書き直しに 40 時間かかるとして、時給 5,000 円換算で 20 万円。Sync は年 1.5 万円。

13 年分の Sync 料金が、たった一度の書き直しコストで吹き飛ぶ。

## 部分同期で機密配慮する設計

LLM Wiki 全体を同期したい場合、機密情報を含む Vault を iPhone に同期すると情報漏洩リスクがある。

そこで部分同期を活用する。

```
LLM Wiki Vault:
  ├ Astro/              ← 同期 OK（公開系の運用ノート）
  ├ EFFECT/             ← 同期しない（自社機密）
  ├ <Client A>/         ← 同期しない（クライアント機密）
  └ ...

Fuwari Vault:
  └ 全部同期 OK（最終的に公開される素材のため）
```

機密が含まれる Vault は Mac 内ローカルのみに留め、公開ブログ用 Vault だけスマホと同期する。この **境界線の引き方** ができるのが Sync の柔軟性だ。

## まとめ：「入口を広げる」設計の美学

Obsidian + Astro 環境のモバイル弱点は、$10/月で「**パイプラインの入口を広げる**」発想で解決できる。

- パイプラインの構造を変えない
- 既存資産を一切壊さない
- 機密 Vault は除外可能
- バックアップとしても機能する
- 桁違いに安い

「Notion 移行で全部やり直す」前に、まずこの選択肢を冷静に評価することが、技術選定の成熟度を示す。

## 関連リンク

- [Obsidian Sync 公式](https://obsidian.md/sync)
- [Obsidian Mobile（iOS / Android アプリ）](https://obsidian.md/mobile)
- [Astro Content Collections 公式ガイド](https://docs.astro.build/en/guides/content-collections/)
- [Fuwari テーマ（本ブログで採用）](https://github.com/saicaca/fuwari)
