# Hotel Rudra Regency — booking experience prototype

Concept prototype for a working "Book Your Stay" flow, built against the
website audit findings. This is **not** a production booking system — see
"What's mocked" below.

## Files

```
config/hotel.ts              Hotel name, address, contact numbers, WhatsApp constant
data/rooms.ts                Mock room catalogue (real room names/images, no invented prices)
services/bookingService.ts   checkAvailability() / submitBookingRequest() — swap bodies for real calls
components/
  BookingModal.tsx            Owns state + step transitions. Mount as a /book page or inside a modal.
  BookingProgress.tsx          1 → 2 → 3 → 4 stepper
  StayDetailsForm.tsx          Step 1: dates, adults, children, rooms
  RoomSelection.tsx            Step 2: loading skeleton + room cards
  GuestDetailsForm.tsx         Step 3: guest form + live summary
  BookingConfirmation.tsx      Step 4: reference, call/WhatsApp fallback
  BookingSummary.tsx           Shared summary card (used in steps 3 and 4)
tailwind.config.snippet.js    Merge into the site's real tailwind.config.js
```

## Using it

```tsx
// As a dedicated page: app/book/page.tsx
import { BookingModal } from "@/components/BookingModal";
export default function BookPage() {
  return <main className="p-4 sm:p-10"><BookingModal /></main>;
}
```

```tsx
// As a modal triggered from the existing "Book Now" button
{isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <BookingModal />
  </div>
)}
```

## What's mocked (by design, per the brief)

- **Availability** — `bookingService.checkAvailability()` always returns the
  full mock catalogue after a simulated delay. No PMS/channel manager is
  connected yet (the audit flags this as unknown — confirm with the hotel
  first, to avoid double-bookings if one is added later).
- **Pricing** — no room shows a number. `priceNote` reads "Contact hotel for
  best available rate" because no reliable rate was supplied.
- **Occupancy** — `capacityNote` reads "to be confirmed with hotel" rather
  than a guessed per-room-type number.
- **Submission** — `bookingService.submitBookingRequest()` generates a local
  reference only. It does not call any backend yet. The natural next step is
  wiring it to the hotel's existing enquiry mechanism (already confirmed
  working, per audit finding #4) with dates/room pre-filled.
- **WhatsApp** — `hotelConfig.whatsappNumber` reads from
  `NEXT_PUBLIC_HOTEL_WHATSAPP_NUMBER` and is empty until the hotel confirms
  a real, WhatsApp-reachable number. Until then the button shows an inline
  notice instead of linking to an unverified number — deliberately avoiding
  the mistake flagged in audit finding #2.
- **No payment gateway, no login, no admin dashboard** — out of scope per
  the brief.

## Turning this into production

1. Confirm with the hotel: PMS/channel-manager status, correct WhatsApp
   number, real room-type pricing (if they want it shown), and exact
   per-room-type occupancy.
2. Point `checkAvailability()` at a real inventory source (PMS, channel
   manager, or a third-party booking-engine API).
3. Point `submitBookingRequest()` at the hotel's existing enquiry backend
   (fastest path — no new backend needed) or a booking-engine API if one is
   added.
4. Set `NEXT_PUBLIC_HOTEL_WHATSAPP_NUMBER` once the hotel confirms it.
5. Replace `logoUrl` / room `image` paths with the hotel's own hosted
   assets once integrated into the real site (this prototype references the
   hotel's live images directly for the demo).
