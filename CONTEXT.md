# Domain Context & Glossary: Adam to Jesus

This document maintains the canonical domain vocabulary for the "Adam to Jesus" project.

## Core Concepts

- **Lineage Node / Ancestor**: An individual historical or biblical figure in the lineage tree (from Adam to Jesus), containing scriptural references, title, epoch, and genealogical metadata.
- **Lineage Branch**: A specific genealogical path. Includes the **Royal Line** (Matthew 1 trace via Solomon) and the **Biological Line** (Luke 3 trace via Nathan), converging at Jesus.
- **Epoch**: A historical time period grouping lineage nodes (e.g., Patriarchs, Exodus, United Monarchy, Exile).
- **Disciple / Apostle**: An apostolic figure recorded in the Martyrdom archive, with associated historical certainty gauges and scriptural context.
- **LineageRepository**: The unified data access seam providing edge-compatible querying of lineage nodes, graph edge relationships, and search filtering. Backed by a dual-mode adapter architecture: `InMapperLineageAdapter` (in-memory static fallback for zero-config dev/testing) and `CloudflareD1LineageAdapter` (Cloudflare D1 SQL for edge runtime). Server Components (`app/lineage/page.tsx`) query `getLineageGraph()` to stream pre-partitioned graph props (`mainLineage`, `royalLine`, `biologicalLine`, `jesus`) directly to Client Components without client bundle bloat.
- **EntitySelection**: The URL-synchronized state seam (`useEntitySelection(paramKey)`) managing active drawer selection (`?ancestor=id` or `?disciple=id`) via Next.js `useSearchParams()` and `useRouter()`. Enables deep linking, scroll-locked non-disruptive navigation, and back/forward browser history support.
- **ResearchSheet**: The unified, accessible modal drawer UI primitive providing backdrop blur, scroll locking, keybindings (Escape key focus trap), and structured historical research views. Built using a compound slot composition pattern (`ResearchSheet`, `ResearchSheet.Header`, `ResearchSheet.Body`, `ResearchSheet.Footer`) to decouple modal container physics from entity-specific detail views (`AncestorDetailView`, `DiscipleDetailView`).
- **BibleTuiSession**: The URL-synchronized state seam managing active Bible passage (`?passage=BOOK.CHAPTER.VERSE`), translation selection (`?translation=kjv|web|asv`), input mode (`NORMAL` vs `COMMAND` vs `SEARCH`), and command history buffer in the Browser Bible TUI.
- **TuiCommandDSL**: The CLI command specification parser mapping terminal command strings (`:read [book] [chapter]`, `:search [query]`, `:compare [t1] [t2]`, `:theme [amber|cyan|matrix]`, `:help`) to TUI actions and Cloudflare D1 query payloads.

