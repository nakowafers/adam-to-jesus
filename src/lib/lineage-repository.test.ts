import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { InMapperLineageAdapter } from "./adapters/in-memory-adapter";
import { CloudflareD1LineageAdapter } from "./adapters/d1-adapter";
import { createLineageRepository, lineageRepository } from "./lineage-repository";
import type { Ancestor } from "./lineage-data";

describe("LineageRepository & Adapters", () => {
  describe("InMapperLineageAdapter", () => {
    const adapter = new InMapperLineageAdapter();

    it("getLineageGraph returns properly partitioned graph", async () => {
      const graph = await adapter.getLineageGraph();

      assert.ok(graph.mainLineage);
      assert.ok(graph.mainLineage.length > 0);
      assert.strictEqual(graph.mainLineage[0].id, "adam");

      assert.ok(graph.royalLine);
      assert.ok(graph.royalLine.length > 0);
      assert.ok(graph.royalLine.some((a) => a.id === "solomon"));

      assert.ok(graph.biologicalLine);
      assert.ok(graph.biologicalLine.length > 0);
      assert.ok(graph.biologicalLine.some((a) => a.id === "nathan"));

      assert.ok(graph.jesus);
      assert.strictEqual(graph.jesus?.name, "Jesus");
    });

    it("getAncestorById returns target ancestor or undefined", async () => {
      const adam = await adapter.getAncestorById("adam");
      assert.ok(adam);
      assert.strictEqual(adam?.name, "Adam");

      const unknown = await adapter.getAncestorById("unknown_id");
      assert.strictEqual(unknown, undefined);
    });

    it("getAllAncestors returns complete array of ancestors", async () => {
      const all = await adapter.getAllAncestors();
      assert.ok(all.length > 50);
    });
  });

  describe("CloudflareD1LineageAdapter", () => {
    it("falls back to in-memory adapter when DB binding is null or invalid", async () => {
      const adapter = new CloudflareD1LineageAdapter(null);
      const graph = await adapter.getLineageGraph();
      assert.ok(graph.mainLineage.length > 0);

      const adam = await adapter.getAncestorById("adam");
      assert.strictEqual(adam?.name, "Adam");

      const all = await adapter.getAllAncestors();
      assert.ok(all.length > 0);
    });

    it("queries D1 database when binding is provided", async () => {
      const mockAncestor: Ancestor = {
        id: "adam",
        name: "Adam",
        title: "First Man",
        summary: "First human.",
        verse: "Created",
        verseReference: "Gen 2:7",
        verseLink: "",
        lineage: "main",
        generation: 1,
      };

      const mockDb = {
        prepare: (sql: string) => {
          return {
            bind: (..._args: unknown[]) => ({
              first: async <T>() =>
                sql.includes("WHERE id = ?") ? (mockAncestor as unknown as T) : null,
            }),
            all: async <T>() => ({ results: [mockAncestor as unknown as T] }),
            first: async <T>() => mockAncestor as unknown as T,
          };
        },
      };

      const adapter = new CloudflareD1LineageAdapter(mockDb);

      const adam = await adapter.getAncestorById("adam");
      assert.strictEqual(adam?.name, "Adam");

      const all = await adapter.getAllAncestors();
      assert.strictEqual(all.length, 1);
      assert.strictEqual(all[0].id, "adam");

      const graph = await adapter.getLineageGraph();
      assert.strictEqual(graph.mainLineage.length, 1);
      assert.strictEqual(graph.mainLineage[0].id, "adam");
    });
  });

  describe("createLineageRepository factory", () => {
    it("returns InMapperLineageAdapter by default", () => {
      const repo = createLineageRepository();
      assert.ok(repo instanceof InMapperLineageAdapter);
    });

    it("returns CloudflareD1LineageAdapter when env.DB is present", () => {
      const mockDb = { prepare: () => ({}) };
      const repo = createLineageRepository({ DB: mockDb });
      assert.ok(repo instanceof CloudflareD1LineageAdapter);
    });

    it("default exported instance is resolved", async () => {
      assert.ok(lineageRepository);
      const graph = await lineageRepository.getLineageGraph();
      assert.ok(graph.mainLineage.length > 0);
    });
  });
});
