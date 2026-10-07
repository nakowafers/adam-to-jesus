import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeBookCode,
  getBookMetadata,
  normalizePassageKey,
} from "./book-normalizer";
import { EdgeBibleAdapter, STATIC_INITIAL_BIBLE_DATA } from "./scripture-repository";

describe("BookCodeNormalizer", () => {
  it("normalizes variations of John to JHN", () => {
    assert.equal(normalizeBookCode("John"), "JHN");
    assert.equal(normalizeBookCode("john"), "JHN");
    assert.equal(normalizeBookCode("JHN"), "JHN");
    assert.equal(normalizeBookCode("Jn"), "JHN");
  });

  it("normalizes Genesis and Isaiah correctly", () => {
    assert.equal(normalizeBookCode("Genesis"), "GEN");
    assert.equal(normalizeBookCode("GEN"), "GEN");
    assert.equal(normalizeBookCode("Isaiah"), "ISA");
    assert.equal(normalizeBookCode("ISA"), "ISA");
  });

  it("resolves canonical book metadata", () => {
    const jhn = getBookMetadata("John");
    assert.equal(jhn.id, "JHN");
    assert.equal(jhn.name, "John");

    const isa = getBookMetadata("isa");
    assert.equal(isa.id, "ISA");
    assert.equal(isa.name, "Isaiah");
  });

  it("normalizes dot notation passage keys", () => {
    assert.equal(normalizePassageKey("John.3"), "JHN.3");
    assert.equal(normalizePassageKey("ISAIAH.6"), "ISA.6");
    assert.equal(normalizePassageKey("GENESIS.1"), "GEN.1");
  });
});

describe("ScriptureRepository (EdgeBibleAdapter)", () => {
  const adapter = new EdgeBibleAdapter();

  it("returns instant offline passage for ISA.6 without network", async () => {
    const passage = await adapter.getPassage({
      book: "ISA",
      chapter: 6,
      translation: "ESV",
    });

    assert.equal(passage.passageKey, "ISA.6");
    assert.equal(passage.book, "Isaiah");
    assert.equal(passage.translation, "ESV");
    assert.ok(passage.verses.length >= 13);
    assert.equal(passage.verses[0].verse, 1);
  });

  it("returns instant offline passage for JHN.3 with red-letter markup", async () => {
    const passage = await adapter.getPassage({
      book: "John",
      chapter: 3,
      translation: "ESV",
    });

    assert.equal(passage.passageKey, "JHN.3");
    assert.equal(passage.bookId, "JHN");
    assert.ok(passage.verses.some((v) => v.text.includes("<red>")));
  });

  it("synthesizes structured offline fallback for chapters outside the cache", async () => {
    const passage = await adapter.getPassage({
      book: "ROM",
      chapter: 8,
      translation: "ESV",
    });

    assert.equal(passage.passageKey, "ROM.8");
    assert.equal(passage.book, "Romans");
    assert.ok(passage.verses.length > 0);
    assert.equal(passage.verses[0].verse, 1);
  });
});
