# Plan: Security & Dependency Upgrade

## Objective
Address the critical security vulnerability (CVE-2025-66478) in `next@15.2.0` and resolve the `npm audit` warnings by upgrading `next`, `react`, and related dependencies to their latest secure versions.

## Scope & Impact
- **Target Files:** `package.json`, `pnpm-lock.yaml`
- **Impact:** Upgrading these core dependencies will secure the application against Remote Code Execution (RCE) vulnerabilities. Since the user is moving from Next.js 15 to 16 and React 18 to 19 (which are the available stable versions reported by pnpm), some minor breaking changes might occur, but these versions contain the necessary security patches. 

## Proposed Solution / Implementation Steps
1.  **Upgrade Next.js:** 
    - Update `next` and `eslint-config-next` to `16.2.6` (the latest available version according to the logs).
2.  **Upgrade React:** 
    - Update `react` and `react-dom` to `19.2.6`.
    - Update `@types/react` to `19.2.14` and `@types/react-dom` to `19.2.3`.
3.  **Run Install & Audit:**
    - Execute `pnpm i` to install the new versions and update the lockfile.
    - Run `pnpm audit fix` to automatically address the remaining minor/moderate vulnerabilities.
4.  **Verify:**
    - Ensure the build succeeds (`pnpm build`).

## Alternatives Considered
- Staying on Next.js 15 and targeting `15.2.6` specifically. While this is a valid patch for the CVE, the `pnpm` logs indicate `16.2.6` and `19.2.6` are the primary available paths forward for this workspace, and moving to the latest stable ensures all upstream dependencies (like the React vulnerability CVE-2025-55182) are fully patched.

## Verification
- Verify the `pnpm install` completes without the CVE-2025-66478 warning.