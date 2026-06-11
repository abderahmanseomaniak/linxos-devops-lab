import { supabase } from "@/services/supabase/client"
import { logsService } from "@/services/logs.service"

export interface AuditLogInput {
  action: string
  module: string
  entity_type?: string | null
  entity_id?: string | null
  description?: string | null
}

export async function logAudit(input: AuditLogInput): Promise<void> {
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  if (!user) return

  await logsService.create({
    user_id: user.id,
    action: input.action,
    module: input.module,
    entity_type: input.entity_type ?? null,
    entity_id: input.entity_id ?? null,
    description: input.description ?? null,
  })
}
