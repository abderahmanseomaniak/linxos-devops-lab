import { streamText, type ModelMessage } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { messages }: { messages: { role: "system" | "user" | "assistant"; parts?: { type: string; text?: string }[] }[] } = await req.json();

  const modelMessages = messages.map((m) => ({
    role: m.role,
    content: (m.parts ?? [])
      .filter((p) => p.type === "text")
      .map((p) => ({ type: "text" as const, text: p.text ?? "" })),
  })) as ModelMessage[];

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse()
}