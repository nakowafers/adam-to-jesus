# Plan: Fix Duplicate Jesus Nodes

## Objective
Remove the duplicate Jesus nodes appearing at the end of the Royal and Biological branches by filtering them out of the branch arrays and relying on the dedicated convergence section at the bottom of the tree.

## Key Files & Context
- `src/components/genealogy/genealogy-tree.tsx`: Contains the filtering logic for `royalLine` and `biologicalLine`.
- `src/lib/lineage-data.ts`: Contains the `fullAncestors` array where the IDs `jesus-royal` and `jesus-bio` are defined.

## Implementation Steps
1. Update the filtering logic in `GenealogyTree` component:
   - Modify `royalLine` filter to exclude nodes where the ID starts with "jesus".
   - Modify `biologicalLine` filter to exclude nodes where the ID starts with "jesus".
2. Keep the `jesus` variable as-is, as it correctly finds the first Jesus node to display at the bottom convergence point.

## Verification & Testing
1. Visual inspection: Ensure Jesus only appears once at the bottom of the tree.
2. Check both Mobile and Desktop views to ensure the duplication is gone in both layouts.
