// data/rooms.ts
//
// MOCK DATA — for prototype/demo purposes only.
//
// Room names and hotel-wide amenities below are taken from the hotel's own
// live site. Per-room-type pricing and exact occupancy were not supplied by
// the audit or by the hotel, so they are intentionally left out rather than
// invented — see `priceNote` and `capacityNote`. Replace this file's export
// with a real fetch from a PMS/channel manager when one is connected; every
// component below only depends on the `Room` shape, not on this being
// static data.

export type Amenity = { id: string; label: string };

export type Room = {
  id: string;
  name: string;
  image: string;
  description: string;
  amenities: Amenity[];
  /** Set only when the hotel provides a reliable, current rate. */
  price: number | null;
  priceNote: string;
  /** Exact per-type occupancy wasn't in the source material — surface this
   *  note in the UI instead of guessing a number. */
  capacityNote: string;
};

const sharedAmenities: Amenity[] = [
  { id: "wifi", label: "High-speed Wi-Fi" },
  { id: "tv", label: "Flat-screen TV" },
  { id: "minibar", label: "Minibar" },
  { id: "safe", label: "In-room safe" },
  { id: "toiletries", label: "Toiletries" },
  { id: "breakfast", label: "Breakfast available" },
];

export const mockRooms: Room[] = [
  {
    id: "standard",
    name: "Standard Rooms",
    image: "/images/rooms/standard-room.jpeg",
    description:
      "A comfortable, well-appointed base category with everything needed for a relaxed stay in central Ahmedabad.",
    amenities: sharedAmenities,
    price: null,
    priceNote: "Contact hotel for best available rate",
    capacityNote: "Occupancy to be confirmed with hotel",
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    image: "/images/rooms/deluxe-room.jpeg",
    description:
      "Comfort and elegance designed with both luxury and functionality in mind — a serene retreat for business and leisure travellers alike.",
    amenities: sharedAmenities,
    price: null,
    priceNote: "Contact hotel for best available rate",
    capacityNote: "Occupancy to be confirmed with hotel",
  },
  {
    id: "superior",
    name: "Superior Rooms",
    image: "/images/rooms/superior-rooms.jpeg",
    description:
      "The most spacious category on offer, for guests who want extra room to unwind after a day in the city.",
    amenities: sharedAmenities,
    price: null,
    priceNote: "Contact hotel for best available rate",
    capacityNote: "Occupancy to be confirmed with hotel",
  },
];
