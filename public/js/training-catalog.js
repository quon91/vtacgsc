// ═══════════════════════════════════════════════════════════════
//  VTAC GSC — TRAINING CATALOG
//  Single source of truth for every certification and qualification
//  status the command awards.
//
//  Include AFTER firebase-config.js and BEFORE the page script:
//      <script src="/js/training-catalog.js"></script>
//
//  Used by:
//    /pages/master-admin.html          (Training Records → award)
//    /pages/training/instructors-corner.html  (Award Certifications)
//
//  ─────────────────────────────────────────────────────────────
//  ADDING A NEW CERTIFICATION
//  Add one entry to TRAINING_CERTS below. It appears immediately in
//  both the Master Admin award picker and Instructor's Corner — no
//  other file needs touching.
//
//    id          unique, never change it once awarded (it's the key
//                stored on pilot records)
//    aircraft    'B-1B' | 'B-2' | 'B-52H' | 'All'
//    wing        the owning wing id, or '' for command-wide
//    phase       grouping label shown in the picker
//    name        full name, shown on profiles and rosters
//    abbr        short form for badges
//    color       hex, usually the wing colour
//    awardsQual  a QUAL_STATUS id to set at the same time, or null
//    desc        one line explaining what it certifies
// ═══════════════════════════════════════════════════════════════

// Overall qualification level on an airframe. Lowest to highest.
window.QUAL_STATUS = [
  { id:'iqt',  name:'Initial Qualification Training', abbr:'IQT',   color:'#9aa0b8' },
  { id:'bmc',  name:'Basic Mission Capable',          abbr:'BMC',   color:'#4a90d9' },
  { id:'cmr',  name:'Combat Mission Ready',           abbr:'CMR',   color:'#3dba6e' },
  { id:'ncmr', name:'Non-Combat Mission Ready',       abbr:'N-CMR', color:'#e09030' },
  { id:'ip',   name:'Instructor Pilot',               abbr:'IP',    color:'#c8a951' },
];

window.TRAINING_CERTS = [
  // ── B-1B LANCER · 7th Bomb Wing ──────────────────────────────
  { id:'b1b_module100',  aircraft:'B-1B', wing:'7bw', phase:'Module 100', name:'Local Area Orientation & Aircraft Familiarization', abbr:'LAO/BMC',    color:'#c8a951', awardsQual:'bmc',  desc:'Completion of Module 100. Awards BMC status. Authorizes B-1B operations in local area under IP supervision.' },
  { id:'b1b_instruments',aircraft:'B-1B', wing:'7bw', phase:'Phase 1',    name:'Instrument Qualification',                          abbr:'INST QUAL',  color:'#c8a951', awardsQual:null,   desc:'IFR proficiency, instrument departure, holding, precision ILS, and non-precision RNAV/VOR at KDYS.' },
  { id:'b1b_ils_cert',   aircraft:'B-1B', wing:'7bw', phase:'Phase 1',    name:'ILS Approach Certification',                        abbr:'ILS CERT',   color:'#c8a951', awardsQual:null,   desc:'Precision ILS at KDYS. FMS setup, APR sequence, ATH management below 2,500 ft AGL, DH procedure.' },
  { id:'b1b_rnav_cert',  aircraft:'B-1B', wing:'7bw', phase:'Phase 1',    name:'RNAV/GPS Approach Certification',                   abbr:'RNAV CERT',  color:'#c8a951', awardsQual:null,   desc:'GPS/RNAV approach. NAV HOLD, GPS softkey, FPLN load, V/S descent, MDA level-off.' },
  { id:'b1b_night',      aircraft:'B-1B', wing:'7bw', phase:'Phase 2',    name:'Night Currency Qualification',                      abbr:'NIGHT QUAL', color:'#c8a951', awardsQual:null,   desc:'Night VFR/IFR departure, pattern, instrument approach, and full-stop night landing.' },
  { id:'b1b_ar',         aircraft:'B-1B', wing:'7bw', phase:'Phase 2',    name:'Air Refueling Qualification',                       abbr:'AR QUAL',    color:'#c8a951', awardsQual:null,   desc:'Tanker rejoin, precontact, contact, simulated onload, and breakaway.' },
  { id:'b1b_lowlevel',   aircraft:'B-1B', wing:'7bw', phase:'Phase 2',    name:'Low-Level Navigation Qualification',                abbr:'LL QUAL',    color:'#c8a951', awardsQual:null,   desc:'Low-level route at 500–1,000 ft AGL, terrain clearance, abort criteria.' },
  { id:'b1b_sat',        aircraft:'B-1B', wing:'7bw', phase:'Phase 3',    name:'Surface Attack Certification',                      abbr:'SAT CERT',   color:'#c8a951', awardsQual:null,   desc:'Simulated surface attack with TOT ±30 sec, safe escape maneuver. Grade 3 standard.' },
  { id:'b1b_cmr',        aircraft:'B-1B', wing:'7bw', phase:'CMR',        name:'Combat Mission Ready — B-1B',                       abbr:'B-1B CMR',   color:'#c8a951', awardsQual:'cmr',  desc:'Full CMR on B-1B. All Phase 1/2/3 complete. Current in instruments, night, AR, LL, SAT.' },
  { id:'b1b_ip',         aircraft:'B-1B', wing:'7bw', phase:'IP',         name:'Instructor Pilot — B-1B',                           abbr:'B-1B IP',    color:'#f0cc72', awardsQual:'ip',   desc:'Certified IP on B-1B. Authorized to instruct and evaluate all MQT phases. Sq/CC certified.' },

  // ── B-2 SPIRIT · 509th Bomb Wing ─────────────────────────────
  { id:'b2_iqt',         aircraft:'B-2',  wing:'509bw', phase:'IQT',     name:'B-2 Initial Qualification Training',                 abbr:'B-2 IQT',    color:'#4a90d9', awardsQual:'iqt',  desc:'Initial qualification. Cockpit, MFD, FMS, autopilot, stealth mode. Full IP supervision.' },
  { id:'b2_cockpit',     aircraft:'B-2',  wing:'509bw', phase:'Phase 1', name:'Cockpit Systems Certification',                     abbr:'SYS CERT',   color:'#4a90d9', awardsQual:null,   desc:'All 8 MFD sub-pages, FMS pages, stealth mode, cargo door/hatch operations.' },
  { id:'b2_ils_cert',    aircraft:'B-2',  wing:'509bw', phase:'Phase 1', name:'ILS Approach Certification — B-2',                  abbr:'ILS CERT',   color:'#4a90d9', awardsQual:null,   desc:'Precision ILS on B-2. NAV MODE = NAV required. APP capture, CRS SEL, full sequence.' },
  { id:'b2_weapons',     aircraft:'B-2',  wing:'509bw', phase:'Phase 2', name:'Weapon Delivery Certification',                     abbr:'WPN CERT',   color:'#4a90d9', awardsQual:null,   desc:'Release criteria met, STATS READY FOR RELEASE, cargo door sequence, post-release closure.' },
  { id:'b2_bmc',         aircraft:'B-2',  wing:'509bw', phase:'BMC',     name:'Basic Mission Capable — B-2',                       abbr:'B-2 BMC',    color:'#4a90d9', awardsQual:'bmc',  desc:'BMC on B-2 Spirit. Phase 1 complete. Qualified in basic flight ops and instruments.' },
  { id:'b2_cmr',         aircraft:'B-2',  wing:'509bw', phase:'CMR',     name:'Combat Mission Ready — B-2',                        abbr:'B-2 CMR',    color:'#7ab8ff', awardsQual:'cmr',  desc:'Full CMR on B-2 Spirit. All phases complete.' },
  { id:'b2_ip',          aircraft:'B-2',  wing:'509bw', phase:'IP',      name:'Instructor Pilot — B-2',                            abbr:'B-2 IP',     color:'#f0cc72', awardsQual:'ip',   desc:'Certified IP on B-2 Spirit. All phases, Sq/CC certified.' },

  // ── B-52H STRATOFORTRESS · 2nd Bomb Wing ─────────────────────
  { id:'b52_p1',         aircraft:'B-52H', wing:'2bw', phase:'Phase 1',  name:'Transition & Aircraft Familiarization',              abbr:'TRANS CERT', color:'#3dba6e', awardsQual:null,   desc:'Ground ops, engine start, taxi, takeoff, pattern, go-around, full-stop landing.' },
  { id:'b52_inst',       aircraft:'B-52H', wing:'2bw', phase:'Phase 2',  name:'Instrument Qualification — B-52H',                   abbr:'INST QUAL',  color:'#3dba6e', awardsQual:null,   desc:'IFR departure, holding, ILS to DA, missed approach, instrument full-stop landing.' },
  { id:'b52_ar',         aircraft:'B-52H', wing:'2bw', phase:'Phase 2',  name:'Air Refueling Qualification — B-52H',                abbr:'AR QUAL',    color:'#3dba6e', awardsQual:null,   desc:'Rejoin 270–290 KIAS, precontact, contact, onload with CG monitoring, breakaway.' },
  { id:'b52_ll',         aircraft:'B-52H', wing:'2bw', phase:'Phase 3',  name:'Low-Level Navigation Qualification — B-52H',         abbr:'LL QUAL',    color:'#3dba6e', awardsQual:null,   desc:'Low-level route 500–1,000 ft AGL / 300–360 KCAS, terrain clearance, abort criteria.' },
  { id:'b52_tot',        aircraft:'B-52H', wing:'2bw', phase:'Phase 3',  name:'Surface Attack / TOT Certification — B-52H',         abbr:'SAT/TOT',    color:'#3dba6e', awardsQual:null,   desc:'Simulated surface attack with TOT ±30 sec, safe escape maneuver. Grade 3 standard.' },
  { id:'b52_night',      aircraft:'B-52H', wing:'2bw', phase:'Phase 3',  name:'Night Currency Qualification — B-52H',               abbr:'NIGHT QUAL', color:'#3dba6e', awardsQual:null,   desc:'Night lighting config, night VFR/IFR departure, night instrument approach and landing.' },
  { id:'b52_bmc',        aircraft:'B-52H', wing:'2bw', phase:'BMC',      name:'Basic Mission Capable — B-52H',                      abbr:'B-52 BMC',   color:'#3dba6e', awardsQual:'bmc',  desc:'BMC on B-52H. Phase 1 and 2 complete. Qualified in handling, instruments, AR.' },
  { id:'b52_cmr',        aircraft:'B-52H', wing:'2bw', phase:'CMR',      name:'Combat Mission Ready — B-52H',                       abbr:'B-52 CMR',   color:'#6ddea0', awardsQual:'cmr',  desc:'Full CMR on B-52H. All three phases complete.' },
  { id:'b52_ip',         aircraft:'B-52H', wing:'2bw', phase:'IP',       name:'Instructor Pilot — B-52H',                           abbr:'B-52 IP',    color:'#f0cc72', awardsQual:'ip',   desc:'Certified IP on B-52H Stratofortress. All phases, Sq/CC certified.' },
];

// ── LOOKUP HELPERS ───────────────────────────────────────────
window.certById = function (id) {
  return window.TRAINING_CERTS.find(function (c) { return c.id === id; }) || null;
};
window.qualById = function (id) {
  return window.QUAL_STATUS.find(function (q) { return q.id === id; }) || null;
};
window.certsForAircraft = function (aircraft) {
  if (!aircraft) return window.TRAINING_CERTS.slice();
  return window.TRAINING_CERTS.filter(function (c) {
    return c.aircraft === aircraft || c.aircraft === 'All';
  });
};
// Aircraft list in a stable order, derived from the catalog so adding
// an airframe above is all that's needed.
window.certAircraft = function () {
  const seen = [];
  window.TRAINING_CERTS.forEach(function (c) {
    if (c.aircraft && c.aircraft !== 'All' && seen.indexOf(c.aircraft) === -1) seen.push(c.aircraft);
  });
  return seen;
};
// Certs grouped by phase, preserving catalog order within each group.
window.certsByPhase = function (aircraft) {
  const out = [];
  window.certsForAircraft(aircraft).forEach(function (c) {
    let g = out.find(function (x) { return x.phase === (c.phase || 'Other'); });
    if (!g) { g = { phase: c.phase || 'Other', certs: [] }; out.push(g); }
    g.certs.push(c);
  });
  return out;
};
