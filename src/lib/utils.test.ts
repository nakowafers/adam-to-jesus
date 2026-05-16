import { expect, test } from "bun:test";
import { cn } from "./utils";

test("cn merges classes correctly", () => {
  expect(cn("a", "b")).toBe("a b");
});

test("cn handles conditional classes", () => {
  expect(cn("a", true && "b", false && "c")).toBe("a b");
});

test("cn merges tailwind classes correctly", () => {
  expect(cn("px-2 py-2", "p-4")).toBe("p-4");
});

test("cn handles objects and arrays", () => {
  expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
});

test("cn handles undefined and null", () => {
  expect(cn("a", undefined, null, "b")).toBe("a b");
});
