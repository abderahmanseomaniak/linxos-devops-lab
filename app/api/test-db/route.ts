import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Test 1: Auth — récupérer la session (ne nécessite pas de connexion)
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    // Test 2: Base de données — lister les tables système pour vérifier la connexion
    const { data: tables, error: dbError } = await supabase
      .from("workflow_states")
      .select("code, label")
      .limit(5);

    // Test 3: Vérifier que la base répond (ping)
    const { count, error: countError } = await supabase
      .from("workflow_states")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      status: "ok",
      connected: true,
      timestamp: new Date().toISOString(),
      project: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
        "https://",
        "",
      ).replace(".supabase.co", ""),
      tests: {
        auth: {
          success: !authError,
          session: session ? "authentifiée" : "anonyme (normal pour un test)",
          error: authError?.message ?? null,
        },
        database: {
          success: !dbError,
          workflow_states_count: count ?? 0,
          sample_data: tables ?? [],
          error: dbError?.message ?? null,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        connected: false,
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de la connexion",
      },
      { status: 500 },
    );
  }
}
