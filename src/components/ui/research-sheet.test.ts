import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResearchSheet, useResearchSheet } from "./research-sheet";

describe("ResearchSheet Primitive Component", () => {
  it("exports compound primitive structure (Header, Body, Footer)", () => {
    assert.strictEqual(typeof ResearchSheet, "function");
    assert.strictEqual(typeof ResearchSheet.Header, "function");
    assert.strictEqual(typeof ResearchSheet.Body, "function");
    assert.strictEqual(typeof ResearchSheet.Footer, "function");
  });

  it("renders backdrop, container dialog, and slots when isOpen is true", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        ResearchSheet,
        {
          isOpen: true,
          onClose: () => {},
          ariaLabelledBy: "test-sheet-title",
          className: "custom-sheet-class",
        },
        React.createElement(
          ResearchSheet.Header,
          null,
          React.createElement("h2", { id: "test-sheet-title" }, "Research Title")
        ),
        React.createElement(
          ResearchSheet.Body,
          null,
          React.createElement("p", null, "Research Body Content")
        ),
        React.createElement(
          ResearchSheet.Footer,
          null,
          React.createElement("button", null, "Export Action")
        )
      )
    );

    // Verify accessibility & structure attributes
    assert.match(html, /data-testid="research-sheet-backdrop"/);
    assert.match(html, /data-testid="research-sheet-container"/);
    assert.match(html, /role="dialog"/);
    assert.match(html, /aria-modal="true"/);
    assert.match(html, /aria-labelledby="test-sheet-title"/);
    assert.match(html, /custom-sheet-class/);

    // Verify slots rendered
    assert.match(html, /Research Title/);
    assert.match(html, /Research Body Content/);
    assert.match(html, /Export Action/);
    assert.match(html, /aria-label="Close details"/);
  });

  it("renders nothing when isOpen is false", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        ResearchSheet,
        {
          isOpen: false,
          onClose: () => {},
        },
        React.createElement(ResearchSheet.Body, null, "Hidden Content")
      )
    );

    assert.strictEqual(html, "");
  });

  it("throws an error when useResearchSheet is called outside ResearchSheet context", () => {
    function InvalidConsumer() {
      useResearchSheet();
      return null;
    }

    assert.throws(
      () => {
        renderToStaticMarkup(React.createElement(InvalidConsumer));
      },
      {
        message: "ResearchSheet subcomponents must be rendered inside ResearchSheet",
      }
    );
  });
});
