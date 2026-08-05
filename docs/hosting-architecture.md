# ホスティング構成メモ（2026-08-05 実測で確定）

このリポジトリは **2つのホスティングサービスに同時にデプロイされている**。
片方だけを見て判断すると事故になるため、実測で確かめた事実をここに残す。

## 誰が何を配信しているか

| ドメイン | 配信元 | 役割 |
|---|---|---|
| `effect.moe` | **Cloudflare Pages** プロジェクト `brain-effect-moe` | サイト本体 |
| `tony.effect.moe`（旧ドメイン） | **Vercel** プロジェクト `fuwari` | `vercel.json` の 301 リダイレクトのみ |

実測（2026-08-05）:

```
curl -sI https://effect.moe/      → server: cloudflare
curl -sI https://tony.effect.moe/ → server: Vercel / HTTP 301 → https://effect.moe/blog/
dig tony.effect.moe               → CNAME vercel-dns
```

> ⚠️ **「Vercel は使っていない」と判断して連携を切ってはいけない。**
> 旧ドメインの全URLが 404 になり、蓄積した被リンクと検索評価を失う。

## Cloudflare Pages は Git 連携されていない

```
$ npx wrangler pages project list
brain-effect-moe   effect.moe   Git Provider: No
```

**`git push` しても effect.moe は永久に更新されない。** 配信は常に手動である。
2026-08-05 に robots.txt 修正を push しても 30 分以上ビルドが起きず、この調査で判明した。

### なぜ Git 連携を張らないのか

このリポジトリには **毎朝 6:01 に自動コミットが入る**（`chore(storaca): 自動更新 - 日次統計値 sync`）。
Git 連携を張ると、検証前のコミットや作業ツリーの作りかけが自動で本番公開される。

実際 2026-08-05 時点の作業ツリーには、未コミットの管理画面（`src/pages/admin/outreach/`）、
API（`functions/api/outreach.ts`）、D1 マイグレーションが残っていた。
作業ツリーで直接 `wrangler pages deploy dist` を叩けば、これらがそのまま本番に出ていた。

### 正しいデプロイ方法

```bash
bash scripts/deploy.sh          # origin/main を配信
bash scripts/deploy.sh <ref>    # 任意のコミットを配信（切り戻し）
DRY_RUN=1 bash scripts/deploy.sh  # 配信せず検証のみ
```

このスクリプトは **git のコミット済み状態から一時作業ツリーを作ってビルドする**ため、
未追跡ファイルは物理的に存在せず、混入しようがない。
配信後は本番を実際に叩いて（404 が 404 を返すか等）検証する。

## Vercel の日次フルビルド抑止

Vercel は上記の日次自動コミットのたびに Astro サイト全体をフルビルドしていた（毎回 45 秒前後）。
Vercel が実際に使うのは `vercel.json` の redirects 定義だけで、ビルド成果物は誰も見ていない。

`vercel.json` の `ignoreCommand` で、日次自動コミットのときだけビルドをスキップする。

```json
"ignoreCommand": "echo \"$VERCEL_GIT_COMMIT_MESSAGE\" | grep -q '^chore(storaca)'"
```

`ignoreCommand` は **終了コード 0 でビルドをスキップ、0 以外で実行**する仕様。
grep がマッチ（＝自動コミット）→ 0 → スキップ。マッチしない（＝人の変更）→ 1 → ビルド。

ビルドがスキップされても直前の本番デプロイがエイリアスに残るため、**リダイレクトは無停止**。

### 失敗した最初の案（記録として残す）

当初は「`vercel.json` が変わった時だけビルド」を狙って以下を書いたが、**デプロイが 0ms で Error になった**。

```json
"ignoreCommand": "git diff --quiet HEAD^ HEAD -- vercel.json"
```

ローカルの `vercel build` は通るのに、プラットフォーム側だけ失敗した。
Vercel のクローンは浅く `HEAD^` が存在しないため、git が異常終了したものと考えられる。
**ビルド環境の git 履歴に依存する条件は書かない**こと。
（なお、この失敗中もリダイレクトは直前デプロイが残って無停止だった。安全側に倒れる設計になっている。）

## より根本的な案（未実施・DNS 変更を伴う）

`tony.effect.moe` の DNS を Cloudflare に寄せ、Cloudflare の Redirect Rules で同じ転送を実現すれば、
**Vercel 自体が不要**になり、ホスティングが 1 本化される。
DNS 切替を伴うため、実施はトニーの判断を待つこと。
