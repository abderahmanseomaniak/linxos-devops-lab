export interface Step1Data {
  nom: string;
  email: string;
  pays: string;
}

export interface Step2Data {
  nomProjet: string;
  description: string;
  budget: string;
}

export interface Step3Data {
  acceptTerms: boolean;
}

export interface StepperFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
}

export const STEPS = [
  { id: 1, title: "Informations personnelles" },
  { id: 2, title: "Détails du projet" },
  { id: 3, title: "Confirmation" },
] as const;