interface Env {
  effect_moe_inquiries: D1Database;
  ADMIN_TOKEN?: string;
}

const ALLOWED_STATUSES = new Set(["new", "reviewing", "contacted", "closed"]);

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(init.headers ?? {}),
    },
  });
}

function clean(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function isAuthorized(request: Request, env: Env) {
  const token = env.ADMIN_TOKEN;
  if (!token) return false;
  const authorization = request.headers.get("authorization") || "";
  return authorization === `Bearer ${token}`;
}

function unauthorized(env: Env) {
  return json(
    {
      ok: false,
      error: env.ADMIN_TOKEN ? "unauthorized" : "admin_token_not_configured",
    },
    { status: env.ADMIN_TOKEN ? 401 : 503 },
  );
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthorized(request, env)) return unauthorized(env);

  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 50), 1), 100);
  const status = clean(url.searchParams.get("status"), 24);
  const type = clean(url.searchParams.get("type"), 80);

  const where: string[] = [];
  const params: unknown[] = [];

  if (status && ALLOWED_STATUSES.has(status)) {
    where.push("status = ?");
    params.push(status);
  }

  if (type) {
    where.push("inquiry_type = ?");
    params.push(type);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const result = await env.effect_moe_inquiries.prepare(`
    SELECT
      id, inquiry_type, company, department, name, email, phone, interest,
      data_location, message, diagnosis_details, page_url, source, status,
      created_at, updated_at
    FROM inquiries
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(...params, limit).all();

  return json({ ok: true, inquiries: result.results ?? [] });
};

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthorized(request, env)) return unauthorized(env);

  const body = await request.json() as Record<string, unknown>;
  const id = clean(body.id, 80);
  const status = clean(body.status, 24);

  if (!id || !ALLOWED_STATUSES.has(status)) {
    return json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const result = await env.effect_moe_inquiries.prepare(`
    UPDATE inquiries
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(status, id).run();

  return json({ ok: true, changes: result.meta.changes });
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    headers: {
      "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-store",
    },
  });
