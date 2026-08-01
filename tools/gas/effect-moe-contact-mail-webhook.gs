const DEFAULT_FROM_NAME = "株式会社EFFECT";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const expectedToken = PropertiesService.getScriptProperties().getProperty("GAS_GMAIL_TOKEN");

    if (expectedToken && payload.token !== expectedToken) {
      return jsonResponse({ ok: false, error: "unauthorized" }, 401);
    }

    if (payload.action !== "send_gmail") {
      return jsonResponse({ ok: false, error: "invalid_action" }, 400);
    }

    const to = String(payload.to || "").trim();
    const subject = String(payload.subject || "").trim();
    const body = String(payload.body || "").trim();
    const htmlBody = String(payload.html_body || "").trim();
    const fromName = String(payload.from_name || DEFAULT_FROM_NAME).trim();

    if (!to || !subject || !body) {
      return jsonResponse({ ok: false, error: "required_fields_missing" }, 400);
    }

    GmailApp.sendEmail(to, subject, body, {
      name: fromName,
      htmlBody: htmlBody || undefined,
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) }, 500);
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
