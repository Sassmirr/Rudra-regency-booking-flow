// components/BookingProgress.tsx
import { Check } from "lucide-react";

const STEPS = ["Stay details", "Choose room", "Guest details", "Confirmation"];

export function BookingProgress({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <ol
      aria-label="Booking progress"
      className="flex list-none gap-0 px-6 pt-4"
    >
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "upcoming";
        return (
          <li
            key={label}
            className="flex flex-1 items-center text-xs text-stone"
          >
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs
                ${state === "done" ? "bg-gold border-gold text-ink" : ""}
                ${state === "active" ? "border-gold text-gold-bright" : ""}
                ${state === "upcoming" ? "border-surface-raised text-stone" : ""}`}
            >
              {state === "done" ? <Check size={12} /> : n}
            </span>
            <span
              className={`ml-2 hidden whitespace-nowrap sm:inline ${
                state !== "upcoming" ? "text-cream" : ""
              }`}
            >
              {label}
            </span>
            {n < STEPS.length && (
              <span className="mx-2 h-px flex-1 bg-surface-raised" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
