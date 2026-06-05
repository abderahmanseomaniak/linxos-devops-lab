/**
 * Script de test de connexion Supabase
 *
 * Usage:
 *   bun run scripts/test-supabase.ts
 *
 * Ce script teste la connexion à Supabase en utilisant le service role key
 * (uniquement côté serveur) ou l'anon key.
 *
 * Assurez-vous que vos variables d'environnement sont chargées.
 * Sur Windows:  $env:NEXT_PUBLIC_SUPABASE_URL="https://..."
 * Sinon, créez un fichier .env.local et utilisez dotenv.
 */

// Chargement des variables d'environnement depuis .env
// Utilise override:true pour forcer l'écrasement des variables Windows existantes
import { config } from "dotenv";
config({ path: ".env", override: true });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement manquantes !");
  console.error("   Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définis");
  console.error("   dans .env.local ou exportés dans votre shell.");
  process.exit(1);
}

console.log(`🔌 Test de connexion à Supabase`);
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Projet: ${supabaseUrl.replace("https://", "").replace(".supabase.co", "")}`);
console.log("");

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  // Test 1: Auth - getSession
  console.log("📡 Test 1: Auth (getSession)...");
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError) {
    console.log(`   ⚠️  Auth: ${authError.message} (normal si l'anonyme n'a pas accès à auth)`);
  } else {
    console.log(`   ✅ Auth réussi - Session: ${session ? "authentifiée" : "anonyme"}`);
  }

  // Test 2: Base de données - lecture d'une table
  console.log("\n📡 Test 2: Base de données (lecture de workflow_states)...");
  const { data: states, error: dbError } = await supabase
    .from("workflow_states")
    .select("*");

  if (dbError) {
    console.log(`   ❌ Erreur: ${dbError.message}`);
    console.log(`   Code: ${dbError.code}`);
  } else {
    console.log(`   ✅ Connexion réussie !`);
    console.log(`   📊 Table workflow_states: ${states.length} enregistrement(s)`);
    if (states.length > 0) {
      console.log(`   📋 Données:`);
      states.forEach((s: { code: string; label: string }) =>
        console.log(`      - ${s.code}: ${s.label}`),
      );
    }
  }

  // Test 3: Lister les tables accessibles
  console.log("\n📡 Test 3: Vérification des tables accessibles...");
  const tablesToTry = [
    "profiles",
    "clubs",
    "campaigns",
    "events",
    "products",
    "application_forms",
    "scoring_profiles",
  ];

  for (const table of tablesToTry) {
    const { count, error } = await supabase
      .from(table as string)
      .select("*", { count: "exact", head: true });

    if (error) {
      console.log(`   ❌ ${table}: ${error.message}`);
    } else {
      console.log(`   ✅ ${table}: ${count} ligne(s)`);
    }
  }

  // Résultat final
  console.log("\n" + "=".repeat(50));
  console.log("📊 RÉSULTAT DU TEST");
  console.log("=".repeat(50));
  console.log(`   🔗 URL: ${supabaseUrl}`);
  console.log(`   📅 Timestamp: ${new Date().toISOString()}`);
  console.log("");
}

runTests()
  .then(() => {
    console.log("✅ Tests terminés.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erreur inattendue:", err);
    process.exit(1);
  });
