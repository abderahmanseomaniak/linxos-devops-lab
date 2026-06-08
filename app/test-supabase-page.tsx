import { createClient } from '@/supabase/server'
import Link from "next/link"
import { Typography } from "@/components/ui/typography"

export default async function TestSupabasePage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_states')
    .select('*')

  return (
    <div className="p-4">
      <Typography variant="h1" className="text-2xl font-bold mb-4">Supabase Connection Test</Typography>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
          <Typography variant="h2" className="mb-2 font-bold">Error:</Typography>
          <Typography variant="p">{error.message}</Typography>
        </div>
      )}

      {!error && data && (
        <div className="mb-4 rounded border border-green-400 bg-green-100 p-4 text-green-700">
          <Typography variant="h2" className="mb-2 font-bold">Success! Workflow States:</Typography>
          <pre className="overflow-auto rounded bg-white p-4">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {!error && !data && (
        <div className="mb-4 rounded border border-yellow-400 bg-yellow-100 p-4 text-yellow-700">
          <Typography variant="p">No data returned from workflow_states table</Typography>
        </div>
      )}

      <div className="mt-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}