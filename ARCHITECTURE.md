# Architecture: Adam to Jesus

**Repository:** [https://github.com/nakowafers/adam-to-jesus](https://github.com/nakowafers/adam-to-jesus)

## Overview

The `adam-to-jesus` project is a web application designed to visualize the biblical genealogy from Adam to Jesus. It renders an interactive family tree detailing the patriarchal lineage, diverging into the royal line (Matthew 1) and biological line (Luke 3), and finally converging at Jesus.

The application provides a responsive, interactive UI using smooth animations to help users explore individual ancestors, viewing their details, scriptural references, and summaries in a slide-out drawer or modal.

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Components:** Radix UI primitives (via shadcn/ui)
- **Deployment & Edge Runtime:** OpenNext and Cloudflare Workers (as indicated by `wrangler.jsonc` and `open-next.config.ts`)
- **Database / Data Storage:** Currently leveraging local SQLite (`better-sqlite3` and `lineage.db`) and static TypeScript data files (`src/lib/lineage-data.ts`).

## Core Structure

- `src/app/`: Contains the Next.js App Router entry points (e.g., `page.tsx`, `layout.tsx`).
- `src/components/genealogy/`: Core UI components for rendering the genealogy tree, such as `genealogy-tree.tsx`, `ancestor-node.tsx`, and `ancestor-drawer.tsx`.
- `src/components/ui/`: Reusable UI components based on Radix UI.
- `src/lib/`: Application logic, database access (`db.ts`), and static data models (`lineage-data.ts`, `genealogy-data.ts`).
- `scripts/`: Utilities for generating seeds and initializing the local database.

## Current Data Flow

The project currently has two parallel data sources:
1. Static JSON/TypeScript objects (`src/lib/lineage-data.ts`).
2. A local SQLite database (`lineage.db`) accessed via `better-sqlite3` (`src/lib/db.ts`).

Presently, the frontend UI components (e.g., `GenealogyTree`) import the static `fullAncestors` array from `lineage-data.ts` directly into client components.

---

## Architectural Recommendations

Given the goal of deploying this application to Cloudflare using OpenNext, and aiming for optimal performance and scalability, the following architectural improvements are recommended:

### 1. Migrate Database to Cloudflare D1
**Reasoning:** The application currently relies on `better-sqlite3`, which requires native Node.js binaries. This is incompatible with Cloudflare Workers (the edge runtime used by OpenNext). To resolve this, the data storage should be migrated to **Cloudflare D1** (Cloudflare's native serverless SQL database). You can interact with D1 via Cloudflare bindings and an edge-compatible ORM like Drizzle ORM or Kysely.

### 2. Leverage React Server Components (RSC) for Data Fetching
**Reasoning:** Currently, the entire `fullAncestors` dataset is statically imported into the client-side `GenealogyTree` component. As the dataset grows, this increases the client-side JavaScript bundle size. By fetching data in a Server Component (`app/page.tsx`) and passing only the necessary data down to Client Components, you reduce the initial load time and client-side memory footprint.

### 3. Implement URL-Based State Management
**Reasoning:** The selected ancestor is currently stored in local component state (`useState` in `GenealogyTree`). This means users cannot share a direct link to a specific ancestor's details, and using the browser's back button won't close the drawer. Refactoring this to use URL search parameters (e.g., `?ancestor=david`) or dynamic routes allows for deep linking, better SEO, and standard browser history navigation.

### 4. Unify Data Strategy
**Reasoning:** The codebase has both a local SQLite setup (`db.ts`, `scripts/`) and a static file setup (`lineage-data.ts`). It is highly recommended to establish a single source of truth. If the dataset remains small and static, dropping the database entirely in favor of static files or a simple edge-cached JSON blob would simplify the architecture. If dynamic updates or complex queries are needed in the future, fully committing to Cloudflare D1 and removing the static mock data is the best path forward.
