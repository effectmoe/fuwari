#!/usr/bin/env bash
#
# deploy.sh — effect.moe を Cloudflare Pages へ安全に配信する
#
# ─────────────────────────────────────────────────────────────
# 【なぜこのスクリプトが必要か】2026-08-05 に判明した2つの事実
#
# 1. Cloudflare Pages プロジェクト brain-effect-moe は **Git 連携されていない**
#    （wrangler pages project list の Git Provider が "No"）。
#    つまり git push しても本番は永久に更新されない。配信は常に手動である。
#    → 実際、robots.txt 修正を push しても30分以上ビルドが起きず、原因調査で発覚した。
#
# 2. このリポジトリは毎朝 6:01 に自動コミットが入る
#    （chore(storaca): 日次統計値 sync）。
#    → よって「push したら自動デプロイ」に変えるのは **危険**。
#      作業ツリーに残っている作りかけ（未コミットの管理画面・API・マイグレーション等）や
#      検証前のコミットが、自動的に本番公開されてしまう。
#
# 【この設計の要点】
#   作業ツリーで直接 `wrangler pages deploy dist` を叩くと、**未コミットの作りかけが
#   そのまま本番に出る**。実際 2026-08-05 時点の作業ツリーには未コミットの
#   admin/outreach 画面・functions/api/outreach.ts・D1マイグレーションが存在していた。
#
#   そこで本スクリプトは **git のコミット済み状態から一時作業ツリーを作り、そこで
#   ビルドして配信する**。未追跡ファイルは物理的に存在しないため、混入しようがない。
#
# 【使い方】
#   bash scripts/deploy.sh            # origin/main の最新を配信（通常はこれ）
#   bash scripts/deploy.sh <ref>      # 任意のコミット/タグを配信（切り戻し等）
#   DRY_RUN=1 bash scripts/deploy.sh  # ビルドと検証だけ行い、配信しない
# ─────────────────────────────────────────────────────────────
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="brain-effect-moe"
SITE="https://effect.moe"
REF="${1:-origin/main}"
WORKTREE="$(mktemp -d "${TMPDIR:-/tmp}/effectmoe-deploy-XXXXXX")"

# 途中でどこで失敗しても一時作業ツリーを残さない
cleanup() {
	cd "$REPO_DIR"
	git worktree remove --force "$WORKTREE" >/dev/null 2>&1 || true
	rm -rf "$WORKTREE" >/dev/null 2>&1 || true
}
trap cleanup EXIT

cd "$REPO_DIR"

echo "▶ 1/6 リモートの最新を取得"
git fetch --quiet origin
SHA="$(git rev-parse --short "$REF")"
echo "   配信対象: $REF ($SHA) — $(git log -1 --format='%s' "$REF" | cut -c1-60)"

# 未コミットの変更があるなら警告する。配信されるのは HEAD であって作業ツリーではない、
# という食い違いを黙って通すと「直したはずなのに反映されない」事故になる。
if ! git diff --quiet HEAD -- src public functions astro.config.mjs 2>/dev/null; then
	echo "   ⚠️  未コミットの変更があります。**これらは配信されません**（配信されるのは ${SHA}）"
	git --no-pager diff --stat HEAD -- src public functions astro.config.mjs | sed 's/^/      /'
fi

echo "▶ 2/6 コミット済み状態からクリーンな作業ツリーを作成"
git worktree add --quiet --detach "$WORKTREE" "$SHA"
# node_modules は使い回す（pnpm install を毎回走らせない・依存追加は人間の承認事項）
ln -s "$REPO_DIR/node_modules" "$WORKTREE/node_modules"

echo "▶ 3/6 ビルド"
(cd "$WORKTREE" && pnpm build >/dev/null 2>&1) || { echo "   ❌ ビルド失敗"; exit 1; }

echo "▶ 4/6 成果物の検証"
DIST="$WORKTREE/dist"
fail=0
check() { # 説明 / 条件の実行結果
	if eval "$2" >/dev/null 2>&1; then
		echo "   ✅ $1"
	else
		echo "   ❌ $1"
		fail=1
	fi
}
check "404.html が生成されている（soft 404 の再発防止）" "[ -s '$DIST/404.html' ]"
check "robots.txt が肥大していない（20行未満）"          "[ \$(wc -l < '$DIST/robots.txt') -lt 20 ]"
check "sitemap-index.xml が生成されている"               "[ -s '$DIST/sitemap-index.xml' ]"
check "トップページが生成されている"                     "[ -s '$DIST/index.html' ]"
# 個人メールの公開は絶対禁止（CLAUDE.md）。ビルド成果物にも混入していないことを確かめる。
check "個人メールアドレスが混入していない"               "! grep -rqF 'kangmyung.j@gmail.com' '$DIST'"
[ "$fail" -eq 0 ] || { echo "   → 検証に失敗したため配信を中止しました"; exit 1; }

if [ "${DRY_RUN:-0}" = "1" ]; then
	echo "▶ 5/6 DRY_RUN=1 のため配信をスキップしました"
	exit 0
fi

echo "▶ 5/6 Cloudflare Pages へ配信"
(cd "$WORKTREE" && npx wrangler pages deploy dist \
	--project-name "$PROJECT" --branch main --commit-hash "$(git rev-parse "$SHA")" \
	2>&1 | grep -E "Success|Deployment complete|Error|error")

echo "▶ 6/6 本番の実測検証（キャッシュを回避して実際に叩く）"
cb="$(date +%s)"
probe() { curl -s -o /dev/null --max-time 20 -w '%{http_code}' "$SITE$1?cb=$cb"; }
for i in 1 2 3 4 5 6; do
	top="$(probe /)"; nf="$(probe /no-such-page-xyz-deploy-check)"
	[ "$top" = "200" ] && [ "$nf" = "404" ] && break
	sleep 10
done
echo "   トップページ           : HTTP $top  (期待 200)"
echo "   存在しないURL          : HTTP $nf  (期待 404 — 200 なら soft 404 が再発)"
echo "   robots.txt             : $(curl -s --max-time 20 "$SITE/robots.txt?cb=$cb" | wc -l | tr -d ' ') 行"

if [ "$top" = "200" ] && [ "$nf" = "404" ]; then
	echo "✅ 配信完了 ($SHA)"
else
	echo "⚠️  配信は完了しましたが本番の応答が期待と異なります。上の実測値を確認してください。"
	exit 1
fi
