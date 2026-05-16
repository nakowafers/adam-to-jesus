# DESIGN.md: Disciples' Martyrdom Interactive System

This document defines the visual language, user experience principles, and interface components for the "Deaths of the Disciples" interactive application, adhering to the **Modern Scholar** aesthetic of the fromadamtojesus.com ecosystem.

---

## 1. Visual Identity & Theming

### 1.1 Core Palette
The palette is a high-contrast, research-focused dark mode.
*   **Background (Base):** `#0A0A0A` — The primary canvas.
*   **Surface (Secondary):** `#131316` — Used for layout grouping.
*   **Surface Card/Drawer:** `#18181B` — Interactive containers and depth layers.
*   **Text (Primary):** `#FAFAFA` — High-legibility reading text.
*   **Text (Muted):** `#A1A1AA` — Metadata, dates, and secondary labels.
*   **Accent Gold:** `#D4AF37` — Used for active indicators, primary call-to-actions, and "Reliability Meter" highlights.
*   **Border Subtile:** `#27272A` — 1px structural dividers.

### 1.2 Typography
*   **Primary Font (Geist/Inter):** Used for all headings and body copy to ensure a technical, clean look.
*   **Monospace/Label Font (Space Grotesk):** Reserved for technical metadata (years, locations, certainty ratings).
*   **Scale:**
    *   `Display-XL`: 48px / Bold (Hero titles)
    *   `Heading-MD`: 24px / Semibold (Disciple names in Grid)
    *   `Body-MD`: 16px / Regular (Narrative text)
    *   `Caption-SM`: 12px / Medium (Uppercase Space Grotesk labels)

---

## 2. Core UI Components

### 2.1 The Apostolic Card (Library View)
*   **Anatomy:** A horizontal card layout prioritizing information density. It contains a left-aligned icon container (`48px` x `48px`) and a right-aligned text stack for the Name, Method, and Location.
*   **Iconography:** Utilizes the custom `ApostolicIcon` set—12 modern, gold-themed (`#D4AF37`) SVG symbols representing each apostle's unique history and martyrdom.
*   **Reliability Indicator:** Includes a integrated horizontal progress bar at the bottom of the card, providing an immediate visual cue of "Archive Reliability" based on historical consensus.
*   **Interaction:** 
    *   **Default:** 1px border (`#27272A`).
    *   **Hover:** Border transitions to Gold (`#D4AF37/40`) + 4px vertical lift + scale effect on the icon.
    *   **Selection:** A small Gold "active-indicator" pill appears in the top-right corner when the card is selected.

### 2.2 The Researcher’s Drawer (Context View)
*   **Anatomy:** A responsive bottom-sheet on mobile (max-height `92vh`) and a `480px` wide right-aligned sliding panel on desktop.
*   **Branding:** Labeled as "Context View: Academic Deep Dive" to emphasize the scholarly nature of the content.
*   **Content Stack:**
    1.  Header: Close button + breadcrumb-style title with a "Verified" shield badge.
    2.  Evidence Repository: A high-contrast quote block with a Gold left-border for scriptural/historical references.
    3.  Reliability Analysis: A sophisticated "Historical Consensus" gauge with precise percentage-based verification markers.
    4.  Academic Analysis: Dense, readable narrative sections for historical context.
    5.  Citations: A numbered list of scholarly citations with interactive hover states.

### 2.3 The Visual Context Layer
*   **Style:** An integrated section above the archive grid containing the `GeoVisualizer`.
*   **Container:** Wrapped in a `rounded-2xl` border with deep shadows to provide depth and context before exploring the individual records.

---

## 3. Implemented UX Enhancements

The following improvements have been integrated into the system to achieve the "Modern Scholar" standard:

*   **Responsive Fluidity:** The layout now transitions from a single-column stack on mobile to a multi-column grid on desktop, ensuring a seamless experience across all devices.
*   **Sticky Header Navigation:** A blurred, sticky header provides persistent access to breadcrumbs (`Apostles > Martyrdom`) and placeholder research tools (History, Bookmark).
*   **Framer Motion Orchestration:** Spring-based animations for the drawer transitions and layout-id-based indicators for card selection.
*   **A11y & Focus:** Enhanced high-contrast selection states and clear keyboard navigation paths.

---

## 4. Technical Guidelines (Implementation)

*   **Styling:** Tailwind CSS (config variables: `bg-base`, `surface-card`, `accent-gold`).
*   **Animation:** `framer-motion` for layout transitions and spring-based interactions.
*   **Icons:** Lucide-React for standard UI icons; the custom `ApostolicIcon` component for the 12 specific symbols:
    *   **Peter:** Crossed Keys
    *   **Andrew:** Saltire Cross
    *   **James son of Zebedee:** Pilgrim's Staff/Cross
    *   **John:** Eagle/Chalice
    *   **Philip:** Basket/Cross
    *   **Bartholomew:** Flaying Knife
    *   **Thomas:** Spear & Carpenter's Square
    *   **Matthew:** Purses/Money Bag
    *   **James son of Alphaeus:** Fuller's Club
    *   **Jude (Thaddaeus):** Halberd
    *   **Simon the Zealot:** Saw
    *   **Matthias:** Battle-axe
*   **Responsiveness:**
    *   **Desktop:** 2-column or 3-column Grid + Side-Drawer.
    *   **Mobile:** Vertically stacked cards (Full Width) + Bottom-Sheet Drawer.
