/**
 * OUTO TECH UG — Products Data
 * ─────────────────────────────────────────────────────────────────
 * HOW TO UPDATE:
 *   1. Admin Panel → Settings → Export JSON
 *   2. Replace the PRODUCTS array below with your data
 *   3. Re-deploy via FTP
 *
 * FIELDS:
 *   price     — number as text, e.g. "340000". Leave "" to show "Price on request".
 *   priceFrom — optional true to show "From UGX …" (several sizes/options)
 *   image   — main photo in images/products/
 *   gallery — optional extra photos shown in the product popup
 * ─────────────────────────────────────────────────────────────────
 */

const PRODUCTS = [
  /* ── SECURITY SYSTEMS ─────────────────────────────────────── */
  {
    "id": "s001",
    "name": "GPS Tracker — Cars, Motorcycles & Trucks",
    "price": "",
    "currency": "UGX",
    "description": "Real-time GPS tracking for cars, motorcycles and trucks. Track your vehicle live on your phone, get instant alerts and recover it fast if stolen. Professional hidden installation included.",
    "category": "GPS Trackers",
    "phone": "256757169673",
    "image": "gps-trackers.jpg",
    "gallery": ["gps-tracker-wiring.jpg"]
  },
  {
    "id": "s002",
    "name": "Hikvision ColorVu CCTV Cameras",
    "price": "",
    "currency": "UGX",
    "description": "Genuine Hikvision ColorVu cameras — full-colour images even at night. IP and analog systems for homes, shops, offices and compounds, supplied and installed with clean cabling.",
    "category": "CCTV Cameras",
    "phone": "256757169673",
    "image": "hikvision-colorvu-shelf.jpg",
    "gallery": ["hikvision-colorvu-stock.jpg", "cctv-bullet-install.jpg"]
  },
  {
    "id": "s003",
    "name": "Hikvision Outdoor PTZ Camera",
    "price": "",
    "currency": "UGX",
    "description": "Pan-tilt-zoom outdoor camera covering a wide area from one point. Ideal for gates, yards, parking and perimeter walls. Remote viewing on your phone.",
    "category": "CCTV Cameras",
    "phone": "256757169673",
    "image": "hikvision-ptz-camera.jpg"
  },
  {
    "id": "s004",
    "name": "Electric Fence Installation",
    "price": "",
    "currency": "UGX",
    "description": "Professional electric fence installation on perimeter walls for homes, schools and businesses. Strong deterrent with energiser, alarm and neat finishing. Contact us for a site visit and quotation.",
    "category": "Electric Fence",
    "phone": "256757169673",
    "image": "electric-fence-install-2.jpg",
    "gallery": ["electric-fence-install.jpg", "electric-fence-install-3.jpg"]
  },

  /* ── CAR ALARMS ───────────────────────────────────────────── */
  {
    "id": "a001",
    "name": "Car Alarm Security System",
    "price": "",
    "currency": "UGX",
    "description": "Complete car alarm with 2 remotes, siren, shock sensor and central-lock control. Loud siren when touched, one-click locking, door/boot/bonnet protection, auto-lock while driving and a car-finder button. Genuine, with guarantee and expert installation.",
    "category": "Car Alarms",
    "phone": "256757169673",
    "image": "car-alarm-system.jpg"
  },

  /* ── SOLAR SYSTEMS ────────────────────────────────────────── */
  {
    "id": "l001",
    "name": "AOV 6K Smart Solar Camera — 3 Lens",
    "price": "",
    "currency": "UGX",
    "description": "4G / Wi-Fi AI solar camera with three lenses (1 camera = 3 views), 24-hour continuous recording and colour night vision. No electricity needed — perfect for farms, sites and gates.",
    "category": "Solar Cameras",
    "phone": "256757169673",
    "image": "aov-solar-camera-2.jpg",
    "gallery": ["aov-solar-camera.jpg", "solar-camera-rooftop.jpg", "solar-pole-camera-floodlight.jpg"]
  },
  {
    "id": "l002",
    "name": "Blue Carbon Solar Flood Lights",
    "price": "340000",
    "currency": "UGX",
    "priceFrom": true,
    "description": "Bright solar flood lights with separate solar panel and remote control. Available in 3 sizes — 1.0: UGX 340,000 · 2.0: UGX 390,000 · 3.0: UGX 400,000. Installation available.",
    "category": "Solar Lighting",
    "phone": "256757169673",
    "image": "blue-carbon-flood-lights.jpg",
    "gallery": ["solar-flood-lights-stock.jpg", "solar-floodlight-pole.jpg"]
  },
  {
    "id": "l003",
    "name": "Solar Street Light — 4 Module",
    "price": "",
    "currency": "UGX",
    "description": "High-power 4-module solar street light with dedicated panel and pole bracket. Lights compounds, gates and roads all night automatically. Supplied and installed.",
    "category": "Solar Lighting",
    "phone": "256757169673",
    "image": "solar-street-light-pole.jpg",
    "gallery": ["solar-street-light-4-module.jpg", "solar-street-light-gate.jpg", "solar-street-light-install.jpg", "solar-street-light-camera.jpg", "solar-street-light-unit.jpg"]
  },
  {
    "id": "l004",
    "name": "All-in-One Solar Street Light",
    "price": "",
    "currency": "UGX",
    "description": "Integrated panel, battery and LED in one unit. Easy pole mounting, zero electricity bills.",
    "category": "Solar Lighting",
    "phone": "256757169673",
    "image": "solar-street-light-all-in-one.jpg",
    "gallery": ["led-street-light.jpg"]
  },
  {
    "id": "l005",
    "name": "Solar Panels",
    "price": "",
    "currency": "UGX",
    "description": "Quality solar panels in a range of sizes for homes, shops and security systems. Delivered and installed with correct mounting and wiring.",
    "category": "Solar Systems",
    "phone": "256757169673",
    "image": "solar-panel-delivery-3.jpg",
    "gallery": ["solar-panel-delivery.jpg", "solar-panel-delivery-2.jpg"]
  },
  {
    "id": "l006",
    "name": "Solar Power System Installation",
    "price": "",
    "currency": "UGX",
    "description": "Complete solar power systems — panels, inverter and battery storage — sized to your home or business. Site assessment, installation and after-sale support.",
    "category": "Solar Systems",
    "phone": "256757169673",
    "image": "solar-power-system.jpg"
  },

  /* ── CAR SCREENS & AUDIO ──────────────────────────────────── */
  {
    "id": "c001",
    "name": "Android Tesla-Style Vertical Screen",
    "price": "",
    "currency": "UGX",
    "description": "Large vertical Android head unit with GPS navigation, Bluetooth, YouTube, reverse camera support and climate display. Custom fit for Prado, Harrier and more. Professional installation.",
    "category": "Car Screens",
    "phone": "256757169673",
    "image": "android-tesla-screen-prado.jpg",
    "gallery": ["android-tesla-screen-prado-2.jpg", "android-tesla-screen-harrier.jpg"]
  },
  {
    "id": "c002",
    "name": "Android Car Radio / Multimedia Screen",
    "price": "",
    "currency": "UGX",
    "description": "9\" and 10\" Android screens with Apple CarPlay & Android Auto, Bluetooth, GPS, Wi-Fi and reverse camera input. Fitted with the correct dash frame for your car model.",
    "category": "Car Screens",
    "phone": "256757169673",
    "image": "android-screens-boxed.jpg",
    "gallery": ["android-screen-forester.jpg", "android-screen-allion.jpg", "android-screen-mercedes.jpg", "android-screen-hiace.jpg", "android-screen-xtrail.jpg", "android-multimedia-player-boxes.jpg"]
  },
  {
    "id": "c003",
    "name": "JBL GTO603 Coaxial Speakers",
    "price": "",
    "currency": "UGX",
    "description": "Genuine JBL Grand Touring series 6.5\" speakers — clear highs and punchy mids. Supplied with grilles and fitted into your doors professionally.",
    "category": "Car Audio",
    "phone": "256757169673",
    "image": "jbl-gto603-speakers.jpg",
    "gallery": ["jbl-door-speaker-install.jpg"]
  },
  {
    "id": "c004",
    "name": "JBL BassPro Nano Under-Seat Subwoofer",
    "price": "",
    "currency": "UGX",
    "description": "Compact powered subwoofer that fits under the seat — deep bass without losing boot space. Clean wiring and installation.",
    "category": "Car Audio",
    "phone": "256757169673",
    "image": "jbl-basspro-nano-seat.jpg",
    "gallery": ["jbl-basspro-nano.jpg", "jbl-basspro-subwoofers.jpg", "subwoofer-install.jpg"]
  },
  {
    "id": "c005",
    "name": "Active Subwoofer Bass Box",
    "price": "",
    "currency": "UGX",
    "description": "Powerful boot subwoofer in a ported enclosure for heavy, room-filling bass. Supplied and wired to your system.",
    "category": "Car Audio",
    "phone": "256757169673",
    "image": "subwoofer-box-orange.jpg"
  },

  /* ── INTERIOR & CAR CARE ──────────────────────────────────── */
  {
    "id": "c006",
    "name": "Premium Leather Car Seat Covers",
    "price": "",
    "currency": "UGX",
    "description": "Full-set quilted leather seat covers with neck and back cushions. Available in black, black/red and other colours. Leather and wiring works done in-house.",
    "category": "Seat Covers",
    "phone": "256757169673",
    "image": "seat-covers-black-red.jpg",
    "gallery": ["seat-covers-black.jpg", "seat-covers-red.jpg"]
  },
  {
    "id": "c007",
    "name": "Cordless 48V Car Washer",
    "price": "",
    "currency": "UGX",
    "description": "Portable high-pressure washer with 2 rechargeable 48V batteries, foam bottle, hose and carry case. Wash cars, bikes and compounds anywhere — no socket needed.",
    "category": "Car Care",
    "phone": "256757169673",
    "image": "cordless-car-washer-promo.jpg",
    "gallery": ["cordless-car-washer.jpg", "cordless-car-washer-kit.jpg", "cordless-car-washer-case.jpg", "cordless-car-washer-set.jpg", "cordless-car-washer-carry.jpg"]
  },
  {
    "id": "c008",
    "name": "Nano Double-Sided Tape",
    "price": "",
    "currency": "UGX",
    "description": "Transparent, reusable, washable nano grip tape. Mount phone holders, dash cams and accessories without screws or marks.",
    "category": "Car Care",
    "phone": "256757169673",
    "image": "nano-tape.jpg"
  }
];

/* Category icon map — Font Awesome class names */
const CATEGORY_ICONS = {
  "GPS Trackers":    "fa-location-crosshairs",
  "CCTV Cameras":    "fa-video",
  "Electric Fence":  "fa-bolt",
  "Car Alarms":      "fa-bell",
  "Solar Cameras":   "fa-solar-panel",
  "Solar Lighting":  "fa-lightbulb",
  "Solar Systems":   "fa-sun",
  "Car Screens":     "fa-tablet-screen-button",
  "Car Audio":       "fa-volume-high",
  "Seat Covers":     "fa-couch",
  "Car Care":        "fa-spray-can-sparkles",
  "default":         "fa-screwdriver-wrench"
};
