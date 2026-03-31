# Providers

React context providers for global state and configuration.

## Rules

- **Kebab-case file names**: All files must use kebab-case (e.g., `theme-provider.tsx`, `auth-provider.tsx`). No camelCase or PascalCase.
- **One provider per file**: Each file should contain a single context provider and its associated hook.
- **Use TypeScript**: All files must be `.tsx` with typed context values — never use `any` or untyped contexts.
- **Export a consumer hook**: Every provider must export a companion `use<Name>` hook (e.g., `useTheme`) so consumers never call `useContext` directly.
- **Throw on missing provider**: The consumer hook must throw a clear error if used outside its provider boundary.
- **Keep providers thin**: Providers should only hold state and pass it down. Business logic belongs in `lib/` or `hooks/`.
- **Avoid deep nesting**: If the app needs many providers, compose them in a single wrapper file (e.g., `app-providers.tsx`) rather than nesting them manually in the layout.
