# Plan: Deploy Martyrdom Page to Cloudflare

## Objective
Deploy the new `/disciples/martyrdom` page to the live `fromadamtojesus.com` site by configuring it for Cloudflare's Edge runtime, committing the local changes, and pushing them to GitHub to trigger a deployment.

## Scope & Impact
- **Target Files:**
  - `src/app/disciples/martyrdom/page.tsx` (Add edge runtime export)
  - All local untracked and modified files related to the disciples feature.
- **Impact:** This will make the martyrdom feature publicly accessible and synchronize the local workspace with the remote repository. Cloudflare Pages will automatically trigger a new build upon pushing to `main`.

## Proposed Solution / Implementation Steps
1.  **Configure Edge Runtime:**
    - Edit `src/app/disciples/martyrdom/page.tsx`.
    - Add `export const runtime = 'edge';` to ensure the Server Component is compatible with Cloudflare Workers.
2.  **Stage Files:**
    - Run `git add` to stage the untracked `src/app/disciples/` folder, new components (`src/components/disciples/`), `src/lib/disciples.ts`, `migrations/`, `wrangler.toml`, and the modified configuration/UI files.
    - *Note: We will specifically exclude the `.jules/` directory from being tracked.*
3.  **Commit:**
    - Commit the staged changes with a descriptive message (e.g., `feat: Add Disciples Martyrdom interactive page`).
4.  **Push:**
    - Run `git push origin main` to push the changes to GitHub.
5.  **Deployment Verification (Manual):**
    - The user will need to monitor the Cloudflare dashboard to ensure the build succeeds and then verify the URL `fromadamtojesus.com/disciples/martyrdom`.

## Alternatives Considered
- Pushing the code without the `runtime = 'edge'` declaration. This was rejected because OpenNext/Cloudflare Pages typically requires this for SSR pages accessing databases (like the D1 binding used in `page.tsx`).

## Verification
- Run `git status` locally to ensure the working tree is clean.
- Ensure the commit successfully pushes to the `origin/main` branch.
