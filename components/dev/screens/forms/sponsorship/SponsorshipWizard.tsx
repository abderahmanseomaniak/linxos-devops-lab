"use client"

import { useState, useMemo } from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { type Step } from "@/types/sponsorship-form"
import { Step1Form } from "./Step1Form"
import { Step2Form } from "./Step2Form"
import { Step3Form } from "./Step3Form"
import { Step4Form } from "./Step4Form"
import { Step5Form } from "./Step5Form"
import { Step6Form } from "./Step6Form"

const STEPS: Step[] = [
  { id: 1, title: "Club" },
  { id: 2, title: "Événement" },
  { id: 3, title: "Contenus" },
  { id: 4, title: "Visibilité" },
  { id: 5, title: "Résumé" },
  { id: 6, title: "Engagement" },
]

export function SponsorshipWizard() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  const steps = useMemo(() => STEPS, [])
  
  const maxValidIndex = steps.length - 1
  const currentStepIndex = Math.min(activeStepIndex, maxValidIndex)

  const renderStep = (index: number) => {
    switch (index) {
      case 0:
        return <Step1Form />
      case 1:
        return <Step2Form />
      case 2:
        return <Step3Form />
      case 3:
        return <Step4Form />
      case 4:
        return <Step5Form />
      case 5:
        return <Step6Form />
      default:
        return null
    }
  }

  const handleStepClick = (index: number) => {
    if (index < currentStepIndex) {
      setActiveStepIndex(index)
    }
  }

  const handleNext = () => {
    if (currentStepIndex < maxValidIndex) {
      setActiveStepIndex(currentStepIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setActiveStepIndex(currentStepIndex - 1)
    }
  }

  const isLastStep = currentStepIndex === maxValidIndex
  const isFirstStep = currentStepIndex === 0

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demande de sponsoring</CardTitle>
          <CardDescription>Étape {currentStepIndex + 1} sur {steps.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-0 overflow-x-auto py-0">
            {steps.map((s, index) => {
              const isCompleted = index < currentStepIndex
              const isActive = index === currentStepIndex
              const canClick = index < currentStepIndex

              return (
                <button
                  key={s.id}
                  onClick={() => canClick && handleStepClick(index)}
                  disabled={!canClick}
                  className={`flex items-center bg-transparent border-none p-0 ${canClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
                >
                  <div className="flex flex-col items-center ">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                        isCompleted || isActive
                          ? "bg-primary text-primary-foreground"
                          : "border border-input"
                      }`}
                    >
                      {isCompleted ? "✓" : s.id}
                    </div>
                    <span
                      className={`text-xs mt-2 whitespace-nowrap transition-colors duration-300 ${
                        isActive ? "text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-10 h-px mx-2 transition-colors duration-300 ${
                        isCompleted ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="animate-in fade-in duration-300">
        {renderStep(currentStepIndex)}
      </div>

      <div className="flex justify-between">
        {!isFirstStep ? (
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeftIcon />
            
          </Button>
        ) : (
          <div />
        )}
        {!isLastStep ? (
          <Button onClick={handleNext}>
            Suivant
          </Button>
        ) : (
          <Button className="w-auto px-6">Envoyer</Button>
        )}
      </div>
    </div>
  )
}