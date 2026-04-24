CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  pathname TEXT NOT NULL,
  referrer_host TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  device_type TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  result_name TEXT NOT NULL DEFAULT '',
  question_index INTEGER,
  answer_index INTEGER,
  quiz_version TEXT NOT NULL DEFAULT '',
  is_hidden_result INTEGER NOT NULL DEFAULT 0,
  is_qa INTEGER NOT NULL DEFAULT 0,
  metadata TEXT,
  received_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_received_at
  ON analytics_events(received_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
  ON analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id
  ON analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_result_name
  ON analytics_events(result_name);

CREATE INDEX IF NOT EXISTS idx_analytics_events_is_qa_received_at
  ON analytics_events(is_qa, received_at);
