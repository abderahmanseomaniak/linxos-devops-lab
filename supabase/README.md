# Supabase

Supabase client configuration, types, and database utilities.

## Rules

- **Kebab-case file names**: All files must use kebab-case (e.g., `supabase-client.ts`, `database-types.ts`). No camelCase or PascalCase.
- **Separate client and server**: Keep browser client and server client in separate files (e.g., `client.ts` and `server.ts`).
- **Use TypeScript**: All files must be `.ts` with generated database types from Supabase CLI.
- **Never expose service role key**: The service role key must only be used in server-side code. Browser clients must use the anon key.
- **Regenerate types after schema changes**: Run `supabase gen types` after every migration and commit the updated types file.
- **No raw SQL in application code**: Use the Supabase client query builder. Raw SQL belongs in migration files only.
- **Centralize client creation**: Create the Supabase client in one place and import it everywhere — do not instantiate multiple clients.
- **Store credentials in environment variables**: Never hardcode URLs or keys. Use `.env.local` and reference via `process.env`.
