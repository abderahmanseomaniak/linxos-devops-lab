import { UsersTable } from "@/components/screens/users/users-table"
import { getUsers } from "@/supabase/queries/users"

export default async function UsersPage() {
  const users = await getUsers()

  return <UsersTable data={users} />
}
