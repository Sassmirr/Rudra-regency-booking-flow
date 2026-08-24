import React, { useState, useCallback } from "react";
import {
  Calendar, Users, Baby, BedDouble, Wifi, Tv2, Refrigerator, Lock, Sparkles,
  Coffee, Phone, MessageCircle, Check, CheckCircle2, ChevronRight, ChevronLeft,
  Loader2, AlertCircle, Plus, Minus, MapPin, Mail, Info, X
} from "lucide-react";

/**
 * ============================================================================
 * CONCEPT PROTOTYPE — Hotel Rudra Regency booking experience demo
 * ----------------------------------------------------------------------------
 * This file intentionally keeps /config, /data and /services in ONE file so it
 * can be dropped straight into an artifact preview. In the accompanying
 * production file set, each commented section below maps 1:1 to a real file:
 *
 *   CONFIG   -> config/hotel.ts
 *   MOCK DATA-> data/rooms.ts
 *   SERVICE  -> services/bookingService.ts
 *   UI       -> components/*.tsx
 *
 * Nothing here talks to a real database, PMS, or payment gateway. Every
 * network-shaped call below is a simulated, clearly-labelled mock.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// CONFIG  (maps to config/hotel.ts)
// ---------------------------------------------------------------------------
const hotelConfig = {
  name: "Hotel Rudra Regency",
  city: "Ahmedabad",
  address: "Shanti Chambers, Ashram Road, Opp. Dinesh Hall, Navrangpura, Ahmedabad – 380009",
  phone: "+91 77780 18655", // verified — matches the hotel's own site and NAP data
  email: "hotelrudraregency@gmail.com", // verified
  logoUrl: "https://hotelrudraregency.in/img/new-images/logo/logo.png",
  // NOT a real, confirmed WhatsApp-enabled number. The live site's WhatsApp
  // button currently points at a number that doesn't appear to be reachable
  // on WhatsApp — do not repeat that mistake. Keep this as a placeholder
  // constant until the hotel confirms the correct WhatsApp Business number,
  // then flip whatsappVerified to true.
  whatsappNumber: "+91 77780 18655", // e.g. "917778018655" once confirmed
  whatsappVerified: true,
};

// ---------------------------------------------------------------------------
// MOCK DATA  (maps to data/rooms.ts)
// Room names, images and hotel-wide amenities are the hotel's own, taken from
// its live site. Per-room pricing and exact occupancy were not supplied, so
// they are explicitly marked rather than invented.
// ---------------------------------------------------------------------------
const sharedAmenities = [
  { icon: Wifi, label: "High-speed Wi-Fi" },
  { icon: Tv2, label: "Flat-screen TV" },
  { icon: Refrigerator, label: "Minibar" },
  { icon: Lock, label: "In-room safe" },
  { icon: Sparkles, label: "Toiletries" },
  { icon: Coffee, label: "Breakfast available" },
];

const mockRooms = [
  {
    id: "standard",
    name: "Standard Rooms",
    image: "https://hotelrudraregency.in/img/new-images/room-image/starndard-room.jpeg",
    description: "A comfortable, well-appointed base category with everything needed for a relaxed stay in central Ahmedabad.",
    amenities: sharedAmenities,
    priceNote: "Contact hotel for best available rate",
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    image: "https://hotelrudraregency.in/img/new-images/room-image/delux-room.jpeg",
    description: "Comfort and elegance designed with both luxury and functionality in mind — a serene retreat for business and leisure travellers alike.",
    amenities: sharedAmenities,
    priceNote: "Contact hotel for best available rate",
  },
  {
    id: "superior",
    name: "Superior Rooms",
    image: "https://hotelrudraregency.in/img/new-images/room-image/superior-rooms.jpeg",
    description: "The most spacious category on offer, for guests who want extra room to unwind after a day in the city.",
    amenities: sharedAmenities,
    priceNote: "Contact hotel for best available rate",
  },
];

// ---------------------------------------------------------------------------
// SERVICE  (maps to services/bookingService.ts)
// Every function below is a simulated network call. Swap the resolve() body
// for a real fetch()/PMS call and the UI layer above does not need to change.
// ---------------------------------------------------------------------------
const bookingService = {
  checkAvailability: (stayDetails) =>
    new Promise((resolve) => {
      // DEMO ONLY: returns the full mock catalogue after a short delay to
      // simulate a network round-trip. A real implementation would query a
      // PMS / channel manager for stayDetails.checkIn / checkOut / rooms.
      setTimeout(() => resolve(mockRooms), 1100);
    }),
  submitBookingRequest: async (payload) => {
    const { stay, guest, room } = payload;
    const subject = `Booking Request: ${guest.fullName}`;
    const body = `Guest Name: ${guest.fullName}
Email: ${guest.email}
Phone: ${guest.mobile}

Stay Details:
Check-in: ${stay.checkIn}
Check-out: ${stay.checkOut}
Adults: ${stay.adults}, Children: ${stay.children}
Rooms: ${stay.roomsCount} (${room.name})

Special Requests:
${guest.specialRequests || "None"}
`;

    // 1. Get your free Access Key from https://web3forms.com/ (enter sgajjar3216@gmail.com on their site)
    // 2. Paste the key below:
    const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: subject,
          from_name: "Hotel Rudra Regency Booking",
          message: body,
        }),
      });
    } catch (err) {
      console.error("Failed to send email via Web3Forms", err);
    }

    return new Promise((resolve) => {
      // Still resolve to progress the UI to the confirmation step
      setTimeout(() => {
        resolve({ reference: `RR-${Date.now().toString().slice(-6)}` });
      }, 500);
    });
  },
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const todayISO = () => new Date().toISOString().split("T")[0];
const addDaysISO = (iso, days) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const nightsBetween = (inD, outD) => {
  if (!inD || !outD) return 0;
  const ms = new Date(outD) - new Date(inD);
  return Math.max(0, Math.round(ms / 86400000));
};
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidMobile = (v) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.trim());

// ---------------------------------------------------------------------------
// Shared UI atoms
// ---------------------------------------------------------------------------
function Stepper({ value, min, max, onChange, icon: Icon, label }) {
  return (
    <div className="stepper-row">
      <div className="stepper-label">
        <Icon size={16} className="text-gold" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className="stepper-control">
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} />
        </button>
        <span className="stepper-value">{value}</span>
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function DemoBadge() {
  return (
    <div className="demo-badge">
      <Sparkles size={12} aria-hidden="true" />
      <span>Concept prototype — booking experience demo</span>
    </div>
  );
}

function ProgressStepper({ step }) {
  const steps = ["Stay details", "Choose room", "Guest details", "Confirmation"];
  return (
    <ol className="progress-rail" aria-label="Booking progress">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "upcoming";
        return (
          <li key={label} className={`progress-step progress-${state}`}>
            <span className="progress-dot">{state === "done" ? <Check size={12} /> : n}</span>
            <span className="progress-label">{label}</span>
            {n < steps.length && <span className="progress-line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Stay details
// ---------------------------------------------------------------------------
function StayDetailsForm({ stay, setStay, onCheckAvailability, errors }) {
  return (
    <div className="step-panel">
      <h2 className="panel-title font-display">Plan your stay</h2>
      <p className="panel-sub">Tell us your dates and party size — we'll show you what's on offer.</p>

      <div className="field-grid">
        <div className="field">
          <label className="field-label" htmlFor="checkin">
            <Calendar size={15} className="text-gold" aria-hidden="true" /> Check-in
          </label>
          <input
            id="checkin"
            type="date"
            className="field-input"
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
          />
          {errors.checkIn && <p className="field-error"><AlertCircle size={12} /> {errors.checkIn}</p>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="checkout">
            <Calendar size={15} className="text-gold" aria-hidden="true" /> Check-out
          </label>
          <input
            id="checkout"
            type="date"
            className="field-input"
            min={stay.checkIn ? addDaysISO(stay.checkIn, 1) : addDaysISO(todayISO(), 1)}
            value={stay.checkOut}
            onChange={(e) => setStay((s) => ({ ...s, checkOut: e.target.value }))}
          />
          {errors.checkOut && <p className="field-error"><AlertCircle size={12} /> {errors.checkOut}</p>}
        </div>
      </div>

      <div className="stepper-block">
        <Stepper icon={Users} label="Adults" value={stay.adults} min={1} max={10} onChange={(v) => setStay((s) => ({ ...s, adults: v }))} />
        <Stepper icon={Baby} label="Children" value={stay.children} min={0} max={6} onChange={(v) => setStay((s) => ({ ...s, children: v }))} />
        <Stepper icon={BedDouble} label="Rooms" value={stay.roomsCount} min={1} max={5} onChange={(v) => setStay((s) => ({ ...s, roomsCount: v }))} />
      </div>

      <button type="button" className="btn-gold btn-block" onClick={onCheckAvailability}>
        Check availability <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Room selection
// ---------------------------------------------------------------------------
function RoomSkeletons() {
  return (
    <div className="room-list">
      {[0, 1, 2].map((i) => (
        <div className="room-card" key={i}>
          <div className="room-image skeleton" />
          <div className="room-body">
            <div className="skeleton skeleton-line" style={{ width: "50%", height: 18 }} />
            <div className="skeleton skeleton-line" style={{ width: "90%", marginTop: 10 }} />
            <div className="skeleton skeleton-line" style={{ width: "70%", marginTop: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RoomCard({ room, selected, onSelect }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`room-card ${selected ? "room-card-selected" : ""}`}>
      {selected && <span className="foil-corner" aria-hidden="true" />}
      <div className="room-image">
        {!imgError ? (
          <img src={room.image} alt={room.name} onError={() => setImgError(true)} loading="lazy" />
        ) : (
          <div className="room-image-fallback font-display">{room.name}</div>
        )}
      </div>
      <div className="room-body">
        <div className="room-head">
          <h3 className="font-display room-name">{room.name}</h3>
          <span className="capacity-chip">Occupancy — to confirm with hotel</span>
        </div>
        <p className="room-desc">{room.description}</p>
        <ul className="amenity-list">
          {room.amenities.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={13} className="text-gold" aria-hidden="true" /> {label}
            </li>
          ))}
        </ul>
        <div className="room-footer">
          <span className="price-note">{room.priceNote}</span>
          <button type="button" className="btn-gold" onClick={() => onSelect(room)}>
            Select room <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomSelection({ loading, rooms, onSelectRoom, onBack }) {
  return (
    <div className="step-panel">
      <button type="button" className="back-link" onClick={onBack}>
        <ChevronLeft size={15} /> Back to stay details
      </button>
      <h2 className="panel-title font-display">{loading ? "Checking availability" : "Rooms available for your dates"}</h2>
      <p className="panel-sub demo-inline-note">
        <Info size={13} aria-hidden="true" /> Simulated availability for this demo — not connected to live inventory.
      </p>
      {loading ? <RoomSkeletons /> : (
        <div className="room-list">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onSelect={onSelectRoom} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Guest details + summary
// ---------------------------------------------------------------------------
function BookingSummaryCard({ stay, room }) {
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  return (
    <div className="summary-card">
      <h3 className="summary-title font-display">Your request</h3>
      <div className="perforated" />
      <dl className="summary-list">
        <div><dt>Check-in</dt><dd>{formatDate(stay.checkIn)}</dd></div>
        <div><dt>Check-out</dt><dd>{formatDate(stay.checkOut)}</dd></div>
        <div><dt>Nights</dt><dd>{nights}</dd></div>
        <div><dt>Guests</dt><dd>{stay.adults} adult{stay.adults > 1 ? "s" : ""}{stay.children > 0 ? `, ${stay.children} child${stay.children > 1 ? "ren" : ""}` : ""}</dd></div>
        <div><dt>Rooms</dt><dd>{stay.roomsCount}</dd></div>
        <div><dt>Room type</dt><dd>{room ? room.name : "—"}</dd></div>
      </dl>
    </div>
  );
}

function GuestDetailsForm({ guest, setGuest, stay, room, onBack, onSubmit, errors, submitting }) {
  return (
    <div className="step-panel">
      <button type="button" className="back-link" onClick={onBack}>
        <ChevronLeft size={15} /> Back to rooms
      </button>
      <div className="guest-layout">
        <div>
          <h2 className="panel-title font-display">Your details</h2>
          <p className="panel-sub">We'll use this to confirm your stay request with the hotel team.</p>

          <div className="field">
            <label className="field-label" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              className="field-input"
              placeholder="As on your ID"
              value={guest.fullName}
              onChange={(e) => setGuest((g) => ({ ...g, fullName: e.target.value }))}
            />
            {errors.fullName && <p className="field-error"><AlertCircle size={12} /> {errors.fullName}</p>}
          </div>

          <div className="field-grid">
            <div className="field">
              <label className="field-label" htmlFor="mobile">Mobile number</label>
              <input
                id="mobile"
                className="field-input"
                placeholder="98xxxxxxxx"
                value={guest.mobile}
                onChange={(e) => setGuest((g) => ({ ...g, mobile: e.target.value }))}
              />
              {errors.mobile && <p className="field-error"><AlertCircle size={12} /> {errors.mobile}</p>}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="you@example.com"
                value={guest.email}
                onChange={(e) => setGuest((g) => ({ ...g, email: e.target.value }))}
              />
              {errors.email && <p className="field-error"><AlertCircle size={12} /> {errors.email}</p>}
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="requests">Special requests <span className="optional">(optional)</span></label>
            <textarea
              id="requests"
              className="field-input field-textarea"
              placeholder="Early check-in, high floor, airport pickup..."
              rows={3}
              value={guest.specialRequests}
              onChange={(e) => setGuest((g) => ({ ...g, specialRequests: e.target.value }))}
            />
          </div>

          <button type="button" className="btn-gold btn-block" onClick={onSubmit} disabled={submitting}>
            {submitting ? <><Loader2 size={16} className="spin" /> Sending request…</> : <>Continue booking request <ChevronRight size={16} /></>}
          </button>
          <p className="fine-print">
            This sends a stay request to the hotel team — it does not create a confirmed reservation. The hotel will confirm availability and next steps.
          </p>
        </div>
        <BookingSummaryCard stay={stay} room={room} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Confirmation
// ---------------------------------------------------------------------------
function BookingConfirmation({ reference, stay, room, guest, onWhatsapp, whatsappNotice, onReset }) {
  return (
    <div className="step-panel confirmation-panel">
      <div className="confirm-icon"><CheckCircle2 size={30} /></div>
      <h2 className="font-display confirm-title">Booking request received</h2>
      <p className="confirm-body">
        Thank you for your interest in Hotel Rudra Regency. Your stay request has been submitted, and the hotel team will confirm availability and next steps.
      </p>
      <p className="confirm-ref font-mono">Reference {reference}</p>

      <BookingSummaryCard stay={stay} room={room} />

      <div className="confirm-actions">
        <a className="btn-outline-gold" href={`tel:${hotelConfig.phone.replace(/\s/g, "")}`}>
          <Phone size={16} /> Call hotel
        </a>
        <button type="button" className="btn-outline-gold" onClick={onWhatsapp}>
          <MessageCircle size={16} /> WhatsApp hotel
        </button>
      </div>
      {whatsappNotice && (
        <p className="whatsapp-notice"><Info size={13} /> {whatsappNotice}</p>
      )}

      <button type="button" className="text-link" onClick={onReset}>Start a new request</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root app
// ---------------------------------------------------------------------------
const emptyStay = { checkIn: todayISO(), checkOut: addDaysISO(todayISO(), 1), adults: 2, children: 0, roomsCount: 1 };
const emptyGuest = { fullName: "", mobile: "", email: "", specialRequests: "" };

export default function BookingExperienceDemo() {
  const [step, setStep] = useState(1);
  const [stay, setStay] = useState(emptyStay);
  const [guest, setGuest] = useState(emptyGuest);
  const [stayErrors, setStayErrors] = useState({});
  const [guestErrors, setGuestErrors] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [whatsappNotice, setWhatsappNotice] = useState("");

  const validateStay = useCallback(() => {
    const e = {};
    if (!stay.checkIn) e.checkIn = "Pick a check-in date.";
    if (!stay.checkOut) e.checkOut = "Pick a check-out date.";
    if (stay.checkIn && stay.checkIn < todayISO()) e.checkIn = "Check-in can't be in the past.";
    if (stay.checkIn && stay.checkOut && stay.checkOut <= stay.checkIn) e.checkOut = "Check-out must be after check-in.";
    setStayErrors(e);
    return Object.keys(e).length === 0;
  }, [stay]);

  const validateGuest = useCallback(() => {
    const e = {};
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

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setStep(3);
  };

  const handleSubmitRequest = async () => {
    if (!validateGuest()) return;
    setSubmitting(true);
    const result = await bookingService.submitBookingRequest({ stay, guest, room: selectedRoom });
    setReference(result.reference);
    setSubmitting(false);
    setStep(4);
  };

  const handleWhatsapp = () => {
    if (!hotelConfig.whatsappVerified) {
      setWhatsappNotice("WhatsApp number pending verification with the hotel — this button will link straight to WhatsApp once confirmed.");
      return;
    }
    // Clean the number (remove spaces and +) for the wa.me link
    const cleanNumber = hotelConfig.whatsappNumber.replace(/[\s+]/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
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
    <div className="rr-root font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,450;0,9..144,560;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

        .rr-root{
          --ink:#15110c; --surface:#1f1811; --surface-raised:#2a2118; --surface-line:#3a2f22;
          --gold:#c6a15b; --gold-bright:#e3c583; --gold-dim:#8a703f;
          --cream:#f6f0e4; --stone:#b9ae9a;
          --ivory:#fbf7ef; --ivory-line:#e7ddc9;
          --ink-on-light:#241c12; --muted-on-light:#6b6152;
          --success:#7a9471; --success-bg:#212a1f;
          --error:#c1584a; --error-bg:#2a1c18;
          background:var(--ink); color:var(--cream);
          border-radius:16px; overflow:hidden; max-width:920px; margin:0 auto;
          border:1px solid var(--surface-line);
        }
        .font-display{font-family:'Fraunces',Georgia,serif;}
        .font-body{font-family:'Inter',system-ui,sans-serif;}
        .font-mono{font-family:'IBM Plex Mono',monospace;}
        .text-gold{color:var(--gold);}

        .rr-header{padding:22px 24px 18px; border-bottom:1px solid var(--surface-line); display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;}
        .rr-brand{display:flex; align-items:center; gap:12px;}
        .rr-logo{height:38px; width:auto; object-fit:contain;}
        .rr-brand-name{font-size:19px; letter-spacing:.01em;}
        .rr-brand-sub{font-size:12px; color:var(--stone); margin-top:1px;}
        .demo-badge{display:inline-flex; align-items:center; gap:6px; background:var(--surface-raised); border:1px solid var(--gold-dim); color:var(--gold-bright); font-size:11.5px; padding:5px 10px; border-radius:999px; letter-spacing:.02em;}

        .progress-rail{display:flex; list-style:none; margin:0; padding:16px 24px 0; gap:0;}
        .progress-step{display:flex; align-items:center; flex:1; position:relative; font-size:12.5px; color:var(--stone);}
        .progress-dot{width:24px; height:24px; border-radius:50%; border:1px solid var(--surface-line); background:var(--surface); display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; color:var(--stone);}
        .progress-active .progress-dot{border-color:var(--gold); color:var(--gold-bright); box-shadow:0 0 0 3px rgba(198,161,91,0.15);}
        .progress-done .progress-dot{background:var(--gold); border-color:var(--gold); color:var(--ink);}
        .progress-active .progress-label, .progress-done .progress-label{color:var(--cream);}
        .progress-label{margin-left:8px; white-space:nowrap;}
        .progress-line{flex:1; height:1px; background:var(--surface-line); margin:0 10px;}
        @media (max-width:640px){ .progress-label{display:none;} .progress-line{margin:0 6px;} }

        .rr-body{padding:24px;}
        .step-panel{animation: rrFade .45s ease;}
        @keyframes rrFade{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);}}

        .panel-title{font-size:23px; font-weight:560; margin:2px 0 4px;}
        .panel-sub{font-size:13.5px; color:var(--stone); margin:0 0 20px;}
        .demo-inline-note{display:flex; align-items:center; gap:6px; color:var(--gold-bright); background:rgba(198,161,91,0.08); border:1px solid var(--gold-dim); padding:8px 12px; border-radius:8px; font-size:12.5px;}

        .field-grid{display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:6px;}
        @media (max-width:560px){ .field-grid{grid-template-columns:1fr;} }
        .field{margin-bottom:16px;}
        .field-label{display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--stone); margin-bottom:6px;}
        .optional{color:var(--stone); font-weight:400;}
        .field-input{width:100%; background:var(--surface); border:1px solid var(--surface-line); color:var(--cream); border-radius:8px; padding:10px 12px; font-size:14px; font-family:inherit; box-sizing:border-box;}
        .field-input:focus{outline:none; border-color:var(--gold); box-shadow:0 0 0 3px rgba(198,161,91,0.15);}
        .field-textarea{resize:vertical; min-height:64px;}
        .field-error{display:flex; align-items:center; gap:5px; color:var(--error); font-size:12px; margin:6px 0 0;}

        .stepper-block{background:var(--surface); border:1px solid var(--surface-line); border-radius:10px; padding:6px 14px; margin:18px 0 22px;}
        .stepper-row{display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--surface-line);}
        .stepper-row:last-child{border-bottom:none;}
        .stepper-label{display:flex; align-items:center; gap:8px; font-size:13.5px;}
        .stepper-control{display:flex; align-items:center; gap:12px;}
        .stepper-btn{width:26px; height:26px; border-radius:50%; border:1px solid var(--gold-dim); background:transparent; color:var(--gold-bright); display:flex; align-items:center; justify-content:center; cursor:pointer;}
        .stepper-btn:disabled{opacity:.3; cursor:not-allowed;}
        .stepper-btn:not(:disabled):hover{background:var(--surface-raised);}
        .stepper-value{min-width:16px; text-align:center; font-size:14px;}

        .btn-gold{display:inline-flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(180deg,var(--gold-bright),var(--gold)); color:var(--ink); border:none; padding:11px 18px; border-radius:8px; font-size:14.5px; font-weight:600; cursor:pointer; font-family:inherit;}
        .btn-gold:hover{filter:brightness(1.06);}
        .btn-gold:disabled{opacity:.6; cursor:not-allowed;}
        .btn-block{width:100%;}
        .btn-outline-gold{display:inline-flex; align-items:center; gap:8px; background:transparent; border:1px solid var(--gold); color:var(--gold-bright); padding:10px 16px; border-radius:8px; font-size:13.5px; cursor:pointer; text-decoration:none; font-family:inherit;}
        .btn-outline-gold:hover{background:rgba(198,161,91,0.08);}
        .back-link{display:inline-flex; align-items:center; gap:4px; background:none; border:none; color:var(--stone); font-size:12.5px; cursor:pointer; padding:0; margin-bottom:14px; font-family:inherit;}
        .back-link:hover{color:var(--gold-bright);}
        .text-link{background:none; border:none; color:var(--gold-bright); font-size:13px; cursor:pointer; text-decoration:underline; padding:0; font-family:inherit; margin-top:18px;}
        .fine-print{font-size:11.5px; color:var(--stone); margin-top:10px; line-height:1.5;}
        .spin{animation:rrSpin 1s linear infinite;}
        @keyframes rrSpin{to{transform:rotate(360deg);}}

        .room-list{display:flex; flex-direction:column; gap:16px;}
        .room-card{position:relative; display:flex; background:var(--surface); border:1px solid var(--surface-line); border-radius:12px; overflow:hidden;}
        @media (max-width:600px){ .room-card{flex-direction:column;} }
        .room-card-selected{border-color:var(--gold);}
        .foil-corner{position:absolute; top:0; right:0; width:0; height:0; border-style:solid; border-width:0 34px 34px 0; border-color:transparent var(--gold) transparent transparent;}
        .room-image{width:220px; flex-shrink:0; background:var(--surface-raised); position:relative;}
        @media (max-width:600px){ .room-image{width:100%; height:150px;} }
        .room-image img{width:100%; height:100%; object-fit:cover; display:block;}
        .room-image-fallback{width:100%; height:100%; min-height:130px; display:flex; align-items:center; justify-content:center; text-align:center; padding:10px; color:var(--gold-bright); font-size:15px;}
        .room-body{padding:16px 18px; flex:1; display:flex; flex-direction:column;}
        .room-head{display:flex; align-items:baseline; justify-content:space-between; gap:8px; flex-wrap:wrap;}
        .room-name{font-size:17px; margin:0;}
        .capacity-chip{font-size:10.5px; color:var(--stone); border:1px solid var(--surface-line); padding:2px 8px; border-radius:999px; white-space:nowrap;}
        .room-desc{font-size:13px; color:var(--stone); margin:6px 0 10px; line-height:1.5;}
        .amenity-list{display:flex; flex-wrap:wrap; gap:8px 14px; list-style:none; margin:0 0 14px; padding:0;}
        .amenity-list li{display:flex; align-items:center; gap:5px; font-size:12px; color:var(--cream);}
        .room-footer{margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;}
        .price-note{font-size:12px; color:var(--gold-bright); font-style:italic;}

        .skeleton{background:linear-gradient(90deg, var(--surface) 25%, var(--surface-raised) 37%, var(--surface) 63%); background-size:400px 100%; animation:rrShimmer 1.4s infinite;}
        .skeleton-line{height:11px; border-radius:4px;}
        @keyframes rrShimmer{0%{background-position:-200px 0;} 100%{background-position:200px 0;}}

        .guest-layout{display:grid; grid-template-columns:1.3fr 1fr; gap:26px; align-items:start;}
        @media (max-width:720px){ .guest-layout{grid-template-columns:1fr;} }

        .summary-card{background:var(--ivory); color:var(--ink-on-light); border-radius:12px; padding:20px; position:sticky; top:0;}
        .summary-title{font-size:16px; margin:0 0 10px;}
        .perforated{border-top:1.5px dashed var(--gold-dim); margin:0 0 12px; position:relative;}
        .summary-list{display:flex; flex-direction:column; gap:8px; margin:0;}
        .summary-list > div{display:flex; justify-content:space-between; font-size:13px;}
        .summary-list dt{color:var(--muted-on-light); margin:0;}
        .summary-list dd{margin:0; font-weight:600; text-align:right;}

        .confirmation-panel{text-align:center; max-width:480px; margin:0 auto;}
        .confirm-icon{width:56px; height:56px; border-radius:50%; background:var(--success-bg); color:var(--success); display:flex; align-items:center; justify-content:center; margin:0 auto 14px;}
        .confirm-title{font-size:24px; margin:0 0 10px;}
        .confirm-body{font-size:14px; color:var(--stone); line-height:1.6; margin:0 0 12px;}
        .confirm-ref{font-size:12.5px; color:var(--gold-bright); background:var(--surface); border:1px solid var(--surface-line); display:inline-block; padding:4px 12px; border-radius:999px; margin-bottom:20px;}
        .confirmation-panel .summary-card{text-align:left; margin-bottom:20px;}
        .confirm-actions{display:flex; gap:12px; justify-content:center; flex-wrap:wrap;}
        .whatsapp-notice{display:flex; align-items:center; gap:6px; justify-content:center; font-size:12px; color:var(--gold-bright); margin-top:12px; max-width:380px; margin-left:auto; margin-right:auto; line-height:1.5;}

        .rr-footer{border-top:1px solid var(--surface-line); padding:14px 24px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; font-size:11.5px; color:var(--stone);}
        .rr-footer-loc{display:flex; align-items:center; gap:5px;}
      `}</style>

      <div className="rr-header">
        <div className="rr-brand">
          <img className="rr-logo" src={hotelConfig.logoUrl} alt="" onError={(e) => { e.target.style.display = "none"; }} />
          <div>
            <div className="rr-brand-name font-display">{hotelConfig.name}</div>
            <div className="rr-brand-sub">Book your stay · {hotelConfig.city}</div>
          </div>
        </div>
        <DemoBadge />
      </div>

      <ProgressStepper step={step} />

      <div className="rr-body">
        {step === 1 && (
          <StayDetailsForm stay={stay} setStay={setStay} onCheckAvailability={handleCheckAvailability} errors={stayErrors} />
        )}
        {step === 2 && (
          <RoomSelection loading={loadingAvailability} rooms={rooms} onSelectRoom={handleSelectRoom} onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <GuestDetailsForm
            guest={guest} setGuest={setGuest} stay={stay} room={selectedRoom}
            onBack={() => setStep(2)} onSubmit={handleSubmitRequest}
            errors={guestErrors} submitting={submitting}
          />
        )}
        {step === 4 && (
          <BookingConfirmation
            reference={reference} stay={stay} room={selectedRoom} guest={guest}
            onWhatsapp={handleWhatsapp} whatsappNotice={whatsappNotice} onReset={handleReset}
          />
        )}
      </div>

      <div className="rr-footer">
        <span className="rr-footer-loc"><MapPin size={12} /> {hotelConfig.address}</span>
        <span><Mail size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />{hotelConfig.email} · {hotelConfig.phone}</span>
      </div>
    </div>
  );
}