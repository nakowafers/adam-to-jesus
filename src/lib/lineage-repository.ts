import { Ancestor } from "@/lib/lineage-data";
import { InMapperLineageAdapter } from "./adapters/in-memory-adapter";
import { CloudflareD1LineageAdapter } from "./adapters/d1-adapter";

export interface LineageGraph {
  mainLineage: Ancestor[];
  royalLine: Ancestor[];
  biologicalLine: Ancestor[];
  jesus?: Ancestor;
}

export interface LineageRepository {
  getLineageGraph(): Promise<LineageGraph>;
  getAncestorById(id: string): Promise<Ancestor | undefined>;
  getAllAncestors(): Promise<Ancestor[]>;
}

export interface CloudflareEnv {
  DB?: unknown;
}

export function createLineageRepository(env?: CloudflareEnv): LineageRepository {
  if (env?.DB) {
    return new CloudflareD1LineageAdapter(env.DB);
  }
  return new InMapperLineageAdapter();
}

export const lineageRepository = createLineageRepository();
