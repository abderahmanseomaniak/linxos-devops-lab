import { createClient } from "@supabase/supabase-js"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { workflowService } from "@/services/workflow.service"

const AI_MODEL = "llama-3.3-70b-versatile"

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

async function getStateId(supabase: ReturnType<typeof getAdmin>, code: string): Promise<string | null> {
  const { data } = await supabase
    .from("workflow_states")
    .select("id")
    .eq("code", code)
    .maybeSingle()
  return data?.id ?? null
}

async function getSponsoringManagerIds(supabase: ReturnType<typeof getAdmin>): Promise<string[]> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["ADMIN", "SPONSORING_MANAGER"] as never)
  return (data ?? []).map((p: { id: string }) => p.id)
}

interface AiPayload {
  event: Record<string, unknown>
  club: Record<string, unknown>
  sponsorship: Record<string, unknown>
  ugc_profiles: Record<string, unknown>[]
  campaign: Record<string, unknown> | null
  rules: { name: string; weight: number }[]
}

interface AiResult {
  score: number
  recommendation: "ACCEPT" | "REJECT" | "REVIEW"
  risk_level: "LOW" | "MEDIUM" | "HIGH"
  reasoning: string
  strengths: string[]
  weaknesses: string[]
  suggested_allocation: { cans: number; tshirts: number; caps: number }
}

function buildPayload(
  event: Record<string, unknown>,
  club: Record<string, unknown>,
  applicationForm: Record<string, unknown> | null,
  ugcProfiles: Record<string, unknown>[],
  campaign: Record<string, unknown> | null,
  rules: { name: string; weight: number }[],
): AiPayload {
  return {
    event: {
      title: event.title,
      city: event.city,
      type: applicationForm?.event_type,
      expected_attendance: applicationForm?.expected_attendance,
      target_audience: applicationForm?.target_audience,
      start_date: event.start_date,
    },
    club: {
      name: club.name,
      university: club.university,
      instagram: club.instagram,
    },
    sponsorship: {
      partnership_type: applicationForm?.partnership_type,
      visibility_counterparts: applicationForm?.visibility_counterparts,
      has_ugc: applicationForm?.has_ugc ?? false,
      ugc_content_types: applicationForm?.ugc_content_types,
      first_collaboration: applicationForm?.first_collaboration,
    },
    ugc_profiles: ugcProfiles.map((p) => ({
      instagram_url: p.instagram_url,
      followers_count: p.followers_count,
      content_type: p.content_type,
    })),
    campaign: campaign
      ? { name: campaign.name, type: campaign.type }
      : null,
    rules: rules.map((r) => ({ name: r.name, weight: r.weight })),
  }
}

const SYSTEM_PROMPT = `Tu es un assistant IA spécialisé dans l'évaluation des demandes de sponsoring pour LINX ENERGY.

Ta mission est d'analyser une demande de sponsoring soumise par un club, une association ou un organisateur d'événement.

Évalue la demande selon ces critères :
1. Audience estimée
2. Type d'événement
3. Cible visée
4. Visibilité de la marque
5. Potentiel UGC
6. Alignement avec la campagne
7. Faisabilité logistique
8. Niveau de risque

Retourne UNIQUEMENT du JSON valide avec cette structure :

{
  "score": nombre entre 0 et 100,
  "recommendation": "ACCEPT" | "REJECT" | "REVIEW",
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "reasoning": "explication professionnelle en français",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggested_allocation": {
    "cans": number,
    "tshirts": number,
    "caps": number
  }
}

Important :
- Ne prends PAS la décision finale.
- Le Sponsoring Manager est responsable de la validation finale.
- Sois objectif, professionnel et concis.`

export async function runAiScoring(eventId: string) {
  const supabase = getAdmin()

  // 1. Load event
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("*, club:clubs(*), campaign:campaigns(*)")
    .eq("id", eventId)
    .single()
  if (eventErr || !event) throw new Error(`Événement introuvable: ${eventErr?.message}`)

  // 2. Set event state to AI_PROCESSING
  const aiProcessingId = await getStateId(supabase, "AI_PROCESSING")
  if (aiProcessingId) {
    const { error: updateErr } = await supabase
      .from("events")
      .update({ state_id: aiProcessingId } as never)
      .eq("id", eventId as never)
    if (updateErr) console.error("[ai-scoring] Failed to set AI_PROCESSING state:", updateErr)
  }

  // 3. Load application form + UGC profiles
  const { data: appForm } = await supabase
    .from("application_forms")
    .select("*, ugc_profiles:application_ugc_profiles(*)")
    .eq("event_id", eventId as never)
    .maybeSingle()

  // 4. Load scoring rules (from event's campaign scoring profile)
  let rules: { name: string; weight: number }[] = []
  if (event.campaign_id) {
    const { data: profile } = await supabase
      .from("scoring_profiles")
      .select("*, rules:scoring_rules(*)")
      .eq("campaign_id", event.campaign_id as never)
      .maybeSingle()

    if (profile) {
      rules = (profile as unknown as { rules: { name: string; weight: number }[] }).rules?.filter((r) => r.weight > 0) ?? []
    }
  }

  // If no scoring profile rules, use defaults
  if (rules.length === 0) {
    rules = [
      { name: "Audience estimée", weight: 30 },
      { name: "Potentiel UGC", weight: 25 },
      { name: "Visibilité de la marque", weight: 20 },
      { name: "Alignement campagne", weight: 15 },
      { name: "Faisabilité logistique", weight: 10 },
    ]
  }

  // 5. Build AI payload
  const payload = buildPayload(
    event as unknown as Record<string, unknown>,
    (event as unknown as { club: Record<string, unknown> }).club ?? {},
    appForm as unknown as Record<string, unknown> | null,
    ((appForm as unknown as { ugc_profiles: Record<string, unknown>[] })?.ugc_profiles ?? []) as Record<string, unknown>[],
    (event as unknown as { campaign: Record<string, unknown> | null }).campaign ?? null,
    rules,
  )

  // 6. Insert PENDING analysis
  const { data: analysis, error: insertErr } = await supabase
    .from("ai_analyses")
    .insert({
      event_id: eventId,
      scoring_profile_id: null,
      status: "PROCESSING",
      model_used: AI_MODEL,
    } as never)
    .select()
    .single()

  if (insertErr) {
    console.error("[ai-scoring] Failed to insert analysis:", insertErr)
    throw new Error("Erreur lors de la création de l'analyse IA")
  }

  const analysisId = (analysis as unknown as { id: string }).id

  try {
    // 7. Call AI
    const prompt = JSON.stringify(payload, null, 2)
    const result = await generateText({
      model: groq(AI_MODEL),
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    })

    const text = result.text

    // 8. Parse JSON from response
    let parsed: AiResult
    try {
      const jsonStr = text.replace(/```(?:json)?\s*/g, "").trim()
      parsed = JSON.parse(jsonStr) as AiResult
    } catch {
      throw new Error("Réponse IA invalide : impossible de parser le JSON")
    }

    // Validate required fields
    if (typeof parsed.score !== "number" || parsed.score < 0 || parsed.score > 100) {
      throw new Error("Score invalide dans la réponse IA")
    }
    if (!["ACCEPT", "REJECT", "REVIEW"].includes(parsed.recommendation)) {
      throw new Error("Recommandation invalide dans la réponse IA")
    }

    // 9. Update ai_analyses with result
    const { error: updateResultErr } = await supabase
      .from("ai_analyses")
      .update({
        score: parsed.score,
        recommendation: parsed.recommendation,
        justification: parsed.reasoning,
        risk_level: parsed.risk_level,
        strengths: JSON.parse(JSON.stringify(parsed.strengths)),
        weaknesses: JSON.parse(JSON.stringify(parsed.weaknesses)),
        suggested_allocation: JSON.parse(JSON.stringify(parsed.suggested_allocation)),
        raw_response: JSON.parse(JSON.stringify(parsed)),
        status: "COMPLETED",
      } as never)
      .eq("id", analysisId as never)

    if (updateResultErr) {
      console.error("[ai-scoring] Failed to update analysis result:", updateResultErr)
    }

    // 10. Transition event to SCORED via workflow service (validates + history + auto-actions)
    const scoredStateId = await getStateId(supabase, "SCORED")
    if (scoredStateId) {
      try {
        await workflowService.transitionWithClient(
          supabase,
          eventId,
          scoredStateId,
          null,
          `Analyse IA terminée – Score: ${parsed.score}/100, Recommandation: ${parsed.recommendation}`
        )

        // Save AI score separately
        await supabase
          .from("events")
          .update({ score_ai: parsed.score } as never)
          .eq("id", eventId as never)
      } catch (transitionErr) {
        console.error("[ai-scoring] Failed to transition via workflow service:", transitionErr)
      }
    }

    // 11. Notify sponsoring managers
    const managerIds = await getSponsoringManagerIds(supabase)
    const notifications = managerIds.map((userId) => ({
      user_id: userId,
      title: "Analyse IA terminée",
      message: `L'événement "${(event as unknown as { title: string }).title}" a été analysé par l'IA. Score: ${parsed.score}/100 – ${parsed.recommendation}`,
      related_event_id: eventId,
      notification_type: "STATE_CHANGE",
    }))

    if (notifications.length > 0) {
      await supabase.from("notifications" as never).insert(notifications as never)
    }

    return parsed
  } catch (err) {
    // Mark analysis as FAILED
    await supabase
      .from("ai_analyses")
      .update({
        status: "FAILED",
        error_message: err instanceof Error ? err.message : "Erreur inconnue",
      } as never)
      .eq("id", analysisId as never)

    throw err
  }
}
