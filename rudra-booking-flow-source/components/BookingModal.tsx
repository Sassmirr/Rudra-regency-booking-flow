// components/BookingModal.tsx
//
// This component owns the booking flow's state and step transitions. It has
// no opinion on how it's mounted — use it directly on a dedicated /book
// page, or drop it inside an overlay/dialog wrapper for a "Book Now" modal
// triggered from the existing site. Either way, this file doesn't change.
//
// Usage as a page:      <BookingModal />
// Usage as a modal:      {isOpen && <Overlay onClose={close}><BookingModal /></Overlay>}

import { useCallback, useState } from "react";
import { Sparkles, MapPin, Mail } from "lucide-react";
import { hotelConfig } from "../config/hotel";
import { bookingService, StayDetails, GuestDetails } from "../services/bookingService";
import type { Room } from "../data/rooms";
import { BookingProgress } from "./BookingProgress";
import { StayDetailsForm } from "./StayDetailsForm";
import { RoomSelection } from "./RoomSelection";
import { GuestDetailsForm } from "./GuestDetailsForm";
import { BookingConfirmation } from "./BookingConfirmation";

const todayISO = () => new Date().toISOString().split("T")[0];
const addDaysISO = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidMobile = (v: string) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.trim());

const emptyStay: StayDetails = { checkIn: todayISO(), checkOut: addDaysISO(todayISO(), 1), adults: 2, children: 0, roomsCount: 1 };
const emptyGuest: GuestDetails = { fullName: "", mobile: "", email: "", specialRequests: "" };

export function BookingModal() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [stay, setStay] = useState<StayDetails>(emptyStay);
  const [guest, setGuest] = useState<GuestDetails>(emptyGuest);
  const [stayErrors, setStayErrors] = useState<Partial<Record<keyof StayDetails, string>>>({});
  const [guestErrors, setGuestErrors] = useState<Partial<Record<keyof GuestDetails, string>>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [whatsappNotice, setWhatsappNotice] = useState("");

  const validateStay = useCallback(() => {
    const e: typeof stayErrors = {};
    if (!stay.checkIn) e.checkIn = "Pick a check-in date.";
    if (!stay.checkOut) e.checkOut = "Pick a check-out date.";
    if (stay.checkIn && stay.checkIn < todayISO()) e.checkIn = "Check-in can't be in the past.";
    if (stay.checkIn && stay.checkOut && stay.checkOut <= stay.checkIn) e.checkOut = "Check-out must be after check-in.";
    setStayErrors(e);
    return Object.keys(e).length === 0;
  }, [stay]);

  const validateGuest = useCallback(() => {
    const e: typeof guestErrors = {};
    if (!guest.fullName.trim()) e.fullName = "Enter your full name.";
    if (!guest.mobile.trim()) e.mobile = "Enter a mobile number.";
    else if (!isValidMobile(guest.mobile)) e.mobile = "Enter a valid 10-digit mobile number.";
    if (!guest.email.trim()) e.email = "Enter an email address.";
    else if (!isValidEmail(guest.email)) e.email = "Enter a valid email address.";
    setGuestErrors(e);
    return Object.keys(e).length === 0;
  }, [guest]);

  const handleCheckAvailability = async () => {
    if (!validateStay()) return;
    setLoadingAvailability(true);
    setStep(2);
    const result = await bookingService.checkAvailability(stay);
    setRooms(result);
    setLoadingAvailability(false);
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setStep(3);
  };

  const handleSubmitRequest = async () => {
    if (!validateGuest() || !selectedRoom) return;
    setSubmitting(true);
    const result = await bookingService.submitBookingRequest({ stay, guest, room: selectedRoom });
    setReference(result.reference);
    setSubmitting(false);
    setStep(4);
  };

  const handleWhatsapp = () => {
    if (!hotelConfig.whatsappVerified) {
      setWhatsappNotice(
        "WhatsApp number pending verification with the hotel — this button will link straight to WhatsApp once confirmed."
      );
      return;
    }
    window.open(`https://wa.me/${hotelConfig.whatsappNumber}`, "_blank");
  };

  const handleReset = () => {
    setStep(1);
    setStay(emptyStay);
    setGuest(emptyGuest);
    setSelectedRoom(null);
    setReference("");
    setWhatsappNotice("");
  };

  return (
    <div className="mx-auto max-w-[920px] overflow-hidden rounded-2xl border border-surface-raised bg-ink font-body text-cream">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-raised px-6 py-5">
        <div className="flex items-center gap-3">
          <img src={hotelConfig.logoUrl} alt="" className="h-9 w-auto" onError={(e) => ((e.target as HTMLElement).style.display = "none")} />
          <div>
            <div className="font-display text-lg">{hotelConfig.name}</div>
            <div className="text-xs text-stone">Book your stay · {hotelConfig.city}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-gold-dim bg-surface-raised px-2.5 py-1 text-[11px] text-gold-bright">
          <Sparkles size={12} /> Concept prototype — booking experience demo
        </div>
      </div>

      <BookingProgress step={step} />

      <div className="p-6">
        {step === 1 && (
          <StayDetailsForm stay={stay} setStay={setStay} errors={stayErrors} onCheckAvailability={handleCheckAvailability} />
        )}
        {step === 2 && (
          <RoomSelection loading={loadingAvailability} rooms={rooms} onSelectRoom={handleSelectRoom} onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <GuestDetailsForm
            guest={guest} setGuest={setGuest} stay={stay} room={selectedRoom}
            errors={guestErrors} submitting={submitting}
            onBack={() => setStep(2)} onSubmit={handleSubmitRequest}
          />
        )}
        {step === 4 && (
          <BookingConfirmation
            reference={reference} stay={stay} room={selectedRoom}
            whatsappNotice={whatsappNotice} onWhatsapp={handleWhatsapp} onReset={handleReset}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-raised px-6 py-3.5 text-[11.5px] text-stone">
        <span className="flex items-center gap-1.5"><MapPin size={12} /> {hotelConfig.address}</span>
        <span className="flex items-center gap-1.5"><Mail size={12} /> {hotelConfig.email} · {hotelConfig.phone}</span>
      </div>
    </div>
  );
}
