import type { JSX } from "preact";
import { cn } from "@/lib/utils.ts";

interface SliderProps
  extends Omit<JSX.IntrinsicElements["input"], "type" | "onChange" | "value"> {
  value: number;
  max: number;
  min?: number;
  step?: number;
  onValueChange: (value: number) => void;
}

/**
 * A styled `<input type="range">` rather than a Radix-style slider — keeps
 * native drag/keyboard/touch behavior with no extra client JS, matching this
 * project's other hand-ported controls (see `checkbox.tsx`).
 */
export function Slider(
  { class: className, value, max, min = 0, step = 1, onValueChange, ...props }:
    SliderProps,
) {
  return (
    <input
      type="range"
      data-slot="slider"
      min={min}
      max={max}
      step={step}
      value={value}
      onInput={(event) => onValueChange(Number(event.currentTarget.value))}
      class={cn(
        // Taller box than the visible track widens the click/drag target
        // without thickening the line itself.
        "h-5 w-full cursor-pointer appearance-none bg-transparent",
        "accent-zinc-900 dark:accent-zinc-200",
        "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-200 dark:[&::-webkit-slider-runnable-track]:bg-zinc-700",
        "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-zinc-200 dark:[&::-moz-range-track]:bg-zinc-700",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
