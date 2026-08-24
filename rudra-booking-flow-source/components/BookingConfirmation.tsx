// components/BookingConfirmation.tsx
import { CheckCircle2, Phone, MessageCircle, Info } from "lucide-react";
import type { StayDetails } from "../services/bookingService";
import type { Room } from "../data/rooms";
import { BookingSummary } from "./BookingSummary";
import { hotelConfig } from "../config/hotel";

type Props = {
  reference: string;
  stay: StayDetails;
  room: Room | null;
  whatsappNotice: string;
  onWhatsapp: () => void;
  onReset: () => void;
};

export function BookingConfirmation({ reference, stay, room, whatsappNotice, onWhatsapp, onReset }: Props) {
  return (
    <div className="mx-auto max-w-[480px] text-center">
      <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-[#212a1f] text-[#7a9471]">
        <CheckCircle2 size={30} />
      </div>
      <h2 className="font-display text-2xl">Booking request received</h2>
      <p className="mx-auto my-3 max-w-sm text-sm leading-relaxed text-stone">
        Thank you for your interest in {hotelConfig.name}. Your stay request has been submitted, and
        the hotel team will confirm availability and next steps.
      </p>
      <p className="mb-5 inline-block rounded-full border border-surface-raised bg-surface px-3 py-1 font-mono text-xs text-gold-bright">
        Reference {reference}
      </p>

      <div className="mb-5 text-left">
        <BookingSummary stay={stay} room={room} />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <a
          href={`tel:${hotelConfig.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 rounded-lg border border-gold px-4 py-2.5 text-sm text-gold-bright hover:bg-gold/10"
        >
          <Phone size={16} /> Call hotel
        </a>
        <button
          type="button"
          onClick={onWhatsapp}
          className="flex items-center gap-2 rounded-lg border border-gold px-4 py-2.5 text-sm text-gold-bright hover:bg-gold/10"
        >
          <MessageCircle size={16} /> WhatsApp hotel
        </button>
      </div>
      {whatsappNotice && (
        <p className="mx-auto mt-3 flex max-w-sm items-center justify-center gap-1.5 text-xs leading-relaxed text-gold-bright">
          <Info size={13} /> {whatsappNotice}
        </p>
      )}

      <button type="button" onClick={onReset} className="mt-5 text-sm text-gold-bright underline">
        Start a new request
      </button>
    </div>
  );
}
