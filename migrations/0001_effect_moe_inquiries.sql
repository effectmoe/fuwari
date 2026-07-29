CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  inquiry_type TEXT NOT NULL,
  company TEXT NOT NULL,
  department TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT NOT NULL,
  data_location TEXT NOT NULL,
  message TEXT NOT NULL,
  page_path TEXT,
  page_url TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  user_agent TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries(status);
CREATE INDEX IF NOT EXISTS inquiries_inquiry_type_idx ON inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON inquiries(email);
