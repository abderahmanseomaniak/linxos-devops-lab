# Lib

Shared utility functions, helpers, and configuration.

## Rules

- **Kebab-case file names**: All files must use kebab-case (e.g., `format-date.ts`, `parse-query.ts`). No camelCase or PascalCase.
- **Pure functions only**: Utilities should be pure — no side effects, no state, no API calls.
- **Use TypeScript**: All files must be `.ts` with explicit input/output types.
- **One concern per file**: Group related helpers in a single file by domain (e.g., `string-utils.ts`, `date-utils.ts`), but don't dump unrelated functions together.
- **No React imports**: This folder is for framework-agnostic logic. If it needs React, it belongs in `hooks/` or `components/`.
- **Export named functions**: Use named exports, not default exports, so imports are explicit and searchable.
- **No duplication**: Before adding a new utility, check if it already exists in this folder or in an installed dependency.
