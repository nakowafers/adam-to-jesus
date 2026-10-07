import { MESSIANIC_PROPHECIES, ProphecyItem } from "./prophecies-data";

export interface ProphecyRepository {
  getAllProphecies(): Promise<ProphecyItem[]>;
  getPropheciesByTheme(theme: string): Promise<ProphecyItem[]>;
  getProphecyById(id: string): Promise<ProphecyItem | undefined>;
}

export class InMapperProphecyAdapter implements ProphecyRepository {
  private prophecies: ProphecyItem[];

  constructor(prophecies: ProphecyItem[] = MESSIANIC_PROPHECIES) {
    this.prophecies = prophecies;
  }

  async getAllProphecies(): Promise<ProphecyItem[]> {
    return [...this.prophecies];
  }

  async getPropheciesByTheme(theme: string): Promise<ProphecyItem[]> {
    if (!theme || theme === "All Themes") {
      return [...this.prophecies];
    }
    return this.prophecies.filter((p) => p.theme === theme);
  }

  async getProphecyById(id: string): Promise<ProphecyItem | undefined> {
    return this.prophecies.find((p) => p.id === id);
  }
}

export interface CloudflareEnv {
  DB?: unknown;
}

export function createProphecyRepository(_env?: CloudflareEnv): ProphecyRepository {
  return new InMapperProphecyAdapter();
}

export const prophecyRepository: ProphecyRepository = createProphecyRepository();
