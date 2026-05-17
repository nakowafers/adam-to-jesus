## 2026-05-17 - Icon-Only Button Accessibility
**Learning:** Icon-only action buttons (like History and Bookmark in the Martyrdom header) frequently lack `aria-label` attributes and visible focus states (`focus-visible`), severely impacting keyboard and screen reader accessibility in this application.
**Action:** Always verify that icon-only buttons include `aria-label` (and optionally `title`) attributes, and add appropriate `focus-visible` utility classes for clear keyboard navigation cues.
