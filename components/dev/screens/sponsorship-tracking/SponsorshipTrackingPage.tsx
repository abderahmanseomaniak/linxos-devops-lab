"use client";

import { useState } from "react";
import { EventHeader } from "./EventHeader";
import { PhaseBlock } from "./PhaseBlock";
import {
  calculateProgress,
  getActivePhase,
  type SponsorshipTrackingData,
} from "@/data/sponsorship-tracking";

interface SponsorshipTrackingPageProps {
  data: SponsorshipTrackingData;
}

export function SponsorshipTrackingPage({ data }: SponsorshipTrackingPageProps) {
  const progress = calculateProgress(data);
  const activePhase = getActivePhase(data);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (activePhase) {
      initial.add(activePhase.id);
    }
    return initial;
  });

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-md space-y-6">
        <EventHeader
          eventName={data.eventName}
          date={data.date}
          city={data.city}
          reference={data.reference}
          progress={progress}
          activePhaseTitle={activePhase?.title}
        />

        <div className="space-y-3">
          {data.phases.map((phase) => (
            <PhaseBlock
              key={phase.id}
              phase={phase}
              isExpanded={expandedPhases.has(phase.id)}
              onToggle={() => togglePhase(phase.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}