
#!/usr/bin/env node
/**
 * make-airports.js — generates public/assets/airports.json
 *
 * Downloads the OurAirports open dataset (public domain) and emits a
 * compact { ICAO: [lat, lon] } map for the VTAC GSC flight planner.
 *
 * Run from the repo root:
 *     node tools/make-airports.js
 *
 * Re-run whenever you want fresh data. OurAirports updates daily.
 * Output is ~700-900 KB raw, ~250 KB gzipped; Firebase Hosting
 * gzips it automatically, so members download it once per session.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SRC = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const OUT = path.join(process.cwd(), 'public', 'assets', 'airports.json');

// Types we don't want a bomber flight-planned into.
const SKIP = { closed: 1, heliport: 1, seaplane_base: 1, balloonport: 1 };

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
  console.log('Downloading ' + SRC + ' …');
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
  let skipped = 0;
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const c = csvSplit(lines[i]);
    const ident = (c[iIdent] || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{4}$/.test(ident)) { skipped++; continue; }
    if (iType >= 0 && SKIP[(c[iType] || '').trim()]) { skipped++; continue; }
    const lat = parseFloat(c[iLat]), lon = parseFloat(c[iLon]);
    if (isNaN(lat) || isNaN(lon)) { skipped++; continue; }
    out[ident] = [Math.round(lat * 1e4) / 1e4, Math.round(lon * 1e4) / 1e4];
  }

  const keys = Object.keys(out);
  if (keys.length < 1000) throw new Error('Only ' + keys.length + ' airports parsed — aborting rather than shipping a broken file.');

  // Spot-check a few fields including the ones that started this.
  ['YPDN', 'YPTN', 'KDYS', 'KSZL', 'KBAD', 'OTBH', 'EGVN', 'RJTY'].forEach(k => {
    console.log('  ' + k.padEnd(6) + (out[k] ? out[k].join(', ') : '*** MISSING ***'));
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out));
  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log('\nWrote ' + keys.length.toLocaleString() + ' airports → ' + OUT + ' (' + kb + ' KB)');
  console.log('Skipped ' + skipped.toLocaleString() + ' rows (non-ICAO idents, closed fields, heliports).');
})().catch(e => { console.error('FAILED: ' + e.message); process.exit(1); });
