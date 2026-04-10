"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Step6FormProps {
  summaryStep: number
  onEdit: (step: number) => void
}

export function Step6Form({ summaryStep, onEdit }: Step6FormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Club</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom du club:</span>
              <span>Paris Sports Club</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ville:</span>
              <span>Paris</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Université:</span>
              <span>Sorbonne Université</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instagram:</span>
              <span>@parissports</span>
            </div>
          </div>
          <Button variant="link" size="sm" onClick={() => onEdit(1)}>
            Modifier
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responsable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom:</span>
              <span>Jean Dupont</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fonction:</span>
              <span>Président</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone:</span>
              <span>+33 6 00 00 00 00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>contact@club.fr</span>
            </div>
          </div>
          <Button variant="link" size="sm" onClick={() => onEdit(2)}>
            Modifier
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Événement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom:</span>
              <span>Tournoi de tennis</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span>Sport</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dates:</span>
              <span>15/06/2026 - 17/06/2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lieu:</span>
              <span>Stade de Paris</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Participants:</span>
              <span>200</span>
            </div>
          </div>
          <Button variant="link" size="sm" onClick={() => onEdit(3)}>
            Modifier
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibilité et logistique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Visibilité:</span>
              <span>Logo sur les panneaux</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Logistique:</span>
              <span>Stand, Électricité</span>
            </div>
          </div>
          <Button variant="link" size="sm" onClick={() => onEdit(4)}>
            Modifier
          </Button>
        </CardContent>
      </Card>

      {summaryStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>UGC / Ambassadeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Créateurs:</span>
                <span>2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Types:</span>
                <span>Reels, TikTok, Interviews</span>
              </div>
            </div>
            <Button variant="link" size="sm" onClick={() => onEdit(5)}>
              Modifier
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}