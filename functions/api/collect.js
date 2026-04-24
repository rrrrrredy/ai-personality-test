const EVENT_TYPES = new Set([
  'page_view',
  'quiz_start',
  'question_answered',
  'quiz_complete',
  'share_copy',
  'quiz_retry',
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store',
    },
  });
}

function clampString(value, maxLength = 120) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function parseFlag(value) {
  return value ? 1 : 0;
}

function parseIndex(value, max) {
  const num = Number(value);
  if (!Number.isInteger(num)) return null;
  if (num < 0 || num > max) return null;
  return num;
}

function parseIdentifier(value) {
  const id = clampString(value, 96);
  return /^[a-zA-Z0-9_-]{8,96}$/.test(id) ? id : '';
}

function sanitizePath(value) {
  const pathname = clampString(value, 240);
  if (!pathname) return '/';
  return pathname.startsWith('/') ? pathname : '/';
}

function normalizeMetadata(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  try {
    const raw = JSON.stringify(value);
    return raw.length <= 4000 ? raw : raw.slice(0, 4000);
  } catch {
    return null;
  }
}

function detectDeviceType(request, payloadDeviceType) {
  const allowed = new Set(['mobile', 'tablet', 'desktop']);
  if (allowed.has(payloadDeviceType)) return payloadDeviceType;

  const userAgent = request.headers.get('user-agent') || '';
  if (/ipad|tablet/i.test(userAgent)) return 'tablet';
  if (/mobi|iphone|android/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function getReferrerHost(request, payloadReferrer) {
  const input = clampString(payloadReferrer, 400) || clampString(request.headers.get('referer') || '', 400);
  if (!input) return '';

  try {
    return new URL(input).host.slice(0, 200);
  } catch {
    return input.slice(0, 200);
  }
}

export async function onRequestPost(context) {
  const db = context.env.ANALYTICS_DB;
  if (!db) {
    return json({ ok: false, error: 'Missing ANALYTICS_DB binding.' }, 500);
  }

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON payload.' }, 400);
  }

  const eventType = clampString(payload.event_type, 40);
  const visitorId = parseIdentifier(payload.visitor_id);
  const sessionId = parseIdentifier(payload.session_id);

  if (!EVENT_TYPES.has(eventType)) {
    return json({ ok: false, error: 'Invalid event_type.' }, 400);
  }

  if (!visitorId || !sessionId) {
    return json({ ok: false, error: 'Missing visitor_id or session_id.' }, 400);
  }

  const pathname = sanitizePath(payload.pathname);
  const referrerHost = getReferrerHost(context.request, payload.referrer);
  const utmSource = clampString(payload.utm_source, 80);
  const utmMedium = clampString(payload.utm_medium, 80);
  const utmCampaign = clampString(payload.utm_campaign, 120);
  const resultName = clampString(payload.result_name, 120);
  const quizVersion = clampString(payload.quiz_version, 32);
  const questionIndex = parseIndex(payload.question_index, 99);
  const answerIndex = parseIndex(payload.answer_index, 9);
  const metadata = normalizeMetadata(payload.metadata);
  const deviceType = detectDeviceType(context.request, clampString(payload.device_type, 20));
  const country = clampString(context.request.cf?.country || '', 16);
  const isHiddenResult = parseFlag(payload.is_hidden_result);
  const isQa = parseFlag(payload.is_qa);

  try {
    await db
      .prepare(
        `INSERT INTO analytics_events (
          event_type,
          visitor_id,
          session_id,
          pathname,
          referrer_host,
          utm_source,
          utm_medium,
          utm_campaign,
          device_type,
          country,
          result_name,
          question_index,
          answer_index,
          quiz_version,
          is_hidden_result,
          is_qa,
          metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        eventType,
        visitorId,
        sessionId,
        pathname,
        referrerHost,
        utmSource,
        utmMedium,
        utmCampaign,
        deviceType,
        country,
        resultName,
        questionIndex,
        answerIndex,
        quizVersion,
        isHiddenResult,
        isQa,
        metadata
      )
      .run();

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: 'Failed to persist analytics event.' }, 500);
  }
}

export async function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}
