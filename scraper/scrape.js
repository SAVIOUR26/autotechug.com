/**
 * AutoTech UG — WhatsApp Catalog Scraper
 * ----------------------------------------
 * Fetches each wa.me/p/ product link and extracts:
 *   name, description, price, image, category (guessed)
 *
 * Usage:
 *   node scraper/scrape.js
 *
 * Output:
 *   scraper/scraped_products.json  — raw results
 *   js/products.js                 — ready to deploy
 *
 * Requirements:
 *   npm install node-fetch cheerio  (run once inside /scraper)
 */

const fs   = require('fs');
const path = require('path');

// ── Try to load dependencies ───────────────────────────────────
let fetch, cheerio;
try {
  fetch   = (...a) => import('node-fetch').then(m => m.default(...a));
  cheerio = require('cheerio');
} catch {
  console.error('\n  Missing dependencies. Run:\n\n    cd scraper && npm install node-fetch cheerio\n');
  process.exit(1);
}

// ── Config ─────────────────────────────────────────────────────
const DELAY_MS    = 800;   // polite delay between requests
const TIMEOUT_MS  = 12000;
const OUT_JSON    = path.join(__dirname, 'scraped_products.json');
const OUT_JS      = path.join(__dirname, '..', 'js', 'products.js');

// ── Load links from both txt files ────────────────────────────
function loadLinks() {
  const files = [
    path.join(__dirname, '..', '256757169673.txt'),
    path.join(__dirname, '..', '+256 757 469374.txt'),
  ];
  const seen = new Set();
  const links = [];
  for (const f of files) {
    if (!fs.existsSync(f)) { console.warn(`  ⚠ File not found: ${f}`); continue; }
    const lines = fs.readFileSync(f, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
    for (const url of lines) {
      if (url.startsWith('https://wa.me/p/') && !seen.has(url)) {
        seen.add(url);
        links.push(url);
      }
    }
  }
  return links;
}

// ── Category guesser ──────────────────────────────────────────
const CAT_RULES = [
  [/brak|pad|disc|rotor/i,          'Brakes'],
  [/engine|piston|valve|camshaft|crankshaft|gasket|timing/i, 'Engine Parts'],
  [/battery|alternator|starter|fuse|relay|wire|bulb|sensor/i,'Electrical'],
  [/filter|oil filter|air filter|fuel filter/i, 'Filters'],
  [/shock|strut|spring|bushing|arm|suspen/i,   'Suspension'],
  [/gearbox|transmis|clutch|diff/i,            'Transmission'],
  [/radiator|coolant|thermostat|water pump|cooling/i, 'Cooling System'],
  [/fuel pump|injector|carburetor|fuel/i,      'Fuel System'],
  [/steering|rack|pump|tie rod/i,              'Steering'],
  [/exhaust|muffler|catalytic/i,               'Exhaust'],
  [/ac|compressor|condenser|air con/i,         'Air Conditioning'],
  [/drive shaft|axle|cv joint|propeller/i,     'Drivetrain'],
  [/camera|screen|display|bluetooth|radio|stereo/i, 'Electronics'],
];
function guessCategory(text) {
  if (!text) return 'Auto Parts';
  for (const [re, cat] of CAT_RULES) {
    if (re.test(text)) return cat;
  }
  return 'Auto Parts';
}

// ── Extract price from text ────────────────────────────────────
function extractPrice(text) {
  if (!text) return null;
  // Match patterns like: UGX 45,000 | 45000 | 45,000 UGX | $45 | USh 45000
  const m = text.match(/(?:UGX|USh|Ush|ugx)[\s,]*([0-9][0-9,\s.]+)|([0-9][0-9,]+)[\s]*(?:UGX|ugx|USh)/i)
           || text.match(/([0-9]{4,})/);
  if (m) {
    const raw = (m[1] || m[2] || m[0]).replace(/[,\s]/g, '');
    const n   = parseInt(raw, 10);
    return isNaN(n) ? null : n;
  }
  return null;
}

// ── Fetch one product ─────────────────────────────────────────
async function fetchProduct(url, index) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  };

  const ctrl    = new AbortController();
  const timer   = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const res  = await fetch(url, { headers, signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(timer);
    const html = await res.text();
    const $    = cheerio.load(html);

    const get = (prop) => $(`meta[property="og:${prop}"]`).attr('content')
                       || $(`meta[name="og:${prop}"]`).attr('content')
                       || $(`meta[name="${prop}"]`).attr('content')
                       || '';

    const name  = get('title')       || $('title').text().replace(/\s*[|\-].*$/, '').trim();
    const desc  = get('description') || $('meta[name="description"]').attr('content') || '';
    const image = get('image')       || '';
    const price = extractPrice(desc) || extractPrice(name);

    const parts = url.split('/');
    const productId = parts[parts.length - 2] || parts[parts.length - 1];
    const phone     = parts[parts.length - 1];

    const category = guessCategory(name + ' ' + desc);

    return {
      id:          `wa_${productId}`,
      name:        name || `Product ${index + 1}`,
      description: desc,
      price:       price || 0,
      currency:    'UGX',
      category,
      image:       '',           // filename (to be added manually or via download)
      imageUrl:    image,        // original URL from OG meta (may be usable)
      phone:       phone.replace(/\D/g, ''),
      waLink:      url,
      _scraped:    true,
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      id:       `wa_err_${index}`,
      name:     `[Failed] ${url}`,
      waLink:   url,
      error:    err.message,
      _scraped: false,
    };
  }
}

// ── Format products.js output ─────────────────────────────────
function formatProductsJS(products) {
  const clean = products.filter(p => p._scraped && p.name && !p.name.startsWith('[Failed]'));
  const lines = clean.map((p, i) => `  {
    id:          '${String(i + 1).padStart(3, '0')}',
    name:        ${JSON.stringify(p.name)},
    description: ${JSON.stringify(p.description || '')},
    price:       ${p.price || 0},
    currency:    'UGX',
    category:    ${JSON.stringify(p.category)},
    image:       '',
    phone:       '${p.phone || '256757169673'}',
    waLink:      ${JSON.stringify(p.waLink)},
  }`);

  return `/* AUTO-GENERATED by scraper/scrape.js — ${new Date().toISOString()} */
/* Total products: ${clean.length} */
/* To update: run the scraper again and re-deploy */

const PRODUCTS = [
${lines.join(',\n')}
];
`;
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  const links = loadLinks();
  console.log(`\n  AutoTech UG — WhatsApp Catalog Scraper`);
  console.log(`  Found ${links.length} unique product links\n`);

  const results = [];
  for (let i = 0; i < links.length; i++) {
    const url = links[i];
    process.stdout.write(`  [${String(i + 1).padStart(3, '0')}/${links.length}] Fetching… `);
    const product = await fetchProduct(url, i);
    results.push(product);

    const ok = product._scraped && !product.error;
    console.log(ok ? `✅  ${product.name.slice(0, 55)}` : `❌  ${product.error || 'unknown error'}`);

    if (i < links.length - 1) await new Promise(r => setTimeout(r, DELAY_MS));
  }

  // Save raw JSON
  fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2));
  console.log(`\n  Raw results → ${OUT_JSON}`);

  // Save products.js
  const js = formatProductsJS(results);
  fs.writeFileSync(OUT_JS, js);
  console.log(`  products.js  → ${OUT_JS}`);

  const ok  = results.filter(r => r._scraped && !r.error).length;
  const err = results.length - ok;
  console.log(`\n  ✅ Success: ${ok}   ❌ Failed: ${err}\n`);

  if (err > 0) {
    console.log('  Failed links (may need manual entry):');
    results.filter(r => r.error).forEach(r => console.log(`    ${r.waLink}`));
    console.log();
  }
}

main().catch(console.error);
