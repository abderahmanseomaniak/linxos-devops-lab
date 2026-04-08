"use client"

import { EventTable } from "@/components/dev/screens/event/event-table"
import { Plus } from "lucide-react"

const mockEvents = [
  {
    id: "1",
    title: "Tech Conference 2024",
    date: "2024-03-15",
    location: "San Francisco, CA",
    status: "accepted" as const,
    attendees: 250,
  },
  {
    id: "2",
    title: "Product Launch",
    date: "2024-03-20",
    location: "New York, NY",
    status: "pending" as const,
    attendees: 150,
  },
  {
    id: "3",
    title: "Team Workshop",
    date: "2024-03-25",
    location: "Austin, TX",
    status: "accepted" as const,
    attendees: 80,
  },
]

export default function DevPage() {
  return (
    <div className="flex flex-col gap-y-10 p-8">
      <h1 className="text-4xl font-bold">Dev Page</h1>
      <EventTable 
        events={mockEvents}
        onAdd={() => console.log("Add Event")}
      />
    </div>
  )
}
