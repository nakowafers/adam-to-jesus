const Database = require('better-sqlite3');
const db = new Database('lineage.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    description TEXT,
    scripture_reference TEXT,
    scripture_text TEXT,
    lineage TEXT NOT NULL, -- 'royal' or 'biological'
    epoch TEXT,
    x REAL,
    y REAL
  );

  CREATE TABLE IF NOT EXISTS edges (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    FOREIGN KEY (source) REFERENCES nodes (id),
    FOREIGN KEY (target) REFERENCES nodes (id)
  );
`);

db.close();
