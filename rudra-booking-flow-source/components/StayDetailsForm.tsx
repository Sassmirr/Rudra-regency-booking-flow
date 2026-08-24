// components/StayDetailsForm.tsx
import { Calendar, Users, Baby, BedDouble, Plus, Minus, ChevronRight, AlertCircle } from "lucide-react";
import type { StayDetails } from "../services/bookingService";

const todayISO = () => new Date().toISOString().split("T")[0];
const addDaysISO = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

type Props = {
  stay: StayDetails;
  setStay: (updater: (s: StayDetails) => StayDetails) => void;
  errors: Partial<Record<keyof StayDetails, string>>;
  onCheckAvailability: () => void;
};

function CounterRow({
  icon: Icon, label, value, min, max, onChange,
}: { icon: any; label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-raised py-2.5 last:border-b-0">
      <div className="flex items-center gap-2 text-sm">
        <Icon size={16} className="text-gold" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gold-dim text-gold-bright disabled:opacity-30"
        >
          <Minus size={13} />
        </button>
        <span className="min-w-[16px] text-center">{value}</span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gold-dim text-gold-bright disabled:opacity-30"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

export function StayDetailsForm({ stay, setStay, errors, onCheckAvailability }: Props) {
  return (
    <div>
      <h2 className="font-display text-xl">Plan your stay</h2>
      <p className="mb-5 mt-1 text-sm text-stone">
        Tell us your dates and party size — we&apos;ll show you what&apos;s on offer.
      </p>

      <div className="mb-1 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="checkin" className="mb-1.5 flex items-center gap-1.5 text-xs text-stone">
            <Calendar size={14} className="text-gold" /> Check-in
          </label>
          <input
            id="checkin"
            type="date"
            min={todayISO()}
            value={stay.checkIn}
            onChange={(e) => {
              const checkIn = e.target.value;
              setStay((s) => ({
                ...s,
                checkIn,
                checkOut: s.checkOut && s.checkOut > checkIn ? s.checkOut : addDaysISO(checkIn, 1),
              }));
            }}
            className="w-full rounded-lg border border-surface-raised bg-surface px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
          />
          {errors.checkIn && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle size={12} /> {errors.checkIn}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="checkout" className="mb-1.5 flex items-center gap-1.5 text-xs text-stone">
            <Calendar size={14} className="text-gold" /> Check-out
          </label>
          <input
            id="checkout"
            type="date"
            min={stay.checkIn ? addDaysISO(stay.checkIn, 1) : addDaysISO(todayISO(), 1)}
            value={stay.checkOut}
            onChange={(e) => setStay((s) => ({ ...s, checkOut: e.target.value }))}
            className="w-full rounded-lg border border-surface-raised bg-surface px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
          />
          {errors.checkOut && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle size={12} /> {errors.checkOut}
            </p>
          )}
        </div>
      </div>

      <div className="my-5 rounded-xl border border-surface-raised bg-surface px-4">
        <CounterRow icon={Users} label="Adults" value={stay.adults} min={1} max={10} onChange={(v) => setStay((s) => ({ ...s, adults: v }))} />
        <CounterRow icon={Baby} label="Children" value={stay.children} min={0} max={6} onChange={(v) => setStay((s) => ({ ...s, children: v }))} />
        <CounterRow icon={BedDouble} label="Rooms" value={stay.roomsCount} min={1} max={5} onChange={(v) => setStay((s) => ({ ...s, roomsCount: v }))} />
      </div>

      <button
        type="button"
        onClick={onCheckAvailability}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-gold-bright to-gold py-3 text-sm font-semibold text-ink hover:brightness-105"
      >
        Check availability <ChevronRight size={16} />
      </button>
    </div>
  );
}
