/**
 * /api/outreach — 業種別・周年別フォーム営業リードの読み書き
 *
 * LLM Wiki側の anniversary_outreach.py / industry_outreach.py 専用の内部API。
 * サイト訪問者向けの公開APIではないため、共有シークレット(OUTREACH_API_KEY)で保護する。
 *
 * GET    /api/outreach?campaign=周年営業&status=候補&corporate_number=1234567890123&limit=50
 *        → 条件に合うリードを配列で返す（corporate_numberはフェーズ1の重複チェック用）
 * GET    /api/outreach?id=xxxxx
 *        → 詳細ページ用に1件だけ取得（他の絞り込み条件と併用不可）
 * POST   /api/outreach            body: {campaign, company_name, corporate_number, ...}
 *        → 新規リードを作成（フェーズ1の候補登録）。id/created_at/updated_atは自動採番
 * PATCH  /api/outreach?id=xxxxx   body: 更新したいフィールドのみ
 *        → 既存リードを更新（フェーズ2の下書き引き上げ・スキップ記録等）
 */

interface Env {
  brain_knowledge: D1Database;
  OUTREACH_API_KEY?: string;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization") || "";
  const expected = `Bearer ${env.OUTREACH_API_KEY || ""}`;
  return Boolean(env.OUTREACH_API_KEY) && auth === expected;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAuth(request, env)) {
    return Response.json({ success: false, error: "unauthorized" }, { status: 401, headers: JSON_HEADERS });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const campaign = url.searchParams.get("campaign");
  const status = url.searchParams.get("status");
  const corporateNumber = url.searchParams.get("corporate_number");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 200);

  const conditions: string[] = [];
  const binds: string[] = [];
  if (id) { conditions.push("id = ?"); binds.push(id); }
  if (campaign) { conditions.push("campaign = ?"); binds.push(campaign); }
  if (status) { conditions.push("status = ?"); binds.push(status); }
  if (corporateNumber) { conditions.push("corporate_number = ?"); binds.push(corporateNumber); }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const db = env.brain_knowledge;
    const stmt = db.prepare(
      `SELECT * FROM outreach_leads ${where} ORDER BY created_at DESC LIMIT ?`
    ).bind(...binds, limit);
    const { results } = await stmt.all();
    return Response.json({ success: true, results }, { headers: JSON_HEADERS });
  } catch (e) {
    return Response.json({ success: false, error: (e as Error).message }, { status: 500, headers: JSON_HEADERS });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAuth(request, env)) {
    return Response.json({ success: false, error: "unauthorized" }, { status: 401, headers: JSON_HEADERS });
  }

  try {
    const body: Record<string, unknown> = await request.json().catch(() => ({}));
    if (!body.campaign || !body.company_name) {
      return Response.json(
        { success: false, error: "campaign and company_name are required" },
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const fields: Record<string, unknown> = {
      id,
      campaign: body.campaign,
      company_name: body.company_name,
      corporate_number: body.corporate_number || null,
      prefecture: body.prefecture || null,
      city: body.city || null,
      rep_name: body.rep_name || null,
      industry: body.industry || null,
      site_url: body.site_url || null,
      form_url: body.form_url || null,
      email_address: body.email_address || null,
      approach_channel: body.approach_channel || null,
      message: body.message || null,
      status: body.status || "候補",
      skip_reason: body.skip_reason || null,
      metadata_json: body.metadata_json ? JSON.stringify(body.metadata_json) : null,
      created_at: now,
      updated_at: now,
    };

    const columns = Object.keys(fields);
    const placeholders = columns.map(() => "?").join(", ");
    const db = env.brain_knowledge;
    await db.prepare(
      `INSERT INTO outreach_leads (${columns.join(", ")}) VALUES (${placeholders})`
    ).bind(...columns.map((c) => fields[c])).run();

    return Response.json({ success: true, id }, { headers: JSON_HEADERS });
  } catch (e) {
    return Response.json({ success: false, error: (e as Error).message }, { status: 500, headers: JSON_HEADERS });
  }
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAuth(request, env)) {
    return Response.json({ success: false, error: "unauthorized" }, { status: 401, headers: JSON_HEADERS });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return Response.json({ success: false, error: "id query param is required" }, { status: 400, headers: JSON_HEADERS });
  }

  const ALLOWED_FIELDS = [
    "company_name", "corporate_number", "prefecture", "city", "rep_name",
    "industry", "site_url", "form_url", "email_address", "approach_channel",
    "message", "status", "skip_reason", "metadata_json",
  ];

  try {
    const body: Record<string, unknown> = await request.json().catch(() => ({}));
    const updates: string[] = [];
    const binds: unknown[] = [];
    for (const key of ALLOWED_FIELDS) {
      if (key in body) {
        updates.push(`${key} = ?`);
        binds.push(key === "metadata_json" && body[key] !== null ? JSON.stringify(body[key]) : body[key]);
      }
    }
    if (!updates.length) {
      return Response.json({ success: false, error: "no updatable fields provided" }, { status: 400, headers: JSON_HEADERS });
    }
    updates.push("updated_at = ?");
    binds.push(new Date().toISOString());
    binds.push(id);

    const db = env.brain_knowledge;
    const result = await db.prepare(
      `UPDATE outreach_leads SET ${updates.join(", ")} WHERE id = ?`
    ).bind(...binds).run();

    if (!result.meta || result.meta.changes === 0) {
      return Response.json({ success: false, error: "not found" }, { status: 404, headers: JSON_HEADERS });
    }
    return Response.json({ success: true }, { headers: JSON_HEADERS });
  } catch (e) {
    return Response.json({ success: false, error: (e as Error).message }, { status: 500, headers: JSON_HEADERS });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
};
