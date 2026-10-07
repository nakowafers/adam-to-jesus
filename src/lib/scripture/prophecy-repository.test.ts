import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  InMapperProphecyAdapter,
  prophecyRepository,
} from "./prophecy-repository";

describe("ProphecyRepository", () => {
  describe("InMapperProphecyAdapter", () => {
    const adapter = new InMapperProphecyAdapter();

    it("retrieves all 20 messianic prophecies", async () => {
      const prophecies = await adapter.getAllProphecies();
      assert.equal(prophecies.length, 20);
      assert.ok(prophecies.some((p) => p.id === "protoevangelium"));
      assert.ok(prophecies.some((p) => p.id === "virgin-birth"));
      assert.ok(prophecies.some((p) => p.id === "ascension-exaltation"));
    });

    it("filters prophecies by theme correctly", async () => {
      const passionProphecies = await adapter.getPropheciesByTheme("Passion & Crucifixion");
      assert.equal(passionProphecies.length, 7);
      assert.ok(passionProphecies.every((p) => p.theme === "Passion & Crucifixion"));

      const identityProphecies = await adapter.getPropheciesByTheme("Identity & Lineage");
      assert.equal(identityProphecies.length, 3);
      assert.ok(identityProphecies.every((p) => p.theme === "Identity & Lineage"));

      const birthProphecies = await adapter.getPropheciesByTheme("Birth & Infancy");
      assert.equal(birthProphecies.length, 3);

      const ministryProphecies = await adapter.getPropheciesByTheme("Ministry & Mission");
      assert.equal(ministryProphecies.length, 5);

      const victoryProphecies = await adapter.getPropheciesByTheme("Resurrection & Victory");
      assert.equal(victoryProphecies.length, 2);
    });

    it("returns all 20 prophecies when theme is 'All Themes' or empty", async () => {
      const allByTheme = await adapter.getPropheciesByTheme("All Themes");
      assert.equal(allByTheme.length, 20);

      const allByEmpty = await adapter.getPropheciesByTheme("");
      assert.equal(allByEmpty.length, 20);
    });

    it("retrieves a prophecy by id for existing id", async () => {
      const prophecy = await adapter.getProphecyById("virgin-birth");
      assert.ok(prophecy);
      assert.equal(prophecy?.id, "virgin-birth");
      assert.equal(prophecy?.prophecyTitle, "Born of a Virgin Named Immanuel (God With Us)");
      assert.equal(prophecy?.otReference, "Isaiah 7:14 (ESV)");
      assert.equal(prophecy?.ntReference, "Matthew 1:22–23 (ESV)");
    });

    it("returns undefined for unknown prophecy id", async () => {
      const unknown = await adapter.getProphecyById("unknown-id-12345");
      assert.equal(unknown, undefined);
    });
  });

  describe("prophecyRepository singleton", () => {
    it("exports default singleton resolving prophecies", async () => {
      const prophecies = await prophecyRepository.getAllProphecies();
      assert.equal(prophecies.length, 20);
    });
  });
});
