import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function testSupabase() {
  const { data, error } = await supabase.from("events").select("*").limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}