// tailwind.config.snippet.js
//
// Merge this `theme.extend` block into the existing site's tailwind.config.js
// so the booking flow components (which use classes like `bg-ink`,
// `text-gold`, `font-display`) resolve correctly. Token values are a
// starting point derived from the brief's "dark/luxury, gold accents"
// direction — swap for exact brand hex values if the hotel's design team
// supplies them.

module.exports = {
  theme: {
    extend: {
      colors: {
        ink: "#15110c",
        surface: "#1f1811",
        "surface-raised": "#2a2118",
        gold: { DEFAULT: "#c6a15b", bright: "#e3c583", dim: "#8a703f" },
        cream: "#f6f0e4",
        stone: "#b9ae9a",
        ivory: "#fbf7ef",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
};
