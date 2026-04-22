"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type UseStepActions = {
    goToNextStep: () => void;
    goToPrevStep: () => void;
    reset: () => void;
    canGoToNextStep: boolean;
    canGoToPrevStep: boolean;
    setStep: Dispatch<SetStateAction<number>>;
};

function clampStep(step: number, maxStep: number) {
    const upper = Math.max(maxStep, 1);
    if (step < 1) return 1;
    if (step > upper) return upper;
    return step;
}

export function useStep(
    maxStep: number,
    initialStep: number = 1,
): [number, UseStepActions] {
    const [currentStep, setCurrentStep] = useState(() =>
        clampStep(initialStep, maxStep),
    );

    const canGoToNextStep = currentStep < maxStep;
    const canGoToPrevStep = currentStep > 1;

    const setStep: Dispatch<SetStateAction<number>> = (value) => {
        setCurrentStep((prev) => {
            const next = typeof value === "function" ? value(prev) : value;
            return clampStep(next, maxStep);
        });
    };

    const goToNextStep = () => {
        setCurrentStep((step) => (step < maxStep ? step + 1 : step));
    };

    const goToPrevStep = () => {
        setCurrentStep((step) => (step > 1 ? step - 1 : step));
    };

    const reset = () => {
        setCurrentStep(clampStep(initialStep, maxStep));
    };

    return [
        currentStep,
        {
            goToNextStep,
            goToPrevStep,
            canGoToNextStep,
            canGoToPrevStep,
            setStep,
            reset,
        },
    ];
}
