import { Ancestor, fullAncestors } from "@/lib/lineage-data";
import { LineageGraph, LineageRepository } from "../lineage-repository";

export class InMapperLineageAdapter implements LineageRepository {
  private ancestors: Ancestor[];

  constructor(ancestors: Ancestor[] = fullAncestors) {
    this.ancestors = ancestors;
  }

  async getLineageGraph(): Promise<LineageGraph> {
    const mainLineage = this.ancestors.filter((a) => a.lineage === "main");
    const royalLine = this.ancestors.filter(
      (a) => a.lineage === "royal" && !a.id.startsWith("jesus")
    );
    const biologicalLine = this.ancestors.filter(
      (a) => a.lineage === "biological" && !a.id.startsWith("jesus")
    );
    const jesus = this.ancestors.find((a) => a.id.startsWith("jesus"));

    return {
      mainLineage,
      royalLine,
      biologicalLine,
      jesus,
    };
  }

  async getAncestorById(id: string): Promise<Ancestor | undefined> {
    return this.ancestors.find((a) => a.id === id);
  }

  async getAllAncestors(): Promise<Ancestor[]> {
    return [...this.ancestors];
  }
}
