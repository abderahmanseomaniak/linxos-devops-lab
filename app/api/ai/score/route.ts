import { NextResponse } from "next/server"
import { runAiScoring } from "@/services/ai-scoring.service"

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json()

    if (!eventId) {
      return NextResponse.json({ error: "eventId est requis" }, { status: 400 })
    }

    const result = await runAiScoring(eventId)

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    console.error("[api/ai/score] Error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de l'analyse IA" },
      { status: 500 },
    )
  }
}
