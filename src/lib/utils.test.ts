import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cn } from "./utils";

describe("cn utility", () => {
  it("cn merges classes correctly", () => {
    assert.strictEqual(cn("a", "b"), "a b");
  });

  it("cn handles conditional classes", () => {
    assert.strictEqual(cn("a", true && "b", false && "c"), "a b");
  });

  it("cn merges tailwind classes correctly", () => {
    assert.strictEqual(cn("px-2 py-2", "p-4"), "p-4");
  });

  it("cn handles objects and arrays", () => {
    assert.strictEqual(cn(["a", "b"], { c: true, d: false }), "a b c");
  });

  it("cn handles undefined and null", () => {
    assert.strictEqual(cn("a", undefined, null, "b"), "a b");
  });
});
