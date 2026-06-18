import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase/database.types"

type DB = Database

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supabase = SupabaseClient<DB, "public", "public", any, { PostgrestVersion: "12" }>

let client: Supabase | null = null
let dbClient: ReturnType<Supabase["schema"]> | null = null

export function createClient(): Supabase {
  if (client) return client
  client = createBrowserClient<DB>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as unknown as Supabase
  return client!
}

/** For database-only queries (from, rpc). Avoids the Schema generic resolution issue. */
export function db() {
  if (dbClient) return dbClient
  dbClient = createClient().schema("public")
  return dbClient
}
