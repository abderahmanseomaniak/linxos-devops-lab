export type StepStatus = "completed" | "current" | "upcoming";

export interface TrackingStep {
  id: number;
  title: string;
  description?: string;
  status: StepStatus;
  message?: string;
  actionLabel?: string;
  actionType?: string;
}

export interface Phase {
  id: string;
  title: string;
  steps: TrackingStep[];
}

export interface SponsorshipTrackingData {
  currentStep: number;
  eventName: string;
  date: string;
  city: string;
  reference?: string;
  phases: Phase[];
}

export function calculateProgress(data: SponsorshipTrackingData): number {
  const totalSteps = data.phases.reduce((acc, phase) => acc + phase.steps.length, 0);
  const completedSteps = data.phases.reduce(
    (acc, phase) => acc + phase.steps.filter((s) => s.status === "completed").length,
    0
  );
  return Math.round((completedSteps / totalSteps) * 100);
}

export function getActivePhase(data: SponsorshipTrackingData): Phase | undefined {
  return data.phases.find((phase) =>
    phase.steps.some((step) => step.status === "current")
  );
}