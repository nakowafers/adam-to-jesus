# Plan: Fix Mobile Drawer Height and Interactivity

## Objective
Fix the issue where ancestor cards do not open the details drawer on mobile devices. The root cause is likely a height collapse of the drawer container due to absolute-positioned children, and potential interaction blocking by the hidden drawer.

## Key Files & Context
- `src/components/genealogy/ancestor-drawer.tsx`: The main component for the details view.
- `src/components/genealogy/ancestor-node.tsx`: The clickable card component.

## Implementation Steps
1.  **Update `AncestorDrawer.tsx`**:
    - Change `max-h-[85vh]` to `h-[85vh]` on mobile to ensure the container has a defined height.
    - Add `pointer-events-none` to the drawer container when it is closed (`!isOpen`) to ensure it doesn't block clicks on the underlying tree.
    - Ensure that drawer buttons (like the Close button) are only focusable when the drawer is open using `tabIndex`.
    - Add `type="button"` to buttons for better semantic correctness.
2.  **Refine `AncestorNode.tsx`**:
    - Add `type="button"` to the `motion.button` components.
    - Ensure the button has a stable z-index when focused or selected.
3.  **Verify**:
    - Test mobile view (simulated or real) to confirm the drawer slides up correctly.
    - Confirm clicking on the backdrop closes the drawer.
    - Confirm that cards at the bottom of the screen (where the hidden drawer "lives") are still clickable.

## Verification & Testing
1. Visual inspection in mobile responsive mode.
2. Functional test: Click multiple ancestors and verify the drawer content updates and visibility toggles correctly.
