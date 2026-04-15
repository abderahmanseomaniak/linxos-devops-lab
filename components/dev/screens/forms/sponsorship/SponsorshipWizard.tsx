"use client"

import { useState, useMemo, useCallback } from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Step1Form } from "./Step1Form"
import { Step2Form } from "./Step2Form"
import { Step3Form } from "./Step3Form"
import { Step4Form } from "./Step4Form"
import { Step5Form } from "./Step5Form"
import type { ContentFiles } from "@/types/sponsorship-form"
import { Step6Form } from "./Step6Form"
import { Step7Form } from "./Step7Form"
import { LegalEngagementStepUI } from "./LegalEngagementStepUI"

interface Step {
  id: number
  title: string
}

interface Creator {
  id: string
  name: string
  instagram: string
  tiktok: string
  followersInstagram: string
  followersTikTok: string
  available: boolean
  contentTypes: string[]
}

export function SponsorshipWizard() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [hasUGC, setHasUGC] = useState(false)
  const [creators, setCreators] = useState<Creator[]>([
    { id: "1", name: "", instagram: "", tiktok: "", followersInstagram: "", followersTikTok: "", available: false, contentTypes: [] }
  ])
  const [contentData, setContentData] = useState<{ selectedContentTypes: string[]; files: ContentFiles }>({
    selectedContentTypes: [],
    files: {}
  })

  const steps = useMemo(() => {
  const baseSteps: Step[] = [
    { id: 1, title: "Club" },
    { id: 2, title: "Responsable" },
    { id: 3, title: "Événement" },
  ];

  if (hasUGC) {
    baseSteps.push({ id: 4, title: "UGC" });
    baseSteps.push({ id: 5, title: "Contenus" });
    baseSteps.push({ id: 6, title: "Visibilité" });
    baseSteps.push({ id: 7, title: "Résumé" });
    baseSteps.push({ id: 8, title: "Engagement" });
  } else {
      baseSteps.push({ id: 4, title: "Contenus" });
      baseSteps.push({ id: 5, title: "Visibilité" });
      baseSteps.push({ id: 6, title: "Résumé" });
      baseSteps.push({ id: 7, title: "Engagement" });
  }

  return baseSteps;
}, [hasUGC]);
  

  const maxValidIndex = steps.length - 1
  const currentStepIndex = Math.min(activeStepIndex, maxValidIndex)

  const handleHasUGCChange = useCallback((value: boolean) => {
    setHasUGC(value)
    if (!value) {
      const newMaxIndex = 5
      setActiveStepIndex(Math.min(activeStepIndex, newMaxIndex))
    }
  }, [activeStepIndex])

  const handleAddCreator = useCallback(() => {
    if (creators.length < 6) {
      const newCreator: Creator = {
        id: Date.now().toString(),
        name: "",
        instagram: "",
        tiktok: "",
        followersInstagram: "",
        followersTikTok: "",
        available: false,
        contentTypes: []
      }
      setCreators(prev => [...prev, newCreator])
    }
  }, [creators.length])

  const handleRemoveCreator = useCallback((id: string) => {
    if (creators.length > 1) {
      setCreators(prev => prev.filter(c => c.id !== id))
    }
  }, [creators.length])

  const handleUpdateCreator = useCallback((id: string, field: keyof Creator, value: any) => {
    setCreators(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }, [])

  const renderStep = (index: number) => {
    const stepNum = index + 1

    switch (stepNum) {
case 1:
        return <Step1Form />
      case 2:
        return <Step2Form />
      case 3:
        return <Step3Form hasUGC={hasUGC} onHasUGCChange={handleHasUGCChange}/>
      case 4:
        if (hasUGC) {
          return (
            <Step4Form 
              creators={creators}
              onAddCreator={handleAddCreator}
              onRemoveCreator={handleRemoveCreator}
              onUpdateCreator={handleUpdateCreator}
            />
          )
        }
        return <Step5Form selectedContentTypes={contentData.selectedContentTypes} files={contentData.files} onChange={setContentData} />
      case 5:
        if (hasUGC) {
          return <Step5Form selectedContentTypes={contentData.selectedContentTypes} files={contentData.files} onChange={setContentData} />
        }
        return <Step6Form />
      case 6:
        if (hasUGC) {
          return <Step6Form />
        }
        return <Step7Form summaryStep={hasUGC ? 5 : 4} onEdit={handleEdit} />
      case 7:
        if (hasUGC) {
          return <Step7Form summaryStep={6} onEdit={handleEdit} />
        }
        return <LegalEngagementStepUI />
      case 8:
        return <LegalEngagementStepUI />
      default:
        return null
    }
  }

  const handleEdit = (step: number) => {
    const stepIndex = steps.findIndex(s => s.id === step)
    if (stepIndex !== -1) {
      setActiveStepIndex(stepIndex)
    }
  }

  const handleNext = () => {
    if (currentStepIndex < maxValidIndex) {
      setActiveStepIndex(currentStepIndex + 1)
    }
  }

  const handleBack = () => {
    if (!hasUGC && currentStepIndex >= 5) {
      setActiveStepIndex(4)
    } else if (hasUGC && currentStepIndex >= 6) {
      setActiveStepIndex(5)
    } else if (currentStepIndex > 0) {
      setActiveStepIndex(currentStepIndex - 1)
    }
  }

  const isLastStep = currentStepIndex === maxValidIndex
  const currentStep = steps[currentStepIndex]

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

              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center ">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${
                        isCompleted || isActive
                          ? "bg-primary text-primary-foreground"
                          : "border border-input"
                      }`}
                    >
                      {isCompleted ? "✓" : s.id}
                    </div>
                    <span
                      className={`text-xs mt-2 whitespace-nowrap ${
                        isActive ? "text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-10 h-px mx-2 ${
                        isCompleted ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {renderStep(currentStepIndex)}

      <div className={currentStepIndex === 0 ? "flex justify-end" : "flex justify-between items-center"}>
        {currentStepIndex > 0 && (
          <Button variant="ghost" onClick={handleBack} size="icon">
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
        )}
        <div className={currentStepIndex === 0 ? "w-auto" : ""}>
          {!isLastStep ? (
            <Button onClick={handleNext}>
              Suivre
            </Button>
          ) : (
            <Button className="w-auto px-6">Envoyer</Button>
          )}
        </div>
      </div>
    </div>
  )
}