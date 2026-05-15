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

interface D1Database {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
  };
}

/**
 * Fetches all disciples from Cloudflare D1.
 */
export async function getDisciples(db: unknown): Promise<Disciple[]> {
  const d1 = db as D1Database | undefined;
  
  if (!d1 || typeof d1.prepare !== 'function') {
    console.warn("D1 Database binding 'DB' not found or invalid. Falling back to empty array.");
    return [];
  }
  
  try {
    const { results } = await d1.prepare('SELECT * FROM disciples').all<Disciple>();
    return results;
  } catch (error) {
    console.error("Error fetching disciples from D1:", error);
    return [];
  }
}
