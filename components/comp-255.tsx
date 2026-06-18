"use client";

import { useSliderWithInput } from "@/hooks/use-slider-with-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function Component() {
  const minValue = 0;
  const maxValue = 100;
  const initialValue = [25];

  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
  } = useSliderWithInput({ initialValue, maxValue, minValue });

  return (
    <div className="*:not-first:mt-3">
      <Label>Slider with input</Label>
      <div className="flex items-center gap-4">
        <Slider
          aria-label="Slider with input"
          className="grow"
          max={maxValue}
          min={minValue}
          onValueChange={handleSliderChange}
          value={sliderValue}
        />
        <Input
          aria-label="Enter value"
          className="h-8 w-12 px-2 py-1"
          inputMode="decimal"
          onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
          onChange={(e) => handleInputChange(e, 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              validateAndUpdateValue(inputValues[0], 0);
            }
          }}
          type="text"
          value={inputValues[0]}
        />
      </div>
    </div>
  );
}
