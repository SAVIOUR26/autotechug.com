/**
 * AutoTech UG — Products Data
 * ─────────────────────────────────────────────────────────────────
 * HOW TO UPDATE:
 *   1. Run scraper/scrape_catalog.py to get real product data
 *   2. Or: Admin Panel → Settings → Export JSON
 *   3. Replace the PRODUCTS array below with your real data
 *   4. Re-deploy via FTP
 * ─────────────────────────────────────────────────────────────────
 */

const PRODUCTS = [
  {
    "id": "p001",
    "name": "Car Battery 12V 60Ah",
    "price": "180000",
    "currency": "UGX",
    "description": "Heavy duty maintenance-free car battery. Compatible with most Japanese and European vehicles. 18-month warranty included.",
    "category": "Batteries",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p002",
    "name": "Engine Oil Filter",
    "price": "25000",
    "currency": "UGX",
    "description": "OEM-quality oil filter for 1.3L–2.0L petrol engines. Fits Toyota, Nissan, Honda. Prevents contaminants from damaging your engine.",
    "category": "Engine Parts",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p003",
    "name": "Brake Pads — Front Set",
    "price": "85000",
    "currency": "UGX",
    "description": "Ceramic front brake pads. Low dust, quiet operation. Fits Toyota Corolla, Caldina, Premio 2000–2020.",
    "category": "Brakes",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p004",
    "name": "Alternator 12V 90A",
    "price": "320000",
    "currency": "UGX",
    "description": "Remanufactured alternator for Toyota 1NZ/2NZ engines. Fully tested. 6-month warranty included.",
    "category": "Electrical",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p005",
    "name": "Radiator — Toyota Corolla",
    "price": "250000",
    "currency": "UGX",
    "description": "Aluminium-core radiator for Toyota Corolla E120/E140. Direct OEM replacement. Excellent heat dissipation.",
    "category": "Cooling System",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p006",
    "name": "Shock Absorbers — Front Pair",
    "price": "220000",
    "currency": "UGX",
    "description": "Gas-charged front shock absorbers. Improved handling and comfort. Universal fit for Toyota Ipsum and RAV4.",
    "category": "Suspension",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p007",
    "name": "Timing Belt Kit",
    "price": "145000",
    "currency": "UGX",
    "description": "Complete timing belt kit with tensioner and idler for 4AF/7AF Toyota engines. Genuine quality.",
    "category": "Engine Parts",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p008",
    "name": "Air Filter — Universal",
    "price": "18000",
    "currency": "UGX",
    "description": "High-flow performance air filter. Washable and reusable. Fits most 1.3L–2.5L engines.",
    "category": "Filters",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p009",
    "name": "Fuel Pump — Universal",
    "price": "95000",
    "currency": "UGX",
    "description": "In-tank electric fuel pump. Consistent fuel delivery under all conditions. Fits Nissan, Toyota, Mitsubishi.",
    "category": "Fuel System",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p010",
    "name": "Headlight Bulb H4 55W",
    "price": "12000",
    "currency": "UGX",
    "description": "Halogen H4 dual-beam headlight bulb. 12V 55/60W. Bright white light, long service life. Pair available.",
    "category": "Electrical",
    "phone": "256757169673",
    "image": ""
  },
  {
    "id": "p011",
    "name": "Clutch Plate Kit",
    "price": "310000",
    "currency": "UGX",
    "description": "3-piece clutch kit (disc, cover, bearing) for Toyota Corolla 1.6L. OEM-spec for smooth engagement.",
    "category": "Transmission",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p012",
    "name": "CV Joint — Front Outer",
    "price": "130000",
    "currency": "UGX",
    "description": "Front outer CV joint assembly with boot kit. For Toyota Corolla, Premio, Fielder. Eliminates clicking on turns.",
    "category": "Drivetrain",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p013",
    "name": "Power Steering Rack",
    "price": "480000",
    "currency": "UGX",
    "description": "Remanufactured power steering rack for Toyota NZE 2003–2012. Full leak test. Direct bolt-on fitment.",
    "category": "Steering",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p014",
    "name": "ECU — Toyota 1NZ",
    "price": "550000",
    "currency": "UGX",
    "description": "Tested and verified ECU for Toyota 1NZ-FE engine. Plug and play replacement.",
    "category": "Electronics",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p015",
    "name": "Wheel Bearing — Rear Hub",
    "price": "65000",
    "currency": "UGX",
    "description": "Rear hub wheel bearing for Toyota Vitz/Yaris/Belta. Press-fit type. Eliminates humming noise on highways.",
    "category": "Suspension",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p016",
    "name": "Water Pump — 7A Engine",
    "price": "115000",
    "currency": "UGX",
    "description": "Durable water pump for Toyota 7A-FE engine. Prevents overheating. Includes gasket.",
    "category": "Cooling System",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p017",
    "name": "Catalytic Converter",
    "price": "380000",
    "currency": "UGX",
    "description": "Universal fit catalytic converter for 1.3L–2.0L petrol engines. Reduces emissions, improves exhaust flow.",
    "category": "Exhaust",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p018",
    "name": "Ignition Coil Set x4",
    "price": "160000",
    "currency": "UGX",
    "description": "Set of 4 ignition coils for Toyota/Nissan 4-cylinder engines. Improves ignition performance and fuel economy.",
    "category": "Engine Parts",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p019",
    "name": "Gearbox Mount",
    "price": "35000",
    "currency": "UGX",
    "description": "Rubber gearbox mounting for Toyota NZE, IST, Runx. Reduces vibration and gear rattle.",
    "category": "Transmission",
    "phone": "256757469374",
    "image": ""
  },
  {
    "id": "p020",
    "name": "Car AC Compressor",
    "price": "650000",
    "currency": "UGX",
    "description": "Remanufactured AC compressor for Toyota Corolla 1.8L. Fully tested. 6-month warranty. Includes clutch.",
    "category": "Air Conditioning",
    "phone": "256757469374",
    "image": ""
  }
];

/* Category icon map — Font Awesome class names */
const CATEGORY_ICONS = {
  "Batteries":       "fa-car-battery",
  "Engine Parts":    "fa-gear",
  "Brakes":          "fa-circle-stop",
  "Electrical":      "fa-bolt",
  "Cooling System":  "fa-temperature-half",
  "Suspension":      "fa-car-bump",
  "Transmission":    "fa-gears",
  "Filters":         "fa-filter",
  "Fuel System":     "fa-gas-pump",
  "Steering":        "fa-circle-dot",
  "Electronics":     "fa-microchip",
  "Drivetrain":      "fa-arrows-spin",
  "Exhaust":         "fa-wind",
  "Air Conditioning":"fa-snowflake",
  "default":         "fa-wrench"
};
