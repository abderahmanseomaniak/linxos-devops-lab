# Stores

Client-side state management stores.

## Rules

- **Kebab-case file names**: All files must use kebab-case (e.g., `auth-store.ts`, `cart-store.ts`). No camelCase or PascalCase.
- **One store per file**: Each file should define and export a single store scoped to one domain.
- **Use TypeScript**: All files must be `.ts` with fully typed state and actions.
- **Name with `-store` suffix**: Files should end with `-store.ts` (e.g., `user-store.ts`, `sidebar-store.ts`).
- **No API calls inside stores**: Stores hold state and mutations only. Side effects like fetching data belong in `hooks/` or server actions.
- **Keep stores flat**: Avoid deeply nested state objects. Flatten state structure for easier updates and fewer re-renders.
- **Export selectors**: Expose specific selectors for consuming components instead of exposing the entire store state.
- **No direct DOM access**: Stores must not reference `window`, `document`, or any browser API directly.
