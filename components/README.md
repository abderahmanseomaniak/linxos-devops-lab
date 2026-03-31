# Components

Reusable React UI components organized by category.

## Rules

- **Organize by category**: Place components in the appropriate subfolder:
  - `ui/` — Base UI primitives (button, input, dialog, etc.)
  - `animation/` — Animation and transition components
  - `design/` — Design system components (typography, spacing, tokens)
  - `layouts/` — Layout components (header, sidebar, grid, container)
  - `screens/` — Full screen/page-level components
- **Kebab-case file names**: All files must use kebab-case (e.g., `date-picker.tsx`, `nav-bar.tsx`). No camelCase or PascalCase.
- **One component per file**: Each file should export a single component as its default or named export.
- **Use TypeScript**: All components must be `.tsx` files with proper type definitions for props.
- **Keep components pure**: Components should be presentational where possible. Avoid embedding business logic or API calls directly inside components.
- **Use `cn()` for styling**: Import `cn` from `@/lib/utils` to merge Tailwind classes. Do not use inline style objects.
- **No hardcoded text**: Use props or constants for any user-facing strings to support future i18n.
- **Props over internal state**: Prefer controlled components that receive data via props rather than managing their own state.
- **Do not import from `app/`**: Components must not depend on files inside the `app/` directory. Data flows down from pages, not the other way around.
- **Collocate variants**: If a component has multiple visual variants, use `class-variance-authority` (cva) to define them within the same file.
