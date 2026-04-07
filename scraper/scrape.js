/**
 * AutoTech UG — WhatsApp Catalog Scraper (curl-based)
 * -----------------------------------------------------
 * Fetches each wa.me/p/ product link via curl (follows redirect to
 * whatsapp.com/product/...) and extracts name, image, description.
 *
 * Usage:
 *   node scraper/scrape.js
 *
 * Output:
 *   scraper/scraped_products.json  — raw results for review
 *   js/products.js                 — ready to deploy
 */

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

// ── Config ─────────────────────────────────────────────────────
const DELAY_MS   = 400;
const TIMEOUT_S  = 14;
const OUT_JSON   = path.join(__dirname, 'scraped_products.json');
const OUT_JS     = path.join(__dirname, '..', 'js', 'products.js');
const IMG_DIR    = path.join(__dirname, '..', 'images', 'products');

// ── Load links ─────────────────────────────────────────────────
function loadLinks() {
  const files = [
    path.join(__dirname, '..', '256757169673.txt'),
    path.join(__dirname, '..', '+256 757 469374.txt'),
  ];
  const seen = new Set();
  const links = [];
  for (const f of files) {
    if (!fs.existsSync(f)) { console.warn(`  ⚠ Not found: ${f}`); continue; }
    fs.readFileSync(f, 'utf8').split('\n').map(l => l.trim()).filter(Boolean).forEach(url => {
      if (url.startsWith('https://wa.me/p/') && !seen.has(url)) {
        seen.add(url);
        links.push(url);
      }
    });
  }
  return links;
}

// ── Category guesser ───────────────────────────────────────────
const CAT_RULES = [
  [/cctv|camera|security/i,                           'Electronics'],
  [/brak|pad|disc|rotor/i,                            'Brakes'],
  [/engine|piston|valve|camshaft|crankshaft|gasket|timing/i, 'Engine Parts'],
  [/battery|alternator|starter|fuse|relay|wire|bulb|sensor/i,'Electrical'],
  [/filter|oil filter|air filter|fuel filter/i,       'Filters'],
  [/shock|strut|spring|bushing|arm|suspen/i,          'Suspension'],
  [/gearbox|transmis|clutch|diff/i,                   'Transmission'],
  [/radiator|coolant|thermostat|water pump|cooling/i, 'Cooling System'],
  [/fuel pump|injector|carburetor|fuel/i,             'Fuel System'],
  [/steering|rack|pump|tie rod/i,                     'Steering'],
  [/exhaust|muffler|catalytic/i,                      'Exhaust'],
  [/ac |compressor|condenser|air con/i,               'Air Conditioning'],
  [/drive shaft|axle|cv joint/i,                      'Drivetrain'],
  [/tyre|tire|rim|wheel/i,                            'Tyres & Wheels'],
  [/lamp|light|headlight|tail/i,                      'Lighting'],
  [/mirror|wiper|body|bumper|panel|door/i,            'Body Parts'],
  [/oil|lubric|grease/i,                              'Oils & Lubricants'],
];
function guessCategory(text) {
  for (const [re, cat] of CAT_RULES) {
    if (re.test(text)) return cat;
  }
  return 'Auto Parts';
}

// ── Extract price ──────────────────────────────────────────────
function extractPrice(text) {
  if (!text) return 0;
  const m = text.match(/(?:UGX|USh|Ush)[\s]*([0-9][0-9,]+)|([0-9]{4,})/i);
  if (m) { const n = parseInt((m[1]||m[2]).replace(/,/g,''),10); return isNaN(n)?0:n; }
  return 0;
}

// ── Parse meta content values from HTML ───────────────────────
function parseMeta(html) {
  const get = (prop) => {
    const patterns = [
      new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`,'i'),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`,'i'),
      new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`,'i'),
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m) return m[1].replace(/&amp;/g,'&').replace(/&#039;/g,"'").replace(/&quot;/g,'"').trim();
    }
    return '';
  };

  // Also grab all content= values in order for fallback
  const allContent = [];
  const re = /content="([^"]{10,})"/g;
  let m;
  while ((m = re.exec(html)) !== null) allContent.push(m[1]);

  const title = get('title') || (html.match(/<title[^>]*>([^<]+)</i)||[])[1] || '';
  const desc  = get('description') || allContent.find(c => c.length > 30 && !c.startsWith('http') && !c.includes('URL=')) || '';
  const image = get('image') || allContent.find(c => c.startsWith('https://scontent') || c.startsWith('https://z-p')) || '';

  return { title, desc, image };
}

// ── Clean product name (remove "on WhatsApp" suffix etc.) ──────
function cleanName(raw) {
  return raw
    .replace(/\s+from\s+.+?\s+on\s+WhatsApp\.?$/i, '')
    .replace(/\s+on\s+WhatsApp\.?$/i, '')
    .replace(/WhatsApp\.?$/i, '')
    .replace(/\.$/, '')
    .trim();
}

// ── Download image ─────────────────────────────────────────────
function downloadImage(url, filename) {
  if (!url || !filename) return false;
  try {
    const dest = path.join(IMG_DIR, filename);
    execSync(`curl -sL --max-time 20 "${url}" -o "${dest}"`, { timeout: 25000 });
    const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
    if (size < 1000) { fs.unlinkSync(dest); return false; } // too small = likely error page
    return true;
  } catch { return false; }
}

// ── Fetch one product via curl ─────────────────────────────────
function fetchProduct(url, index) {
  const parts     = url.split('/');
  const productId = parts[parts.length - 2];
  const phone     = parts[parts.length - 1];

  try {
    const html = execSync(
      `curl -sL --max-time ${TIMEOUT_S} -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}"`,
      { timeout: (TIMEOUT_S + 3) * 1000, maxBuffer: 1024 * 512 }
    ).toString();

    const { title, desc, image } = parseMeta(html);
    const name     = cleanName(title) || `Product ${index + 1}`;
    const price    = extractPrice(desc) || extractPrice(name);
    const category = guessCategory(name + ' ' + desc);

    // Download image
    let imgFile = '';
    if (image) {
      imgFile = `${productId}.jpg`;
      const ok = downloadImage(image, imgFile);
      if (!ok) imgFile = '';
    }

    return { id: productId, name, description: desc, price, currency: 'UGX', category, image: imgFile, imageUrl: image, phone, waLink: url, _ok: true };
  } catch (err) {
    return { id: `err_${index}`, name: '', waLink: url, error: err.message.slice(0, 80), _ok: false };
  }
}

// ── Format products.js ─────────────────────────────────────────
function formatProductsJS(products) {
  const clean = products.filter(p => p._ok && p.name);
  const lines = clean.map((p, i) => `  {
    id:          '${String(i + 1).padStart(3, '0')}',
    name:        ${JSON.stringify(p.name)},
    description: ${JSON.stringify(p.description || '')},
    price:       ${p.price || 0},
    currency:    'UGX',
    category:    ${JSON.stringify(p.category)},
    image:       ${JSON.stringify(p.image || '')},
    phone:       '${p.phone || '256757169673'}',
    waLink:      ${JSON.stringify(p.waLink)},
  }`);

  return `/* AUTO-GENERATED by scraper/scrape.js — ${new Date().toISOString()} */
/* Products: ${clean.length} */

const PRODUCTS = [
${lines.join(',\n')}
];
`;
}

// ── Main ───────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  const links = loadLinks();
  console.log(`\n  AutoTech UG — WhatsApp Catalog Scraper`);
  console.log(`  ${links.length} unique product links found\n`);

  const results = [];
  for (let i = 0; i < links.length; i++) {
    process.stdout.write(`  [${String(i+1).padStart(3,'0')}/${links.length}] `);
    const p = fetchProduct(links[i], i);
    results.push(p);
    console.log(p._ok ? `✅  ${p.name.padEnd(45,' ')} | ${p.category} | img:${p.image?'yes':'no '}` : `❌  ${p.error}`);
    if (i < links.length - 1) {
      const start = Date.now();
      while (Date.now() - start < DELAY_MS) {} // sync delay
    }
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2));
  const js = formatProductsJS(results);
  fs.writeFileSync(OUT_JS, js);

  const ok  = results.filter(r => r._ok).length;
  const img = results.filter(r => r.image).length;
  const err = results.length - ok;
  console.log(`\n  ── Results ───────────────────────────────`);
  console.log(`  ✅ Scraped:  ${ok}/${links.length}`);
  console.log(`  🖼  Images:  ${img}/${ok}`);
  console.log(`  ❌ Failed:   ${err}`);
  console.log(`  → scraper/scraped_products.json`);
  console.log(`  → js/products.js\n`);
}

main();
