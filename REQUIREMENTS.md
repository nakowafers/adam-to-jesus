# REQUIREMENTS.md: Adam to Jesus - Technical & Functional Mandates

This document serves as the primary guidance for all development and architectural decisions for the "Adam to Jesus" project.

---

## 1. High-Level Vision
Autonomously develop and maintain a high-fidelity, interactive, and academically rigorous Biblical lineage and historical archive. The platform must feel like a "Digital Research Lab" for scholars and curious readers alike.

---

## 2. Functional Requirements

### 2.1 Interactive Lineage Exploration
- **Visual Tree:** A performant, interactive genealogy tree (Adam to Jesus) with support for Royal (Matthew) and Biological (Luke) branches.
- **Node Interaction:** Clicking an ancestor/disciple node must trigger a detailed view (Sidebar Drawer) with historical and scriptural context.
- **Search & Filter:** Instant search for specific names and filters for time periods (Epochs).

### 2.2 Site Hub (Landing Page)
- **Card Grid Navigation:** The landing page at `/` must display a responsive grid of cards linking to each major section (Lineage, Martyrdom, and future additions).
- **Future-Proof:** The hub must accommodate new sections as they are added, with graceful placeholder cards for content not yet built.
- **Shared Header:** A thin, site-wide header with the brand name must appear on every subpage, linking back to the landing page.

### 2.3 Scholarly Detail Views
- **Scripture Integration:** Every claim must be backed by a direct Scripture reference and full text.
- **Reliability Gauges:** Visual indicators for historical certainty levels (e.g., "Scriptural" vs. "Tradition").
- **Multimedia:** Support for symbols, artifacts, and geographical markers (Maps).

---

## 3. Technical & Performance Requirements (Cloudflare Stack)

### 3.1 Data Management (Zero-JSON Strategy)
- **Primary Database:** **Cloudflare D1**. All lineage nodes, edges, and historical data must be migrated from local SQLite and static `.ts/.json` files into D1 tables.
- **Key-Value Store:** **Cloudflare KV**. Use for global configuration, sitemap caching, and extremely high-read, small data points (e.g., app versioning, feature flags).
- **No Bundle Bloat:** Large data objects (`fullAncestors`, `nodes`) MUST NOT be imported directly into client components. Data must be fetched via server components or Edge-based API routes.

### 3.2 Performance Targets
- **LCP (Largest Contentful Paint):** < 1.5 seconds.
- **Hydration:** Minimize client-side JavaScript. Use React Server Components (RSC) wherever possible.
- **Caching:** Implement stale-while-revalidate (SWR) patterns on the Edge to ensure near-instant page transitions.

### 3.3 Infrastructure & Routing
- **Domain:** Hosted as a subpage of **fromadamtojesus.com**.
- **Routing:** Accessible via `/disciples/martyrdom` (or similar clean URL structure).
- **Hosting:** Cloudflare Pages (Next.js Edge Runtime).
- **Image Optimization:** Use Cloudflare Images or Next.js Image Component optimized for the Edge.
- **SEO:** Automated sitemap generation and JSON-LD structured data for every entry.

---

## 4. Engineering Standards

- **Source Priority:** 1. Holy Scripture -> 2. Academic Literature.
- **Design System:** Follow the **Modern Scholar** aesthetic (DESIGN.md).
- **Surgical Updates:** When fixing bugs or adding features, reproduce with tests first.
- **Performance First:** If a feature increases the main bundle size by > 10KB, it must be lazy-loaded or refactored.
- **Smoke Tests:** All routes must be verified with Playwright end-to-end smoke tests before deployment.

---

## 5. Development Workflow
1. **D1 Migrations:** Any new data structures require a D1 schema migration script.
2. **Edge Compatibility:** All code must be compatible with the Cloudflare Workers / Edge runtime (no Node.js-only modules like `better-sqlite3`).
3. **Validation:** Every feature must be verified for performance (Lighthouse/Trace) and Biblical accuracy before completion.
4. **Smoke Tests:** Playwright E2E smoke tests must pass before any deployment.
