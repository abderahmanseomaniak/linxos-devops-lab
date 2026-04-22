"use client"

import { UsersTable } from "@/components/screens/users/users-table"
import { User } from "@/types/users"
import usersData from "@/data/users.json"

const initialUsers: User[] = usersData as User[]

export default function UsersPage() {
  const handleAdd = () => {
    console.log("Add user")
  }

  return (
    <UsersTable data={initialUsers} onAdd={handleAdd} />
  )
}