# Hooks

Custom React hooks for reusable stateful logic.

## Rules

- **Kebab-case file names**: All files must use kebab-case (e.g., `use-auth.ts`, `use-media-query.ts`). No camelCase or PascalCase.
- **Prefix with `use`**: Every hook file and export must start with `use`.
- **One hook per file**: Each file should export a single custom hook.
- **Use TypeScript**: All hooks must be `.ts` files with proper return type annotations.
- **Keep hooks generic**: Hooks should be reusable across multiple components. If a hook is specific to one component, keep it inside that component's file instead.
- **No UI rendering**: Hooks must not return JSX. They return data, state, and handler functions only.
- **Document parameters and return values**: Add a brief comment at the top of each hook describing what it does, its parameters, and its return value.
- **Handle cleanup**: Always clean up subscriptions, event listeners, and timers in the hook's cleanup function (return from `useEffect`).
- **Avoid deep nesting**: If a hook depends on another custom hook, limit the chain to two levels deep to keep debugging manageable.
