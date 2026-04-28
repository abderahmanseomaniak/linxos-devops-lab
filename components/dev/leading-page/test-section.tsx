import { Card, CardContent } from "@/components/ui/card"

export default function TestSection() {
  const items = [
    "Sponsorship Management",
    "Logistics Tracking",
    "Content Monitoring",
    "Operational Dashboard",
  ]

  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-center text-2xl font-bold mb-10">
          Core Features
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {items.map((i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <p className="font-medium">{i}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Structured and automated workflow
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}