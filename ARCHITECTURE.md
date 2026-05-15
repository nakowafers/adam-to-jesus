# ARCHITECTURE.md: High-Performance Edge Stack

This document outlines the architectural blueprint for the "Adam to Jesus" project. It is designed for maximum performance, global availability, and scholarly precision using a modern Edge-first stack.

---

## 1. System Overview
The application is a **Next.js** application deployed on **Cloudflare Pages**, utilizing the **Edge Runtime**. The new interactive features are integrated as subpages of **fromadamtojesus.com** (e.g., `/disciples/martyrdom`). Data is decentralized across Cloudflare’s edge network to minimize latency and eliminate the "Large JSON" performance bottleneck.

---

## 2. Technical Stack

| Tier | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15+ (App Router) | Native support for React Server Components (RSC) and Streaming. |
| **Styling** | Vanilla CSS / Tailwind | Minimal runtime overhead; optimized for the Edge. |
| **Infrastructure** | Cloudflare Pages | Global CDN deployment with integrated CI/CD and Edge compute. |
| **Database** | Cloudflare D1 (SQLite) | Serverless SQL database distributed at the edge for low-latency queries. |
| **Caching/KV** | Cloudflare KV | Low-latency key-value store for static metadata and feature flags. |
| **State Mgmt** | React Server Components | Moves logic and data fetching to the server, reducing client JS bundle. |

---

## 3. Data Architecture (Zero-Bundle Strategy)

Currently, the project relies on large `.ts` and `.json` files (e.g., `fullAncestors`). The new architecture moves to a **Fetch-on-Demand** model.

### 3.1 Data Flow
1.  **Request:** User navigates to a lineage node.
2.  **Compute:** Next.js Server Component triggers an asynchronous D1 query.
3.  **Fetch:** `d1.prepare('SELECT * FROM lineage WHERE id = ?').first()`
4.  **Stream:** The resulting HTML is streamed to the client. The client never downloads the full dataset.

### 3.2 Storage Mapping
*   **Cloudflare D1:** Nodes (Ancestors/Disciples), Edges (Relationships), Detailed Narrative, Scripture Text.
*   **Cloudflare KV:** Sitemaps, Epoch Metadata, Global Theme Config, Asset Pointers.
*   **Cloudflare R2:** High-resolution icons, historical artifact images, and geographical SVG assets.

---

## 4. Performance & Optimization

### 4.1 Edge Caching (SWR)
We utilize Cloudflare’s **Cache API** and Next.js `revalidateTag` to implement Stale-While-Revalidate. Data is cached at the edge node closest to the user for sub-50ms response times.

### 4.2 Bundle Optimization
*   **Code Splitting:** Heavy interactive components (like the Disciples Geo-Map) are loaded via `next/dynamic` only when the user interacts with the specific section.
*   **Icon Strategy:** Move from SVG-in-JS to an SVG Sprite sheet hosted on R2, reducing the initial HTML size.

### 4.3 Image Optimization
Leverage **Cloudflare Images** to automatically serve WebP/AVIF formats based on client browser support, with resizing happening at the edge.

---

## 5. Security & Academic Integrity

*   **API Security:** All D1 mutations are restricted to authenticated admin routes (protected by Cloudflare Access).
*   **Data Integrity:** Schema-level constraints in D1 ensure that every entry MUST have a `scripture_reference` and `verification_status`.
*   **Content Security Policy (CSP):** Strict policies to prevent XSS, especially when rendering formatted Scripture text.

---

## 6. Deployment & CI/CD

1.  **Branching:** `main` (Production), `canary` (Edge Staging).
2.  **Automated Migrations:** D1 schema changes are applied via `wrangler d1 migrations apply` during the build step on Cloudflare Pages.
3.  **Validation:** Build fails if Lighthouse performance scores drop below 95 for LCP or if type-checking fails.

---

## 7. Migration Roadmap

1.  **Phase 1:** Setup Cloudflare Wrangler and D1 instance.
2.  **Phase 2:** Execute migration scripts to move `epoch*.json` and `lineage-data.ts` into D1.
3.  **Phase 3:** Refactor `src/lib/db.ts` to use `process.env.D1_DATABASE` instead of `better-sqlite3`.
4.  **Phase 4:** Replace static JSON imports in components with RSC fetch calls.
