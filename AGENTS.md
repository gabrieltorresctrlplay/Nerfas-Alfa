# AGENTS.md

This file defines the strict coding standards and architectural rules for this repository. All changes must adhere to these guidelines.

## 1. Architecture & Directory Structure

*   **Source Root:** All source code resides in `src/`.
*   **Aliases:** Use `@/` for all imports referring to `src/`. Relative imports (e.g., `../../`) are **forbidden** for parent directories. Sibling imports (`./`) are permitted.
*   **Components:**
    *   `src/components/ui/`: Atomic, generic UI components (shadcn/ui based).
    *   `src/components/{domain}/`: Feature-specific components (e.g., `auth`, `dashboard`).
*   **Pages:** Application views reside in `src/pages/`.
*   **Lib:** Utilities and core configuration (e.g., Firebase) in `src/lib/`.
*   **Contexts:** React Context providers in `src/contexts/`.
*   **Hooks:**
    *   General custom hooks in `src/hooks/`.
    *   Context-specific hooks (e.g., `useAuth`) may remain co-located with their Context definitions.
*   **Assets:** Static assets in `src/assets/` (if applicable) or `public/`.

## 2. Naming Conventions

*   **Files:**
    *   Components/Pages: `PascalCase.tsx` (e.g., `LoginForm.tsx`, `Dashboard.tsx`).
    *   Hooks: `camelCase.ts` (e.g., `useAuth.ts`).
    *   Utilities: `camelCase.ts` (e.g., `utils.ts`, `firebase.ts`).
*   **Variables/Functions:** `camelCase`.
*   **Constants:** `SCREAMING_SNAKE_CASE` for global/env constants.
*   **Types/Interfaces:** `PascalCase`.

## 3. Coding Standards

*   **Exports:**
    *   Use **Named Exports** for all components and utilities.
        *   *Correct:* `export function Button() { ... }`
        *   *Incorrect:* `export default function Button() { ... }`
    *   *Exception:* `React.lazy` imports may require default exports, but prefer named exports with `export { Component as default }` if strictly necessary.
*   **React:**
    *   Functional Components only.
    *   Explicit Return Types: `export function Component(): JSX.Element { ... }` or rely on strict inference if the linter permits, but explicit is preferred for public APIs.
    *   Props: Define interfaces/types explicitly.
*   **Styling:**
    *   Tailwind CSS via `className`.
    *   Use the `cn()` utility for class merging.
*   **Types:**
    *   **Strict Mode:** TypeScript `strict` mode is enabled.
    *   No `any`. Use `unknown` or specific types.

## 4. Testing

*   Unit tests are co-located with components: `Component.test.tsx`.
*   Setup file: `src/test/setup.ts`.

## 5. Build & Deployment

*   **Docs:** `npm run build:docs` (GitHub Pages).
*   **Firebase:** `npm run build:firebase` (Firebase Hosting).
*   **Linting:** `npm run lint` must pass.
