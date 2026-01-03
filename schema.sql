-- Content table for storing church content
CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL, -- 'service', 'event', 'announcement', 'about', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT, -- JSON string for additional data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Photos table for storing photo metadata
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  category TEXT NOT NULL, -- 'services', 'events', 'leadership', etc.
  original_name TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_updated ON content(updated_at);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);