import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase/database.types"

type DB = Database

let client: ReturnType<typeof createBrowserClient<DB>> | null = null
let dbClient: ReturnType<SupabaseClient<DB, "public">["schema"]> | null = null

export function createClient() {
  if (client) return client
  client = createBrowserClient<DB>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as unknown as ReturnType<typeof createBrowserClient<DB>>
  return client
}

/** For database-only queries (from, rpc). Avoids the Schema generic resolution issue. */
export function db() {
  if (dbClient) return dbClient
  dbClient = createClient().schema("public")
  return dbClient
}
