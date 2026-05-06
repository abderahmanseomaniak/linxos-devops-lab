"use client"

import { Suspense } from "react"
import { UsersTable } from "@/components/screens/users/users-table"
import { User } from "@/types/users"
import usersData from "@/data/users.json"

const initialUsers: User[] = usersData as User[]

export default function UsersPage() {
  const handleAdd = () => {
    console.log("Add user")
  }

  return (
    <Suspense fallback={<div className="h-96" />}>
      <UsersTable data={initialUsers} onAdd={handleAdd} />
    </Suspense>
  )
}