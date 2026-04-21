/* ============ EXERCISE ICONS ============
   Monochrome pictograms — simple geometric shapes only, no anatomy drawings.
   Each icon represents the movement via equipment + direction arrow.
   Use currentColor so they inherit text color.
*/
const EX_ICONS = {
  // Equipment / movement primitives rendered as abstract glyphs
  bench: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="36" width="36" height="5" rx="1"/>
    <line x1="20" y1="41" x2="20" y2="52"/>
    <line x1="44" y1="41" x2="44" y2="52"/>
    <circle cx="14" cy="22" r="5" fill="currentColor" fill-opacity="0.15"/>
    <circle cx="50" cy="22" r="5" fill="currentColor" fill-opacity="0.15"/>
    <line x1="14" y1="22" x2="50" y2="22"/>
    <path d="M32 22 L32 16 M29 16 L35 16" stroke-width="2"/>
  </svg>`,

  pullup: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="14" x2="56" y2="14"/>
    <line x1="24" y1="14" x2="24" y2="28"/>
    <line x1="40" y1="14" x2="40" y2="28"/>
    <circle cx="32" cy="34" r="5"/>
    <path d="M32 39 L32 54"/>
    <path d="M26 46 L38 46" stroke-width="2"/>
    <path d="M32 6 L28 10 M32 6 L36 10" stroke-width="2"/>
  </svg>`,

  ohp: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="18" cy="14" r="5" fill="currentColor" fill-opacity="0.15"/>
    <circle cx="46" cy="14" r="5" fill="currentColor" fill-opacity="0.15"/>
    <line x1="18" y1="14" x2="46" y2="14"/>
    <path d="M32 22 L32 44"/>
    <path d="M24 32 L40 32" stroke-width="2"/>
    <path d="M32 4 L28 8 M32 4 L36 8" stroke-width="2"/>
  </svg>`,

  dbrow: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="32" width="36" height="4" rx="1"/>
    <line x1="20" y1="36" x2="20" y2="48"/>
    <line x1="44" y1="36" x2="44" y2="48"/>
    <rect x="28" y="14" width="8" height="14" rx="1" fill="currentColor" fill-opacity="0.15"/>
    <path d="M32 14 L32 6" stroke-width="2"/>
    <path d="M28 10 L32 6 L36 10" stroke-width="2"/>
  </svg>`,

  ezcurl: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 42 Q18 34 26 42 Q34 50 42 42 Q50 34 54 42"/>
    <circle cx="10" cy="42" r="4" fill="currentColor" fill-opacity="0.15"/>
    <circle cx="54" cy="42" r="4" fill="currentColor" fill-opacity="0.15"/>
    <path d="M32 34 Q32 22 20 20" stroke-width="2"/>
    <path d="M18 24 L20 20 L24 22" stroke-width="2"/>
  </svg>`,

  plank: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="50" x2="56" y2="50"/>
    <rect x="12" y="32" width="40" height="8" rx="2" fill="currentColor" fill-opacity="0.12"/>
    <line x1="18" y1="40" x2="18" y2="50"/>
    <line x1="46" y1="40" x2="46" y2="50"/>
    <path d="M32 22 L32 28 M28 24 L36 24" stroke-width="2"/>
  </svg>`,

  "5105": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="48" r="3"/>
    <circle cx="32" cy="48" r="3"/>
    <circle cx="52" cy="48" r="3"/>
    <path d="M32 40 L48 20" stroke-dasharray="3 3"/>
    <path d="M48 20 L16 20" stroke-dasharray="3 3"/>
    <path d="M16 20 L32 40" stroke-dasharray="3 3"/>
    <path d="M46 14 L48 20 L42 20" stroke-width="2"/>
  </svg>`,

  lshuffle: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="10" y1="44" x2="54" y2="44"/>
    <path d="M18 32 L10 44 L18 56" stroke-width="2"/>
    <path d="M46 32 L54 44 L46 56" stroke-width="2"/>
    <rect x="26" y="20" width="12" height="16" rx="2" fill="currentColor" fill-opacity="0.12"/>
  </svg>`,

  goblet: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 14 Q24 24 32 24 Q40 24 40 14 Z" fill="currentColor" fill-opacity="0.15"/>
    <line x1="18" y1="14" x2="46" y2="14"/>
    <path d="M32 24 L32 38"/>
    <path d="M24 38 L40 38"/>
    <path d="M24 38 L20 54 M40 38 L44 54"/>
    <path d="M20 54 L28 54 M36 54 L44 54"/>
  </svg>`,

  rdl: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="14" cy="44" r="5" fill="currentColor" fill-opacity="0.15"/>
    <circle cx="50" cy="44" r="5" fill="currentColor" fill-opacity="0.15"/>
    <line x1="14" y1="44" x2="50" y2="44"/>
    <path d="M32 44 Q32 30 24 24"/>
    <path d="M24 24 L24 12"/>
    <path d="M20 18 L24 12 L28 18" stroke-width="2"/>
  </svg>`,

  wlunge: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="32" cy="14" r="4"/>
    <path d="M32 18 L32 32"/>
    <path d="M32 32 L18 50"/>
    <path d="M32 32 L46 46"/>
    <path d="M46 46 L46 54"/>
    <circle cx="16" cy="38" r="3" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="48" cy="38" r="3" fill="currentColor" fill-opacity="0.2"/>
    <line x1="14" y1="54" x2="22" y2="54"/>
    <line x1="42" y1="54" x2="50" y2="54"/>
  </svg>`,

  calf: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 14 L24 44"/>
    <path d="M24 44 L36 44"/>
    <path d="M36 44 L36 50"/>
    <path d="M20 50 L40 50"/>
    <line x1="8" y1="54" x2="56" y2="54"/>
    <path d="M32 22 L32 10 M28 14 L32 10 L36 14" stroke-width="2"/>
  </svg>`,

  slam: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="32" cy="46" r="8" fill="currentColor" fill-opacity="0.2"/>
    <line x1="8" y1="56" x2="56" y2="56"/>
    <path d="M32 10 L32 34" stroke-dasharray="3 3"/>
    <path d="M26 30 L32 34 L38 30" stroke-width="2"/>
  </svg>`,

  incline: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 44 L44 24 L44 44 Z" fill="currentColor" fill-opacity="0.1"/>
    <line x1="10" y1="44" x2="54" y2="44"/>
    <circle cx="16" cy="14" r="4" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="46" cy="14" r="4" fill="currentColor" fill-opacity="0.2"/>
    <path d="M20 18 L42 18" stroke-width="2"/>
  </svg>`,

  trxrow: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="10" x2="56" y2="10"/>
    <line x1="32" y1="10" x2="22" y2="30"/>
    <line x1="32" y1="10" x2="42" y2="30"/>
    <rect x="18" y="30" width="8" height="3" rx="1" fill="currentColor" fill-opacity="0.3"/>
    <rect x="38" y="30" width="8" height="3" rx="1" fill="currentColor" fill-opacity="0.3"/>
    <path d="M12 46 L52 46"/>
    <path d="M22 36 L22 46 M42 36 L42 46"/>
  </svg>`,

  lraise: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="32" cy="14" r="4"/>
    <path d="M32 18 L32 40"/>
    <path d="M32 24 L8 30"/>
    <path d="M32 24 L56 30"/>
    <circle cx="8" cy="30" r="4" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="56" cy="30" r="4" fill="currentColor" fill-opacity="0.2"/>
    <path d="M8 18 L10 14 M56 18 L54 14" stroke-width="2"/>
  </svg>`,

  pushup: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="50" x2="56" y2="50"/>
    <path d="M10 34 L54 34"/>
    <path d="M10 34 L10 28 M54 34 L54 28"/>
    <rect x="6" y="44" width="8" height="6" rx="1" fill="currentColor" fill-opacity="0.2"/>
    <rect x="50" y="44" width="8" height="6" rx="1" fill="currentColor" fill-opacity="0.2"/>
    <path d="M32 20 L32 26 M28 22 L32 26 L36 22" stroke-width="2"/>
  </svg>`,

  farmer: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="32" cy="12" r="4"/>
    <path d="M32 16 L32 40"/>
    <path d="M32 22 L14 22 M32 22 L50 22"/>
    <rect x="8" y="22" width="12" height="20" rx="2" fill="currentColor" fill-opacity="0.2"/>
    <rect x="44" y="22" width="12" height="20" rx="2" fill="currentColor" fill-opacity="0.2"/>
    <path d="M32 40 L26 54 M32 40 L38 54"/>
    <line x1="6" y1="58" x2="58" y2="58" stroke-dasharray="2 2"/>
  </svg>`,

  jumpsq: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="6" y1="54" x2="58" y2="54"/>
    <circle cx="32" cy="14" r="4"/>
    <path d="M32 18 L32 32"/>
    <path d="M22 32 L32 28 L42 32" stroke-width="2"/>
    <path d="M24 48 L32 36 L40 48" stroke-width="2"/>
    <path d="M16 24 Q8 18 16 12" stroke-dasharray="3 3"/>
    <path d="M48 24 Q56 18 48 12" stroke-dasharray="3 3"/>
  </svg>`,

  broadjump: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="6" y1="50" x2="58" y2="50"/>
    <circle cx="12" cy="28" r="4"/>
    <path d="M12 32 L12 44"/>
    <path d="M8 50 L12 44 L16 50" stroke-width="2"/>
    <path d="M14 22 Q32 8 50 30" stroke-dasharray="3 3"/>
    <path d="M46 26 L50 30 L46 34" stroke-width="2"/>
    <circle cx="50" cy="38" r="3"/>
  </svg>`,

  skater: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="50" x2="56" y2="50"/>
    <circle cx="14" cy="34" r="4" fill="currentColor" fill-opacity="0.15"/>
    <circle cx="50" cy="34" r="4"/>
    <path d="M18 36 Q32 22 46 36" stroke-dasharray="3 3"/>
    <path d="M14 38 L14 50 M50 38 L50 50"/>
  </svg>`,

  frontsq: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="14" cy="18" r="5" fill="currentColor" fill-opacity="0.15"/>
    <circle cx="50" cy="18" r="5" fill="currentColor" fill-opacity="0.15"/>
    <line x1="14" y1="18" x2="50" y2="18"/>
    <circle cx="32" cy="28" r="4"/>
    <path d="M32 32 L26 44 L26 54"/>
    <path d="M32 32 L38 44 L38 54"/>
    <line x1="8" y1="54" x2="56" y2="54"/>
  </svg>`,

  slrdl: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="54" x2="56" y2="54"/>
    <circle cx="18" cy="22" r="4"/>
    <path d="M18 26 Q24 36 38 34"/>
    <path d="M38 34 L50 30" stroke-dasharray="2 3"/>
    <path d="M22 34 L22 54"/>
    <rect x="40" y="34" width="10" height="6" rx="1" fill="currentColor" fill-opacity="0.2"/>
    <path d="M44 20 L44 32" />
    <path d="M40 26 L44 32 L48 26" stroke-width="2"/>
  </svg>`,

  bss: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="38" y="32" width="18" height="4" rx="1" fill="currentColor" fill-opacity="0.15"/>
    <line x1="40" y1="36" x2="40" y2="48"/>
    <line x1="54" y1="36" x2="54" y2="48"/>
    <circle cx="22" cy="18" r="4"/>
    <path d="M22 22 L22 38"/>
    <path d="M22 38 L16 52"/>
    <path d="M22 38 L40 32"/>
    <line x1="6" y1="54" x2="34" y2="54"/>
  </svg>`,

  rowerg: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="14" cy="34" r="8" fill="currentColor" fill-opacity="0.12"/>
    <line x1="14" y1="30" x2="14" y2="38"/>
    <line x1="10" y1="34" x2="18" y2="34"/>
    <line x1="22" y1="34" x2="50" y2="34"/>
    <rect x="44" y="30" width="12" height="8" rx="1" fill="currentColor" fill-opacity="0.15"/>
    <line x1="8" y1="48" x2="56" y2="48"/>
    <path d="M26 22 L36 22 M26 46 L36 46" stroke-width="2"/>
  </svg>`,
};

function exIcon(id) {
  return EX_ICONS[id] || `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <rect x="14" y="14" width="36" height="36" rx="4"/>
    <line x1="22" y1="32" x2="42" y2="32"/>
  </svg>`;
}
