const RANGES = {
  '24h': { label: '24h', seconds: 24 * 60 * 60 },
  '7d': { label: '7d', seconds: 7 * 24 * 60 * 60 },
  '30d': { label: '30d', seconds: 30 * 24 * 60 * 60 },
  '90d': { label: '90d', seconds: 90 * 24 * 60 * 60 },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store',
    },
  });
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function getRange(searchParams) {
  const requested = searchParams.get('range') || '7d';
  return RANGES[requested] || RANGES['7d'];
}

function getAuthToken(request) {
  const url = new URL(request.url);
  return (request.headers.get('x-admin-token') || url.searchParams.get('token') || '').trim();
}

async function queryScalar(db, sql, bindings) {
  const row = await db.prepare(sql).bind(...bindings).first();
  if (!row) return 0;
  const firstValue = Object.values(row)[0];
  return toNumber(firstValue);
}

async function queryRows(db, sql, bindings) {
  const result = await db.prepare(sql).bind(...bindings).all();
  return result.results || [];
}

export async function onRequestGet(context) {
  const db = context.env.ANALYTICS_DB;

  if (!db) {
    return json({ ok: false, error: 'Missing ANALYTICS_DB binding.' }, 500);
  }

  const range = getRange(new URL(context.request.url).searchParams);
  const now = Math.floor(Date.now() / 1000);
  const since = now - range.seconds;

  try {
    const pageViews = await queryScalar(
      db,
      `SELECT COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'page_view' AND received_at >= ? AND is_qa = 0`,
      [since]
    );

    const uniqueVisitors = await queryScalar(
      db,
      `SELECT COUNT(DISTINCT visitor_id) AS total
       FROM analytics_events
       WHERE event_type = 'page_view' AND received_at >= ? AND is_qa = 0`,
      [since]
    );

    const quizStarts = await queryScalar(
      db,
      `SELECT COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'quiz_start' AND received_at >= ? AND is_qa = 0`,
      [since]
    );

    const startedSessions = await queryScalar(
      db,
      `SELECT COUNT(DISTINCT session_id) AS total
       FROM analytics_events
       WHERE event_type = 'quiz_start' AND received_at >= ? AND is_qa = 0`,
      [since]
    );

    const completions = await queryScalar(
      db,
      `SELECT COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'quiz_complete' AND received_at >= ? AND is_qa = 0`,
      [since]
    );

    const completedSessions = await queryScalar(
      db,
      `SELECT COUNT(DISTINCT session_id) AS total
       FROM analytics_events
       WHERE event_type = 'quiz_complete' AND received_at >= ? AND is_qa = 0`,
      [since]
    );

    const shares = await queryScalar(
      db,
      `SELECT COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'share_copy' AND received_at >= ? AND is_qa = 0`,
      [since]
    );

    const answersLogged = await queryScalar(
      db,
      `SELECT COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'question_answered' AND received_at >= ? AND is_qa = 0`,
      [since]
    );

    const trends = await queryRows(
      db,
      `SELECT
          strftime('%Y-%m-%d', received_at, 'unixepoch') AS day,
          SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS page_views,
          SUM(CASE WHEN event_type = 'quiz_start' THEN 1 ELSE 0 END) AS quiz_starts,
          SUM(CASE WHEN event_type = 'quiz_complete' THEN 1 ELSE 0 END) AS completions,
          SUM(CASE WHEN event_type = 'share_copy' THEN 1 ELSE 0 END) AS shares
       FROM analytics_events
       WHERE received_at >= ?
         AND is_qa = 0
         AND event_type IN ('page_view', 'quiz_start', 'quiz_complete', 'share_copy')
       GROUP BY day
       ORDER BY day ASC`,
      [since]
    );

    const results = await queryRows(
      db,
      `SELECT
          CASE WHEN result_name != '' THEN result_name ELSE '未知结果' END AS label,
          COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'quiz_complete' AND received_at >= ? AND is_qa = 0
       GROUP BY label
       ORDER BY total DESC
       LIMIT 12`,
      [since]
    );

    const devices = await queryRows(
      db,
      `SELECT
          CASE WHEN device_type != '' THEN device_type ELSE 'unknown' END AS label,
          COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'page_view' AND received_at >= ? AND is_qa = 0
       GROUP BY label
       ORDER BY total DESC`,
      [since]
    );

    const sources = await queryRows(
      db,
      `SELECT
          CASE
            WHEN utm_source != '' THEN utm_source
            WHEN referrer_host != '' THEN referrer_host
            ELSE 'direct'
          END AS label,
          COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'page_view' AND received_at >= ? AND is_qa = 0
       GROUP BY label
       ORDER BY total DESC
       LIMIT 8`,
      [since]
    );

    const questionProgress = await queryRows(
      db,
      `SELECT
          question_index,
          COUNT(*) AS total
       FROM analytics_events
       WHERE event_type = 'question_answered'
         AND received_at >= ?
         AND is_qa = 0
         AND question_index IS NOT NULL
       GROUP BY question_index
       ORDER BY question_index ASC`,
      [since]
    );

    const recentCompletions = await queryRows(
      db,
      `SELECT
          CASE WHEN result_name != '' THEN result_name ELSE '未知结果' END AS result_name,
          CASE WHEN country != '' THEN country ELSE '--' END AS country,
          CASE WHEN device_type != '' THEN device_type ELSE 'unknown' END AS device_type,
          CASE
            WHEN utm_source != '' THEN utm_source
            WHEN referrer_host != '' THEN referrer_host
            ELSE 'direct'
          END AS source,
          received_at
       FROM analytics_events
       WHERE event_type = 'quiz_complete' AND received_at >= ? AND is_qa = 0
       ORDER BY received_at DESC
       LIMIT 20`,
      [since]
    );

    return json({
      ok: true,
      range: {
        label: range.label,
        since,
        now,
      },
      kpis: {
        pageViews,
        uniqueVisitors,
        quizStarts,
        completions,
        shares,
        answersLogged,
        completionRate: startedSessions ? Number(((completedSessions / startedSessions) * 100).toFixed(1)) : 0,
        shareRate: completions ? Number(((shares / completions) * 100).toFixed(1)) : 0,
      },
      trends: trends.map((row) => ({
        day: row.day,
        pageViews: toNumber(row.page_views),
        quizStarts: toNumber(row.quiz_starts),
        completions: toNumber(row.completions),
        shares: toNumber(row.shares),
      })),
      results: results.map((row) => ({
        label: row.label,
        total: toNumber(row.total),
      })),
      devices: devices.map((row) => ({
        label: row.label,
        total: toNumber(row.total),
      })),
      sources: sources.map((row) => ({
        label: row.label,
        total: toNumber(row.total),
      })),
      questionProgress: questionProgress.map((row) => ({
        question: toNumber(row.question_index) + 1,
        total: toNumber(row.total),
      })),
      recentCompletions: recentCompletions.map((row) => ({
        resultName: row.result_name,
        country: row.country,
        deviceType: row.device_type,
        source: row.source,
        receivedAt: toNumber(row.received_at),
      })),
    });
  } catch (error) {
    return json({ ok: false, error: 'Failed to query analytics data.' }, 500);
  }
}

export async function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}
