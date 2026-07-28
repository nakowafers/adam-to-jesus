import { Ancestor } from "@/lib/lineage-data";
import { LineageGraph, LineageRepository } from "../lineage-repository";
import { InMapperLineageAdapter } from "./in-memory-adapter";

interface D1Statement {
  bind(...args: unknown[]): D1Statement;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  first<T = unknown>(): Promise<T | null>;
}

interface D1DatabaseLike {
  prepare(query: string): D1Statement;
}

export class CloudflareD1LineageAdapter implements LineageRepository {
  private db: D1DatabaseLike | undefined;
  private fallbackAdapter: InMapperLineageAdapter;

  constructor(db: unknown, fallbackAdapter?: InMapperLineageAdapter) {
    this.db =
      db && typeof (db as D1DatabaseLike).prepare === "function"
        ? (db as D1DatabaseLike)
        : undefined;
    this.fallbackAdapter = fallbackAdapter || new InMapperLineageAdapter();
  }

  async getLineageGraph(): Promise<LineageGraph> {
    if (!this.db) {
      return this.fallbackAdapter.getLineageGraph();
    }

    try {
      const ancestors = await this.getAllAncestors();
      if (!ancestors || ancestors.length === 0) {
        return this.fallbackAdapter.getLineageGraph();
      }

      const mainLineage = ancestors.filter((a) => a.lineage === "main");
      const royalLine = ancestors.filter(
        (a) => a.lineage === "royal" && !a.id.startsWith("jesus")
      );
      const biologicalLine = ancestors.filter(
        (a) => a.lineage === "biological" && !a.id.startsWith("jesus")
      );
      const jesus = ancestors.find((a) => a.id.startsWith("jesus"));

      return {
        mainLineage,
        royalLine,
        biologicalLine,
        jesus,
      };
    } catch (error) {
      console.warn("CloudflareD1LineageAdapter.getLineageGraph error, falling back:", error);
      return this.fallbackAdapter.getLineageGraph();
    }
  }

  async getAncestorById(id: string): Promise<Ancestor | undefined> {
    if (!this.db) {
      return this.fallbackAdapter.getAncestorById(id);
    }

    try {
      const row = await this.db
        .prepare("SELECT * FROM ancestors WHERE id = ?")
        .bind(id)
        .first<Record<string, unknown>>();
      if (row) {
        return this.mapRowToAncestor(row);
      }
      const nodeRow = await this.db
        .prepare("SELECT * FROM nodes WHERE id = ?")
        .bind(id)
        .first<Record<string, unknown>>();
      if (nodeRow) {
        return this.mapRowToAncestor(nodeRow);
      }
      return this.fallbackAdapter.getAncestorById(id);
    } catch {
      return this.fallbackAdapter.getAncestorById(id);
    }
  }

  async getAllAncestors(): Promise<Ancestor[]> {
    if (!this.db) {
      return this.fallbackAdapter.getAllAncestors();
    }

    try {
      const res = await this.db
        .prepare("SELECT * FROM ancestors")
        .all<Record<string, unknown>>();
      if (res.results && res.results.length > 0) {
        return res.results.map((row) => this.mapRowToAncestor(row));
      }
      const nodeRes = await this.db
        .prepare("SELECT * FROM nodes")
        .all<Record<string, unknown>>();
      if (nodeRes.results && nodeRes.results.length > 0) {
        return nodeRes.results.map((row) => this.mapRowToAncestor(row));
      }
      return this.fallbackAdapter.getAllAncestors();
    } catch {
      return this.fallbackAdapter.getAllAncestors();
    }
  }

  private mapRowToAncestor(row: Record<string, unknown>): Ancestor {
    return {
      id: String(row.id || ""),
      name: String(row.name || ""),
      title: String(row.title || ""),
      summary: String(row.summary || row.description || ""),
      verse: String(row.verse || row.scripture_text || ""),
      verseReference: String(
        row.verseReference || row.verse_reference || row.scripture_reference || ""
      ),
      verseLink: String(row.verseLink || row.verse_link || ""),
      lineage: (row.lineage as Ancestor["lineage"]) || "main",
      generation: Number(row.generation || 0),
    };
  }
}
