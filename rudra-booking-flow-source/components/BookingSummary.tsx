// components/BookingSummary.tsx
import type { StayDetails } from "../services/bookingService";
import type { Room } from "../data/rooms";

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const nightsBetween = (inD: string, outD: string) => {
  if (!inD || !outD) return 0;
  const ms = new Date(outD).getTime() - new Date(inD).getTime();
  return Math.max(0, Math.round(ms / 86400000));
};

export function BookingSummary({ stay, room }: { stay: StayDetails; room: Room | null }) {
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  const rows: [string, string][] = [
    ["Check-in", formatDate(stay.checkIn)],
    ["Check-out", formatDate(stay.checkOut)],
    ["Nights", String(nights)],
    [
      "Guests",
      `${stay.adults} adult${stay.adults > 1 ? "s" : ""}${
        stay.children > 0 ? `, ${stay.children} child${stay.children > 1 ? "ren" : ""}` : ""
      }`,
    ],
    ["Rooms", String(stay.roomsCount)],
    ["Room type", room ? room.name : "—"],
  ];

  return (
    <div className="rounded-xl bg-ivory p-5 text-[#241c12]">
      <h3 className="font-display text-base">Your request</h3>
      <div className="my-3 border-t border-dashed border-gold-dim" />
      <dl className="flex flex-col gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <dt className="text-[#6b6152]">{label}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
