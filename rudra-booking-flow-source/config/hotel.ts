// config/hotel.ts
//
// Single source of truth for hotel identity, contact channels and the
// visual accent color, so nothing is duplicated across components.
//
// IMPORTANT — WhatsApp number:
// The live site's WhatsApp icon currently links to a number that does not
// match the hotel's published calling number and does not appear to be
// reachable on WhatsApp (see audit finding #2). Do NOT hardcode a real
// number here until the hotel has confirmed the correct WhatsApp Business
// number. Read it from an environment variable so it can be set per
// environment without a code change, and keep `whatsappVerified` false
// until it's confirmed.

export const hotelConfig = {
  name: "Hotel Rudra Regency",
  city: "Ahmedabad",
  address:
    "Shanti Chambers, Ashram Road, Opp. Dinesh Hall, Navrangpura, Ahmedabad – 380009",
  phone: "+91 77780 18655",
  email: "sgajjar3216@gmail.com",
  logoUrl: "/images/logo.png", // point at the hotel's own hosted logo once integrated

  // Read from env so the real number can be added later without touching code.
  whatsappNumber: process.env.NEXT_PUBLIC_HOTEL_WHATSAPP_NUMBER ?? "",
  get whatsappVerified() {
    return Boolean(this.whatsappNumber);
  },
} as const;

export type HotelConfig = typeof hotelConfig;
