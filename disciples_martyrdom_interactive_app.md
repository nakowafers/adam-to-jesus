# Enhanced Stitch Prompt: Disciples' Martyrdom Interactive App

**Project Context:** fromadamtojesus.com (Modern Biblical Archive)
**Topic:** Interactive historical study of the 12 Disciples' deaths.

## Core Objective
Design a sophisticated, high-fidelity interactive sub-page that serves as an academic and visual guide to the martyrdom of the twelve apostles. The interface should balance immersive interactivity with the "Modern Scholar" dark-mode aesthetic.

## Visual Identity & Theme
- **Mood:** Immersive, scholarly, and respectful.
- **Palette:**
  - **Background (Base):** `#0A0A0A` (Deepest Charcoal).
  - **Surface (Cards/Drawers):** `#18181B` (Zinc 900).
  - **Text (Primary):** `#FAFAFA` (Off-White).
  - **Accent:** `#D4AF37` (Muted Gold) for active states, ratings, and call-to-action highlights.
- **Typography:** 
  - **Headings:** 'Inter' (Semibold/Bold).
  - **Labels/Metadata:** 'Space Grotesk' (Regular).

## UI Structure & Components

### 1. The "Apostolic Grid" (Hero Section)
- **Layout:** A responsive 3x4 grid of minimalist cards.
- **Card Content:** 
  - A stylized, monochrome vector icon or symbol associated with the disciple (e.g., Keys for Peter, Crossed Swords for Paul/James).
  - Name of the Disciple in clean uppercase 'Space Grotesk'.
  - A subtle "Location of Death" label at the bottom of the card.
- **Interaction:** Hover state triggers a 1px Gold (#D4AF37) border and a slight "lift" effect.

### 2. Martyrdom Detail Drawers
- **Trigger:** Clicking a card opens a right-side sliding drawer (Zinc 900 surface).
- **Sections:**
  - **Header:** Disciple Name + Large Symbol.
  - **The Narrative:** A brief, 2-3 sentence description of the "Most Likely Outcome" based on historical tradition and scriptural records.
  - **Technical Specs:** A metadata list (Method, Year, Location).
  - **Reliability Meter:** A horizontal gauge showing "Historical Certainty" (e.g., "Scriptural" vs "Early Church Tradition" vs "Later Legend").
  - **Source Links:** Footnote-style links to peer-reviewed academic sources.

### 3. "The Great Commission" Geo-Visualizer
- **Component:** A simplified, dark-themed vector map of the ancient Mediterranean and Middle East.
- **Functionality:** Map markers (Gold dots) representing the location of each disciple's death. Clicking a marker syncs with the grid/drawer selection.

### 4. Navigation & Utilities
- **Header:** Sticky minimalist navbar with "Modern Biblical Archive" branding.
- **Breadcrumbs:** `Home > Apostles > Martyrdom`.
- **Footer:** A "Deep Dive" section linking to the "Timeline of the Early Church" and "Manuscript Evidence."

## Technical Execution (Stitch Directives)
- Use **Tailwind CSS** for all utility-based styling.
- Implement **Framer Motion** for the drawer slide-in animation and grid hover effects.
- Ensure the layout is **Mobile-First**, transitioning the 3x4 grid into a single-column scroll on smaller viewports while keeping drawers accessible.
