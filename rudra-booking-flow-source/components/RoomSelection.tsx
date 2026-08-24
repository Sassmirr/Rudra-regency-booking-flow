// components/RoomSelection.tsx
import { useState } from "react";
import { Wifi, Tv2, Refrigerator, Lock, Sparkles, Coffee, ChevronRight, ChevronLeft, Info } from "lucide-react";
import type { Room } from "../data/rooms";

const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi, tv: Tv2, minibar: Refrigerator, safe: Lock, toiletries: Sparkles, breakfast: Coffee,
};

function RoomSkeletons() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex overflow-hidden rounded-xl border border-surface-raised bg-surface">
          <div className="h-[150px] w-[220px] flex-shrink-0 animate-pulse bg-surface-raised" />
          <div className="flex-1 space-y-2.5 p-4">
            <div className="h-4 w-1/3 animate-pulse rounded bg-surface-raised" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-surface-raised" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-surface-raised" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RoomCard({ room, onSelect }: { room: Room; onSelect: (r: Room) => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-surface-raised bg-surface sm:flex-row">
      <div className="h-[150px] w-full flex-shrink-0 bg-surface-raised sm:h-auto sm:w-[220px]">
        {!imgError ? (
          <img
            src={room.image}
            alt={room.name}
            onError={() => setImgError(true)}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center font-display text-gold-bright">
            {room.name}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-lg">{room.name}</h3>
          <span className="whitespace-nowrap rounded-full border border-surface-raised px-2 py-0.5 text-[10.5px] text-stone">
            {room.capacityNote}
          </span>
        </div>
        <p className="my-2 text-sm leading-relaxed text-stone">{room.description}</p>
        <ul className="mb-3 flex flex-wrap gap-x-3.5 gap-y-1.5">
          {room.amenities.map((a) => {
            const Icon = AMENITY_ICONS[a.id] ?? Sparkles;
            return (
              <li key={a.id} className="flex items-center gap-1.5 text-xs">
                <Icon size={13} className="text-gold" /> {a.label}
              </li>
            );
          })}
        </ul>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs italic text-gold-bright">{room.priceNote}</span>
          <button
            type="button"
            onClick={() => onSelect(room)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-gold-bright to-gold px-4 py-2 text-sm font-semibold text-ink hover:brightness-105"
          >
            Select room <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = {
  loading: boolean;
  rooms: Room[];
  onSelectRoom: (r: Room) => void;
  onBack: () => void;
};

export function RoomSelection({ loading, rooms, onSelectRoom, onBack }: Props) {
  return (
    <div>
      <button type="button" onClick={onBack} className="mb-3.5 flex items-center gap-1 text-xs text-stone hover:text-gold-bright">
        <ChevronLeft size={14} /> Back to stay details
      </button>
      <h2 className="font-display text-xl">
        {loading ? "Checking availability" : "Rooms available for your dates"}
      </h2>
      <p className="mb-5 mt-2 flex items-center gap-1.5 rounded-lg border border-gold-dim bg-gold/5 px-3 py-2 text-xs text-gold-bright">
        <Info size={13} /> Simulated availability for this demo — not connected to live inventory.
      </p>
      {loading ? <RoomSkeletons /> : (
        <div className="flex flex-col gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onSelect={onSelectRoom} />
          ))}
        </div>
      )}
    </div>
  );
}
