// services/bookingService.ts
//
// Thin abstraction between the UI and "wherever booking data actually
// lives". Every function here is a simulated call for the prototype.
// Swap the body of each function for a real integration and no component
// needs to change, because they only depend on these function signatures.

import { mockRooms, Room } from "../data/rooms";

export type StayDetails = {
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  adults: number;
  children: number;
  roomsCount: number;
};

export type GuestDetails = {
  fullName: string;
  mobile: string;
  email: string;
  specialRequests: string;
};

export type BookingRequestPayload = {
  stay: StayDetails;
  guest: GuestDetails;
  room: Room;
};

export type BookingRequestResult = {
  reference: string;
};

export const bookingService = {
  /**
   * DEMO: resolves with the full mock catalogue after a short delay to
   * simulate a network round trip.
   *
   * PRODUCTION: replace with a call to the hotel's PMS / channel manager
   * (or a third-party booking-engine API — see Option B/D in the audit's
   * Section 18) passing `stay`, and return only rooms actually free for
   * those dates. If no PMS/channel manager exists yet, this can instead
   * return the static catalogue plus a `live: false` flag so the UI can
   * label pricing/availability as indicative rather than live.
   */
  async checkAvailability(stay: StayDetails): Promise<Room[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRooms), 1100);
    });
  },

  /**
   * DEMO: does not create a real reservation and does not call any
   * backend. Resolves with a locally generated reference for display only.
   *
   * PRODUCTION: POST this payload to the hotel's existing enquiry backend
   * (the client has confirmed this already works and delivers messages —
   * see audit finding #4) with dates and room type pre-filled, instead of
   * a generic contact form. If a booking engine is added later, this is
   * the function that would call it directly for instant confirmation.
   */
  async submitBookingRequest(
    payload: BookingRequestPayload
  ): Promise<BookingRequestResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ reference: `RR-${Date.now().toString().slice(-6)}` });
      }, 900);
    });
  },
};
