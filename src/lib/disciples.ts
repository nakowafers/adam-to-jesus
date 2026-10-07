import { DISCIPLES_DATA } from "./disciples-data";

export interface Disciple {
  id: string;
  name: string;
  symbol: string;
  location_of_death: string;
  year_of_death: string;
  method_of_death: string;
  narrative: string;
  reliability_score: number;
  certainty_level: string;
  scripture_reference: string;
  sources: string; // JSON string
}

export interface MartyrdomRepository {
  getAllDisciples(): Promise<Disciple[]>;
  getDiscipleById(id: string): Promise<Disciple | undefined>;
}

interface D1Database {
  prepare: (query: string) => {
    bind?: (...args: unknown[]) => {
      all: <T = unknown>() => Promise<{ results: T[] }>;
      first: <T = unknown>() => Promise<T | null>;
    };
    all: <T = unknown>() => Promise<{ results: T[] }>;
    first: <T = unknown>() => Promise<T | null>;
  };
}

export class InMapperMartyrdomAdapter implements MartyrdomRepository {
  private disciples: Disciple[];

  constructor(disciples: Disciple[] = DISCIPLES_DATA) {
    this.disciples = disciples;
  }

  async getAllDisciples(): Promise<Disciple[]> {
    return [...this.disciples];
  }

  async getDiscipleById(id: string): Promise<Disciple | undefined> {
    return this.disciples.find((d) => d.id === id);
  }
}

export class CloudflareD1MartyrdomAdapter implements MartyrdomRepository {
  private db: D1Database | undefined;
  private fallback: InMapperMartyrdomAdapter;

  constructor(db: unknown, fallback?: InMapperMartyrdomAdapter) {
    this.db =
      db && typeof (db as D1Database).prepare === "function"
        ? (db as D1Database)
        : undefined;
    this.fallback = fallback || new InMapperMartyrdomAdapter();
  }

  async getAllDisciples(): Promise<Disciple[]> {
    if (!this.db) {
      return this.fallback.getAllDisciples();
    }

    try {
      const { results } = await this.db.prepare("SELECT * FROM disciples").all<Disciple>();
      if (results && results.length > 0) {
        return results;
      }
      return this.fallback.getAllDisciples();
    } catch (error) {
      console.warn("CloudflareD1MartyrdomAdapter.getAllDisciples error, falling back:", error);
      return this.fallback.getAllDisciples();
    }
  }

  async getDiscipleById(id: string): Promise<Disciple | undefined> {
    if (!this.db) {
      return this.fallback.getDiscipleById(id);
    }

    try {
      const stmt = this.db.prepare("SELECT * FROM disciples WHERE id = ?");
      const bound = stmt.bind ? stmt.bind(id) : stmt;
      const res = await bound.first<Disciple>();
      if (res) {
        return res;
      }
      return this.fallback.getDiscipleById(id);
    } catch (error) {
      console.warn("CloudflareD1MartyrdomAdapter.getDiscipleById error, falling back:", error);
      return this.fallback.getDiscipleById(id);
    }
  }
}

export function createMartyrdomRepository(db?: unknown): MartyrdomRepository {
  if (db && typeof (db as D1Database).prepare === "function") {
    return new CloudflareD1MartyrdomAdapter(db);
  }
  return new InMapperMartyrdomAdapter();
}

/**
 * Backward compatibility helper
 */
export async function getDisciples(db: unknown): Promise<Disciple[]> {
  const repo = createMartyrdomRepository(db);
  return repo.getAllDisciples();
}
