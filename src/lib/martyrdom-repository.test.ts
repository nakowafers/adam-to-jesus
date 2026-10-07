import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  InMapperMartyrdomAdapter,
  CloudflareD1MartyrdomAdapter,
  createMartyrdomRepository,
} from "./disciples";
import { DISCIPLES_DATA } from "./disciples-data";

describe("MartyrdomRepository", () => {
  describe("InMapperMartyrdomAdapter", () => {
    const adapter = new InMapperMartyrdomAdapter();

    it("returns all 12 historical apostles", async () => {
      const disciples = await adapter.getAllDisciples();
      assert.equal(disciples.length, 12);
      assert.ok(disciples.some((d) => d.id === "peter"));
      assert.ok(disciples.some((d) => d.id === "john"));
      assert.ok(disciples.some((d) => d.id === "matthias"));
    });

    it("retrieves a disciple by id", async () => {
      const peter = await adapter.getDiscipleById("peter");
      assert.ok(peter);
      assert.equal(peter?.name, "Simon Peter");
      assert.equal(peter?.method_of_death, "Crucifixion (Upside Down)");
    });

    it("returns undefined for unknown disciple id", async () => {
      const unknown = await adapter.getDiscipleById("non-existent");
      assert.equal(unknown, undefined);
    });
  });

  describe("CloudflareD1MartyrdomAdapter", () => {
    it("falls back to in-memory adapter when db is undefined or invalid", async () => {
      const adapter = new CloudflareD1MartyrdomAdapter(null);
      const disciples = await adapter.getAllDisciples();
      assert.equal(disciples.length, 12);
    });

    it("queries D1 database when binding is provided", async () => {
      const fakeD1 = {
        prepare: (query: string) => ({
          all: async () => ({ results: DISCIPLES_DATA.slice(0, 3) }),
          bind: () => ({
            first: async () => DISCIPLES_DATA[0],
          }),
        }),
      };

      const adapter = new CloudflareD1MartyrdomAdapter(fakeD1);
      const results = await adapter.getAllDisciples();
      assert.equal(results.length, 3);

      const peter = await adapter.getDiscipleById("peter");
      assert.equal(peter?.name, "Simon Peter");
    });
  });

  describe("createMartyrdomRepository factory", () => {
    it("creates InMapperMartyrdomAdapter when no db provided", async () => {
      const repo = createMartyrdomRepository();
      assert.ok(repo instanceof InMapperMartyrdomAdapter);
      const disciples = await repo.getAllDisciples();
      assert.equal(disciples.length, 12);
    });

    it("creates CloudflareD1MartyrdomAdapter when db provided", () => {
      const fakeD1 = {
        prepare: () => ({ all: async () => ({ results: [] }) }),
      };
      const repo = createMartyrdomRepository(fakeD1);
      assert.ok(repo instanceof CloudflareD1MartyrdomAdapter);
    });
  });
});
