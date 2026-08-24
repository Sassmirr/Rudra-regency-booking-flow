// components/GuestDetailsForm.tsx
import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import type { StayDetails, GuestDetails } from "../services/bookingService";
import type { Room } from "../data/rooms";
import { BookingSummary } from "./BookingSummary";

type Props = {
  guest: GuestDetails;
  setGuest: (updater: (g: GuestDetails) => GuestDetails) => void;
  stay: StayDetails;
  room: Room | null;
  errors: Partial<Record<keyof GuestDetails, string>>;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

export function GuestDetailsForm({ guest, setGuest, stay, room, errors, submitting, onBack, onSubmit }: Props) {
  return (
    <div>
      <button type="button" onClick={onBack} className="mb-3.5 flex items-center gap-1 text-xs text-stone hover:text-gold-bright">
        <ChevronLeft size={14} /> Back to rooms
      </button>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-xl">Your details</h2>
          <p className="mb-5 mt-1 text-sm text-stone">
            We&apos;ll use this to confirm your stay request with the hotel team.
          </p>

          <Field label="Full name" error={errors.fullName}>
            <input
              placeholder="As on your ID"
              value={guest.fullName}
              onChange={(e) => setGuest((g) => ({ ...g, fullName: e.target.value }))}
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label="Mobile number" error={errors.mobile}>
              <input
                placeholder="98xxxxxxxx"
                value={guest.mobile}
                onChange={(e) => setGuest((g) => ({ ...g, mobile: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                placeholder="you@example.com"
                value={guest.email}
                onChange={(e) => setGuest((g) => ({ ...g, email: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Special requests" optional>
            <textarea
              rows={3}
              placeholder="Early check-in, high floor, airport pickup..."
              value={guest.specialRequests}
              onChange={(e) => setGuest((g) => ({ ...g, specialRequests: e.target.value }))}
              className={`${inputClass} resize-y`}
            />
          </Field>

          <button
            type="button"
            disabled={submitting}
            onClick={onSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-gold-bright to-gold py-3 text-sm font-semibold text-ink disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending request…
              </>
            ) : (
              <>
                Continue booking request <ChevronRight size={16} />
              </>
            )}
          </button>
          <p className="mt-2.5 text-[11.5px] leading-relaxed text-stone">
            This sends a stay request to the hotel team — it does not create a confirmed reservation. The
            hotel will confirm availability and next steps.
          </p>
        </div>
        <BookingSummary stay={stay} room={room} />
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-surface-raised bg-surface px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none";

function Field({
  label, error, optional, children,
}: { label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs text-stone">
        {label} {optional && <span className="text-stone">(optional)</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
