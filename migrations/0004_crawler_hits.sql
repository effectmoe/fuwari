-- effect.moe AIクローラー巡回ログ（effect-moe-crawler D1）
--
-- Cloudflare Pages でホスティングしているため、Xserver/さくらのような
-- access_log ファイルが存在しない。Pages Functions の middleware で
-- AI bot のリクエストだけをここに記録し、ローカル DuckDB へ同期する。
--
-- 既存クライアント（ガイド屋さん/クラウドBPO）の crawler_hits と
-- 列構成を意図的に揃えてある（週次レポートの集計SQLを再利用するため）。

CREATE TABLE IF NOT EXISTS crawler_hits (
  ts_iso   TEXT NOT NULL,   -- UTC ISO8601（例: 2026-08-01T04:12:33Z）
  day      TEXT NOT NULL,   -- JST の YYYY-MM-DD（集計キー・書き込み時に確定させる）
  bot      TEXT NOT NULL,   -- 正規化した bot 名（GPTBot / ClaudeBot ...）
  path     TEXT NOT NULL,
  status   INTEGER NOT NULL,
  ua       TEXT NOT NULL,
  ip       TEXT NOT NULL DEFAULT '',
  country  TEXT NOT NULL DEFAULT '',
  referer  TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (ts_iso, path, ip)
);

-- 週次レポートは day 範囲で引くため
CREATE INDEX IF NOT EXISTS idx_crawler_hits_day ON crawler_hits (day);
CREATE INDEX IF NOT EXISTS idx_crawler_hits_bot ON crawler_hits (bot);

-- 同期済み位置の管理（ローカル DuckDB 側が「どこまで取り込んだか」を持つので
-- ここでは保持期間の掃除にだけ使う）
CREATE TABLE IF NOT EXISTS crawler_meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
