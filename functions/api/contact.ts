interface Env {
  effect_moe_inquiries: D1Database;
  GAS_GMAIL_URL?: string;
}

const MAX_LENGTHS = {
  company: 120,
  department: 120,
  name: 80,
  email: 160,
  phone: 40,
  interest: 80,
  dataLocation: 120,
  message: 3000,
  pagePath: 240,
  pageUrl: 500,
  source: 80,
  diagnosisDetails: 4000,
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      ...(init.headers ?? {}),
    },
  });
}

function clean(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function hasEmailShape(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function collectList(value: unknown, maxItems = 12) {
  if (Array.isArray(value)) {
    return value
      .map((item) => clean(item, 120))
      .filter(Boolean)
      .slice(0, maxItems);
  }

  const single = clean(value, 120);
  return single ? [single] : [];
}

function buildDiagnosisDetails(body: Record<string, unknown>, inquiryType: string) {
  if (inquiryType !== "free_diagnosis") return "";

  const details = {
    primaryWorkflow: clean(body.primaryWorkflow, 160),
    bottlenecks: collectList(body.bottlenecks),
    tools: collectList(body.tools, 18),
    sensitiveData: clean(body.sensitiveData, 160),
    aiScope: clean(body.aiScope, 160),
    securityRequirement: clean(body.securityRequirement, 160),
    expectedOutcome: collectList(body.expectedOutcome),
  };

  return clean(JSON.stringify(details), MAX_LENGTHS.diagnosisDetails);
}

async function hashIp(value: string) {
  if (!value) return "";
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Record<string, unknown>;

    // Simple honeypot. Real users never see this field.
    if (clean(body.website, 120)) {
      return json({ ok: true });
    }

    const inquiry = {
      inquiryType: clean(body.inquiryType, MAX_LENGTHS.interest) || "free_consultation",
      company: clean(body.company, MAX_LENGTHS.company),
      department: clean(body.department, MAX_LENGTHS.department),
      name: clean(body.name, MAX_LENGTHS.name),
      email: clean(body.email, MAX_LENGTHS.email),
      phone: clean(body.phone, MAX_LENGTHS.phone),
      interest: clean(body.interest, MAX_LENGTHS.interest),
      dataLocation: clean(body.dataLocation, MAX_LENGTHS.dataLocation),
      message: clean(body.message, MAX_LENGTHS.message),
      pagePath: clean(body.pagePath, MAX_LENGTHS.pagePath),
      pageUrl: clean(body.pageUrl, MAX_LENGTHS.pageUrl),
      source: clean(body.source, MAX_LENGTHS.source) || "effect_moe_lp",
    };
    const diagnosisDetails = buildDiagnosisDetails(body, inquiry.inquiryType);

    const missing = [
      ["company", inquiry.company],
      ["name", inquiry.name],
      ["email", inquiry.email],
      ["interest", inquiry.interest],
      ["dataLocation", inquiry.dataLocation],
      ["message", inquiry.message],
    ].filter(([, value]) => !value).map(([field]) => field);

    if (missing.length) {
      return json({ ok: false, error: "required_fields_missing", fields: missing }, { status: 400 });
    }

    if (!hasEmailShape(inquiry.email)) {
      return json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const userAgent = clean(request.headers.get("user-agent"), 500);
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
    const ipHash = await hashIp(ip);

    await env.effect_moe_inquiries.prepare(`
      INSERT INTO inquiries (
        id, inquiry_type, company, department, name, email, phone, interest,
        data_location, message, page_path, page_url, source, user_agent, ip_hash,
        diagnosis_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      inquiry.inquiryType,
      inquiry.company,
      inquiry.department || null,
      inquiry.name,
      inquiry.email,
      inquiry.phone || null,
      inquiry.interest,
      inquiry.dataLocation,
      inquiry.message,
      inquiry.pagePath || null,
      inquiry.pageUrl || null,
      inquiry.source,
      userAgent || null,
      ipHash || null,
      diagnosisDetails || null,
    ).run();

    if (env.GAS_GMAIL_URL) {
      const subject = `【effect.moe問い合わせ】${inquiry.interest} / ${inquiry.company}`;
      const text = [
        "effect.moe のLPから問い合わせがありました。",
        "",
        `問い合わせID: ${id}`,
        `種別: ${inquiry.inquiryType}`,
        `会社名: ${inquiry.company}`,
        `所属部署名: ${inquiry.department || "-"}`,
        `お名前: ${inquiry.name}`,
        `メールアドレス: ${inquiry.email}`,
        `電話番号: ${inquiry.phone || "-"}`,
        `ご検討内容: ${inquiry.interest}`,
        `現在の情報の置き場所: ${inquiry.dataLocation}`,
        `ページ: ${inquiry.pageUrl || inquiry.pagePath || "-"}`,
        ...(diagnosisDetails ? ["", "無料診断カルテ:", diagnosisDetails] : []),
        "",
        "メッセージ:",
        inquiry.message,
      ].join("\n");

      await fetch(env.GAS_GMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_gmail",
          to: "info@effect.moe",
          subject,
          body: text,
          from_name: "effect.moe LP",
        }),
      }).catch(() => null);
    }

    return json({ ok: true, id });
  } catch (error: any) {
    return json({ ok: false, error: error?.message ?? "unknown_error" }, { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
