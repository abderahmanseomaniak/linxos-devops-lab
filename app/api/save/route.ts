import { NextRequest, NextResponse } from "next/server"
import { writeFileSync } from "fs"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const { key, data } = await request.json()
    
    const fileMap: Record<string, string> = {
      "linxos_events_data": "events.json",
      "linxos_users_data": "users.json",
    }
    
    const filename = fileMap[key]
    if (!filename) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 })
    }
    
    const filePath = join(process.cwd(), "data", filename)
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}