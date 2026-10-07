# ADR-0001: Unified Edge Repository Seams with In-Memory Fallbacks

- **Status:** Accepted
- **Date:** 2026-10-06
- **Context:** `LineageRepository`, `ScriptureRepository`, `MartyrdomRepository`

## Context and Problem Statement

The application targets Cloudflare Workers Edge runtime using Next.js App Router and OpenNext, where database bindings (e.g., Cloudflare D1) may be present in production but absent or unconfigured during local development, test execution (`tsx --test`), or static preview builds.

Previously, data handling was fragmented:
- `LineageRepository` used a dual-adapter pattern (`InMapperLineageAdapter` vs `CloudflareD1LineageAdapter`).
- `Martyrdom` relied on ad-hoc try/catches inside `app/disciples/martyrdom/page.tsx`, falling back to an inline Simon Peter object.
- `BibleTui` and `/api/bible/...` duplicated offline fallback dictionaries and book mapping logic across both client components and API routes.

## Decision Drivers

1. **Edge Resilience:** Zero unhandled 500 errors when edge bindings or third-party APIs timeout or fail.
2. **AI-Navigability & Locality:** Single canonical definition for each domain entity and data retrieval seam.
3. **Deterministic Testing:** All repository logic and data normalization must be 100% testable via unit tests without mocking Next.js server context or Cloudflare environments.
4. **Instant Zero-Latency First Render:** The client Bible TUI and genealogy views should load initial states instantly without waiting for external network waterfalls.

## Considered Options

1. **Edge-only remote database access:** Fail or spin if Cloudflare D1 or remote APIs are not reachable.
2. **Ad-hoc inline fallback handling:** Let each page or component handle its own try/catch and default state.
3. **Unified Dual-Mode Repository Pattern (Selected):** Each domain slice (`LineageRepository`, `ScriptureRepository`, `MartyrdomRepository`) exposes a small, deep interface backed by:
   - An in-memory static adapter (`InMapper*Adapter`) containing verified, peer-reviewed canonical records.
   - An edge adapter (`CloudflareD1*Adapter` or `Edge*Adapter`) that queries live infrastructure when present and delegates gracefully to the in-memory adapter on failure.

## Decision Outcome

Adopt the **Unified Dual-Mode Repository Pattern** across all three core domain slices:
- **`LineageRepository`**: Resolves `LineageGraph` from D1 with fallback to `fullAncestors`.
- **`ScriptureRepository`**: Normalizes book codes via `BookCodeNormalizer`, serves offline cached passages (`ISA.6`, `JHN.3`, `GEN.1`, etc.), and synthesizes structured offline placeholders when remote Bible APIs are unreachable.
- **`MartyrdomRepository`**: Resolves the 12 Apostles from D1 with fallback to `DISCIPLES_DATA` in `src/lib/disciples-data.ts`.

## Consequences

- **Positive:** UI components and Server Component pages shed boilerplate and data orchestration.
- **Positive:** Unit tests can verify repository contracts and data integrity in milliseconds.
- **Positive:** New developers or agents cloning the repository can run `pnpm test` and `pnpm dev` immediately without needing Cloudflare D1 credentials.
