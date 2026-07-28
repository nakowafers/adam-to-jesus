import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

let mockSearchParams = new URLSearchParams();
let mockPathname = "/lineage";
let mockRouter = {
  push: (_url: string, _opts?: { scroll?: boolean }) => {},
  replace: (_url: string, _opts?: { scroll?: boolean }) => {},
};

// Intercept require.cache for next/navigation before importing use-entity-selection
const navPath = require.resolve("next/navigation");
require.cache[navPath] = {
  id: navPath,
  filename: navPath,
  loaded: true,
  exports: {
    useSearchParams: () => mockSearchParams,
    usePathname: () => mockPathname,
    useRouter: () => mockRouter,
  },
} as any;

const { useEntitySelection } = require("./use-entity-selection");

interface TestEntity {
  id: string;
  name: string;
}

const mockEntities: TestEntity[] = [
  { id: "adam", name: "Adam" },
  { id: "david", name: "David" },
  { id: "jesus", name: "Jesus" },
];

describe("useEntitySelection hook", () => {
  it("resolves selectedId and selectedEntity from search params (deep linking)", () => {
    mockSearchParams = new URLSearchParams("ancestor=david");
    mockPathname = "/lineage";

    let capturedResult: any = null;

    function TestComponent() {
      capturedResult = useEntitySelection("ancestor", mockEntities);
      return null;
    }

    renderToStaticMarkup(React.createElement(TestComponent));

    assert.strictEqual(capturedResult?.selectedId, "david");
    assert.deepStrictEqual(capturedResult?.selectedEntity, {
      id: "david",
      name: "David",
    });
  });

  it("returns null selectedId and selectedEntity when search param is missing", () => {
    mockSearchParams = new URLSearchParams("");
    mockPathname = "/lineage";

    let capturedResult: any = null;

    function TestComponent() {
      capturedResult = useEntitySelection("ancestor", mockEntities);
      return null;
    }

    renderToStaticMarkup(React.createElement(TestComponent));

    assert.strictEqual(capturedResult?.selectedId, null);
    assert.strictEqual(capturedResult?.selectedEntity, null);
  });

  it("returns null selectedEntity when search param id is not found in entities", () => {
    mockSearchParams = new URLSearchParams("ancestor=unknown_id");
    mockPathname = "/lineage";

    let capturedResult: any = null;

    function TestComponent() {
      capturedResult = useEntitySelection("ancestor", mockEntities);
      return null;
    }

    renderToStaticMarkup(React.createElement(TestComponent));

    assert.strictEqual(capturedResult?.selectedId, "unknown_id");
    assert.strictEqual(capturedResult?.selectedEntity, null);
  });

  it("calls router.push with newUrl and scroll: false when param does not exist", () => {
    mockSearchParams = new URLSearchParams("");
    mockPathname = "/lineage";

    let capturedResult: any = null;
    let pushCalledWith: [string, { scroll: boolean }] | null = null;

    mockRouter = {
      push: (url: string, opts?: { scroll?: boolean }) => {
        pushCalledWith = [url, opts as { scroll: boolean }];
      },
      replace: () => {},
    };

    function TestComponent() {
      capturedResult = useEntitySelection("ancestor", mockEntities);
      return null;
    }

    renderToStaticMarkup(React.createElement(TestComponent));

    capturedResult?.selectEntity("david");

    assert.deepStrictEqual(pushCalledWith, [
      "/lineage?ancestor=david",
      { scroll: false },
    ]);
  });

  it("calls router.push with newUrl and scroll: false when param already exists", () => {
    mockSearchParams = new URLSearchParams("ancestor=david");
    mockPathname = "/lineage";

    let capturedResult: any = null;
    let pushCalledWith: [string, { scroll: boolean }] | null = null;

    mockRouter = {
      push: (url: string, opts?: { scroll?: boolean }) => {
        pushCalledWith = [url, opts as { scroll: boolean }];
      },
      replace: () => {},
    };

    function TestComponent() {
      capturedResult = useEntitySelection("ancestor", mockEntities);
      return null;
    }

    renderToStaticMarkup(React.createElement(TestComponent));

    capturedResult?.selectEntity("abraham");

    assert.deepStrictEqual(pushCalledWith, [
      "/lineage?ancestor=abraham",
      { scroll: false },
    ]);
  });

  it("removes paramKey when clearSelection is called", () => {
    mockSearchParams = new URLSearchParams("ancestor=david&foo=bar");
    mockPathname = "/lineage";

    let capturedResult: any = null;
    let pushCalledWith: [string, { scroll: boolean }] | null = null;

    mockRouter = {
      push: (url: string, opts?: { scroll?: boolean }) => {
        pushCalledWith = [url, opts as { scroll: boolean }];
      },
      replace: () => {},
    };

    function TestComponent() {
      capturedResult = useEntitySelection("ancestor", mockEntities);
      return null;
    }

    renderToStaticMarkup(React.createElement(TestComponent));

    capturedResult?.clearSelection();

    assert.deepStrictEqual(pushCalledWith, [
      "/lineage?foo=bar",
      { scroll: false },
    ]);
  });
});
