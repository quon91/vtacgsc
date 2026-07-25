/**
 * make-airports.js — generates public/assets/airports.json
 *
 * Downloads the OurAirports open dataset (public domain) and emits a
 * compact { IDENT: [lat, lon] } map for the VTAC GSC flight planner.
 *
 * Run from the REPO ROOT:
 *     node tools/make-airports.js
 *
 * Emits EVERY airport in the dataset — all types, all ident lengths.
 * ~80,000 entries, roughly 2 MB raw and under 1 MB gzipped. Firebase
 * Hosting gzips automatically, so members download it once per session.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SRC = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const OUT = path.join(process.cwd(), 'public', 'assets', 'airports.json');

// ── WHAT COUNTS AS AN AIRPORT ────────────────────────────────────
// Everything is included by default: large, medium and small fields,
// heliports, seaplane bases and balloonports.
//
// Closed fields are the ONE exception. They no longer exist on the
// ground and aren't in MSFS scenery, so including them means a pilot
// can plan a sortie to a destination that cannot be landed at. Flip
// this to true if you want a literally complete dump anyway.
const INCLUDE_CLOSED = false;

function csvSplit(line) {
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') q = !q;
    else if (c === ',' && !q) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      let data = '';
      res.setEncoding('utf8');
      res.on('data', d => { data += d; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  console.log('Downloading ' + SRC + ' ...');
  const text = await get(SRC);
  const lines = text.split('\n');
  console.log('  ' + lines.length.toLocaleString() + ' rows');

  // Header-driven indices — OurAirports has added and reordered
  // columns before. Never hardcode positions here.
  const hdr = csvSplit(lines[0] || '').map(h => h.trim().toLowerCase());
  const iIdent = hdr.indexOf('ident');
  const iType  = hdr.indexOf('type');
  const iLat   = hdr.indexOf('latitude_deg');
  const iLon   = hdr.indexOf('longitude_deg');
  if (iIdent < 0 || iLat < 0 || iLon < 0) {
    throw new Error('Column headers not recognised. Got: ' + hdr.join(','));
  }

  const out = {};
  const byType = {};
  let skipped = 0, closedSkipped = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const c = csvSplit(lines[i]);
    const ident = (c[iIdent] || '').trim().toUpperCase();
    const type  = (c[iType] || '').trim();

    // Any ident the dataset carries — no length restriction, so US
    // local codes like 1G4 and 00AK come through alongside ICAOs.
    if (!/^[A-Z0-9]{2,8}$/.test(ident)) { skipped++; continue; }
    if (!INCLUDE_CLOSED && type === 'closed') { closedSkipped++; continue; }

    const lat = parseFloat(c[iLat]), lon = parseFloat(c[iLon]);
    if (isNaN(lat) || isNaN(lon)) { skipped++; continue; }

    out[ident] = [Math.round(lat * 1e4) / 1e4, Math.round(lon * 1e4) / 1e4];
    byType[type || 'unknown'] = (byType[type || 'unknown'] || 0) + 1;
  }

  const keys = Object.keys(out);
  if (keys.length < 20000) {
    throw new Error('Only ' + keys.length + ' airports parsed — aborting rather than shipping a broken file.');
  }

  console.log('\nBy type:');
  Object.keys(byType).sort((a, b) => byType[b] - byType[a])
    .forEach(t => console.log('  ' + t.padEnd(16) + byType[t].toLocaleString()));

  // Spot-check, including the fields that started all this.
  console.log('\nSpot check:');
  ['YPDN', 'YPTN', 'KDYS', 'KSZL', 'KBAD', 'OTBH', 'EGVN', 'RJTY', 'PGUA', 'FJDG'].forEach(k => {
    console.log('  ' + k.padEnd(6) + (out[k] ? out[k].join(', ') : '*** MISSING ***'));
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out));
  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log('\nWrote ' + keys.length.toLocaleString() + ' airports -> ' + OUT + ' (' + kb + ' KB raw)');
  console.log('Skipped ' + skipped.toLocaleString() + ' malformed rows'
    + (INCLUDE_CLOSED ? '' : ' and ' + closedSkipped.toLocaleString() + ' closed fields') + '.');
})().catch(e => { console.error('FAILED: ' + e.message); process.exit(1); });
