import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'lineage.db');
const db = new Database(dbPath);

export interface DBNode {
  id: string;
  name: string;
  title: string;
  description: string;
  scripture_reference: string;
  scripture_text: string;
  lineage: 'royal' | 'biological';
  epoch: string;
  x: number;
  y: number;
}

export interface DBEdge {
  id: string;
  source: string;
  target: string;
}

export function getLineageData() {
  const nodes = db.prepare('SELECT * FROM nodes').all() as DBNode[];
  const edges = db.prepare('SELECT * FROM edges').all() as DBEdge[];
  return { nodes, edges };
}
