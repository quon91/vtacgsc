// ═══════════════════════════════════════════════════════════════
//  VTAC GLOBAL STRIKE COMMAND — FIREBASE CONFIG
//  Replace the firebaseConfig object with YOUR Firebase project
//  values from: console.firebase.google.com → Project Settings
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyBLdlfTeRz9BIRlEaw7M4QPmgrtFin9ueo",
  authDomain:        "vtacgsc.firebaseapp.com",
  databaseURL:       "https://vtacgsc-default-rtdb.firebaseio.com",
  projectId:         "vtacgsc",
  storageBucket:     "vtacgsc.firebasestorage.app",
  messagingSenderId: "644890316006",
  appId:             "1:644890316006:web:4b99f864c98f31f2d47f27",
  measurementId:     "G-W1D1VE7C29"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = firebase.storage();

// ── AUTH PERSISTENCE ─────────────────────────────────────────
// Keep user logged in across page navigation and browser restarts.
// Without this, Firebase may lose auth state between pages.
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(e => {
  console.warn('Auth persistence error:', e);
});

// ── WING / SQUADRON STRUCTURE ────────────────────────────────
const WINGS = {
  '7bw': {
    name: '7th Bomb Wing',
    base: 'Dyess AFB (KDYS)',
    aircraft: ['B-1B Lancer'],
    color: '#c8a951',
    squadrons: {
      '28bs': { name: '28th Bomb Squadron', callsign: 'BONE' },
      '9bs':  { name: '9th Bomb Squadron',  callsign: 'WOLF' },
    }
  },
  '509bw': {
    name: '509th Bomb Wing',
    base: 'Whiteman AFB (KSZL)',
    aircraft: ['B-2 Spirit'],
    color: '#4a90d9',
    squadrons: {
      '13bs': { name: '13th Bomb Squadron', callsign: 'SPIRIT' },
    }
  },
  '2bw': {
    name: '2nd Bomb Wing',
    base: 'Barksdale AFB (KBAD)',
    aircraft: ['B-52H Stratofortress'],
    color: '#3dba6e',
    squadrons: {
      '96bs':  { name: '96th Bomb Squadron',  callsign: 'BUFF' },
      '343bs': { name: '343rd Bomb Squadron', callsign: 'IRON' },
      '11bs':  { name: '11th Bomb Squadron',  callsign: 'STORM' },
    }
  }
};

// ── RANK STRUCTURE ───────────────────────────────────────────
const RANKS = [
  { id: 'rec',   name: 'Recruit',            abbr: 'REC',  level: 0 },
  { id: 'ab',    name: 'Airman Basic',        abbr: 'AB',   level: 1 },
  { id: 'amn',   name: 'Airman',              abbr: 'Amn',  level: 2 },
  { id: 'a1c',   name: 'Airman First Class',  abbr: 'A1C',  level: 3 },
  { id: 'sra',   name: 'Senior Airman',       abbr: 'SrA',  level: 4 },
  { id: 'ssgt',  name: 'Staff Sergeant',      abbr: 'SSgt', level: 5 },
  { id: 'tsgt',  name: 'Technical Sergeant',  abbr: 'TSgt', level: 6 },
  { id: 'msgt',  name: 'Master Sergeant',     abbr: 'MSgt', level: 7 },
  { id: '2lt',   name: 'Second Lieutenant',   abbr: '2Lt',  level: 8 },
  { id: '1lt',   name: 'First Lieutenant',    abbr: '1Lt',  level: 9 },
  { id: 'capt',  name: 'Captain',             abbr: 'Capt', level: 10 },
  { id: 'maj',   name: 'Major',               abbr: 'Maj',  level: 11 },
  { id: 'ltcol', name: 'Lieutenant Colonel',  abbr: 'LtCol',level: 12 },
  { id: 'col',   name: 'Colonel',             abbr: 'Col',  level: 13 },
  { id: 'bgen',  name: 'Brigadier General',   abbr: 'BGen', level: 14 },
  { id: 'mgen',  name: 'Major General',       abbr: 'MGen', level: 15 },
  { id: 'lgen',  name: 'Lt General',          abbr: 'LGen', level: 16 },
  { id: 'gen',   name: 'General',             abbr: 'Gen',  level: 17 },
];

// ── USAF MEDALS & DECORATIONS CATALOG ───────────────────────────
// Categorized real-world USAF decorations, matched against the official
// AFPC "Decorations and Ribbons" reference chart. Master admin (and anyone
// granted the 'award_medals' permission) can award these to pilots.
const MEDALS_CATALOG = [
  // ── Decorations ──
  { id:'medal_honor',        name:'Medal of Honor',                             category:'Decoration', tier:1,  stripes:['#5b92e5'] },
  { id:'afcross',            name:'Air Force Cross',                            category:'Decoration', tier:2,  stripes:['#002868','#bf0a30','#002868'] },
  { id:'def_dsm',            name:'Defense Distinguished Service Medal',        category:'Decoration', tier:3,  stripes:['#c9a04a','#002868','#c9a04a'] },
  { id:'dsm',                name:'Distinguished Service Medal',                category:'Decoration', tier:4,  stripes:['#002868','#bf0a30','#002868'] },
  { id:'silver_star',        name:'Silver Star Medal',                          category:'Decoration', tier:5,  stripes:['#bf0a30','#002868','#ffffff','#002868','#bf0a30'] },
  { id:'def_superior',       name:'Defense Superior Service Medal',             category:'Decoration', tier:6,  stripes:['#5b92e5','#002868','#5b92e5'] },
  { id:'legion_merit',       name:'Legion of Merit',                            category:'Decoration', tier:7,  stripes:['#5b3a78'] },
  { id:'dfc',                name:'Distinguished Flying Cross',                 category:'Decoration', tier:8,  stripes:['#002868','#bf0a30','#ffffff','#bf0a30','#002868'] },
  { id:'airmans_medal',      name:"Airman's Medal",                             category:'Decoration', tier:9,  stripes:['#c9a04a','#002868','#bf0a30','#002868','#c9a04a'] },
  { id:'bronze_star',        name:'Bronze Star Medal',                          category:'Decoration', tier:10, stripes:['#bf0a30','#ffffff','#002868','#ffffff','#bf0a30'] },
  { id:'purple_heart',       name:'Purple Heart',                               category:'Decoration', tier:11, stripes:['#5b3a78','#ffffff','#5b3a78'] },
  { id:'def_meritorious',    name:'Defense Meritorious Service Medal',          category:'Decoration', tier:12, stripes:['#5b92e5','#ffffff','#5b92e5'] },
  { id:'meritorious_svc',    name:'Meritorious Service Medal',                  category:'Decoration', tier:13, stripes:['#3c3b6e','#ffffff','#bf0a30','#ffffff','#3c3b6e'] },
  { id:'air_medal',          name:'Air Medal',                                  category:'Decoration', tier:14, stripes:['#002868','#bf0a30','#002868'] },
  { id:'aerial_achievement', name:'Aerial Achievement Medal',                   category:'Decoration', tier:15, stripes:['#5b92e5','#ffffff','#002868','#ffffff','#5b92e5'] },
  { id:'joint_commendation', name:'Joint Service Commendation Medal',           category:'Decoration', tier:16, stripes:['#5b92e5','#ffffff','#2e8b57','#ffffff','#5b92e5'] },
  { id:'air_space_commendation', name:'Air and Space Commendation Medal',       category:'Decoration', tier:17, stripes:['#bf0a30','#002868','#ffffff','#002868','#bf0a30'] },
  { id:'joint_achievement',  name:'Joint Service Achievement Medal',            category:'Decoration', tier:18, stripes:['#5b92e5','#c9a04a','#5b92e5'] },
  { id:'air_space_achievement', name:'Air and Space Achievement Medal',         category:'Decoration', tier:19, stripes:['#002868','#c9a04a','#bf0a30'] },
  { id:'combat_action',      name:'Combat Action Medal',                       category:'Decoration', tier:20, stripes:['#bf0a30','#002868','#bf0a30'] },

  // ── Unit Awards ──
  { id:'pres_unit',          name:'Presidential Unit Citation',                 category:'Unit Award', tier:1, stripes:['#5b3a78','#c9a04a'] },
  { id:'joint_meritorious_unit', name:'Joint Meritorious Unit Award',           category:'Unit Award', tier:2, stripes:['#5b92e5','#002868','#5b92e5'] },
  { id:'gallant_unit',       name:'Gallant Unit Citation',                      category:'Unit Award', tier:3, stripes:['#1a1a1a','#bf0a30'] },
  { id:'meritorious_unit',   name:'Meritorious Unit Award',                     category:'Unit Award', tier:4, stripes:['#bf0a30','#002868','#bf0a30'] },
  { id:'air_space_outstanding_unit', name:'Air and Space Outstanding Unit Award', category:'Unit Award', tier:5, stripes:['#5b92e5','#c9a04a','#5b92e5'] },
  { id:'air_space_org_excellence', name:'Air and Space Organizational Excellence Award', category:'Unit Award', tier:6, stripes:['#3c3b6e','#5b92e5','#3c3b6e'] },

  // ── Service Awards ──
  { id:'pow_medal',          name:'Prisoner of War Medal',                      category:'Service Award', tier:1, stripes:['#bf0a30','#ffffff','#1a1a1a','#ffffff','#bf0a30'] },
  { id:'combat_readiness',   name:'Combat Readiness Medal',                     category:'Service Award', tier:2, stripes:['#bf0a30','#002868','#bf0a30'] },
  { id:'good_conduct',       name:'Air Force Good Conduct Medal',               category:'Service Award', tier:3, stripes:['#bf0a30','#5b92e5','#bf0a30'] },
  { id:'spaceforce_good_conduct', name:'U.S. Space Force Good Conduct Medal',   category:'Service Award', tier:4, stripes:['#002868','#5b92e5','#002868'] },
  { id:'army_good_conduct',  name:'Army Good Conduct Medal',                    category:'Service Award', tier:5, stripes:['#bf0a30','#ffffff','#bf0a30'] },
  { id:'reserve_meritorious', name:'Air Reserve Forces Meritorious Service Medal', category:'Service Award', tier:6, stripes:['#002868','#c9a04a','#002868'] },
  { id:'outstanding_airman', name:'Outstanding Airman of the Year Ribbon',      category:'Service Award', tier:7, stripes:['#5b92e5','#ffffff','#bf0a30'] },
  { id:'air_space_recognition', name:'Air and Space Recognition Ribbon',        category:'Service Award', tier:8, stripes:['#002868','#c9a04a'] },

  // ── Campaign / Service Medals ──
  { id:'amer_defense',       name:'American Defense Service Medal',             category:'Campaign / Service', tier:1, stripes:['#ffd700','#bf0a30','#002868','#bf0a30','#ffd700'] },
  { id:'amer_campaign',      name:'American Campaign Medal',                    category:'Campaign / Service', tier:2, stripes:['#1a1a1a','#5b92e5','#bf0a30','#5b92e5','#1a1a1a'] },
  { id:'asiatic_pacific',    name:'Asiatic-Pacific Campaign Medal',             category:'Campaign / Service', tier:3, stripes:['#ffd700','#bf0a30','#ffd700','#002868','#ffd700'] },
  { id:'euro_african_me',    name:'Euro-African-Middle Eastern Campaign Medal', category:'Campaign / Service', tier:4, stripes:['#5b92e5','#1a1a1a','#bf0a30','#1a1a1a','#5b92e5'] },
  { id:'wwii_victory',       name:'World War II Victory Medal',                 category:'Campaign / Service', tier:5, stripes:['#bf0a30','#ffd700','#002868'] },
  { id:'army_occupation',    name:'Army of Occupation Medal',                   category:'Campaign / Service', tier:6, stripes:['#1a1a1a','#bf0a30','#1a1a1a'] },
  { id:'humane_action',      name:'Medal for Humane Action',                    category:'Campaign / Service', tier:7, stripes:['#5b92e5','#1a1a1a','#5b92e5'] },
  { id:'natl_defense',       name:'National Defense Service Medal',             category:'Campaign / Service', tier:8, stripes:['#bf0a30','#ffd700','#002868','#ffd700','#bf0a30'] },
  { id:'korean_svc',         name:'Korean Service Medal',                       category:'Campaign / Service', tier:9, stripes:['#002868','#ffffff','#bf0a30'] },
  { id:'antarctica_svc',     name:'Antarctica Service Medal',                   category:'Campaign / Service', tier:10, stripes:['#002868','#ffffff','#1a1a1a'] },
  { id:'afem',               name:'Armed Forces Expeditionary Medal',           category:'Campaign / Service', tier:11, stripes:['#3c3b6e','#ffffff','#bf0a30','#ffffff','#3c3b6e'] },
  { id:'vietnam_svc',        name:'Vietnam Service Medal',                      category:'Campaign / Service', tier:12, stripes:['#ffd700','#bf0a30','#2e8b57','#bf0a30','#ffd700'] },
  { id:'sw_asia_svc',        name:'Southwest Asia Service Medal',               category:'Campaign / Service', tier:13, stripes:['#3c3b6e','#ffd700','#bf0a30','#ffd700','#3c3b6e'] },
  { id:'kosovo_campaign',    name:'Kosovo Campaign Medal',                      category:'Campaign / Service', tier:14, stripes:['#5b3a78','#002868','#bf0a30'] },
  { id:'afghan_campaign',    name:'Afghanistan Campaign Medal',                 category:'Campaign / Service', tier:15, stripes:['#bf0a30','#002868','#ffd700','#2e8b57','#bf0a30'] },
  { id:'iraq_campaign',      name:'Iraq Campaign Medal',                        category:'Campaign / Service', tier:16, stripes:['#1a1a1a','#ffd700','#bf0a30','#ffd700','#1a1a1a'] },
  { id:'inherent_resolve',   name:'Inherent Resolve Campaign Medal',            category:'Campaign / Service', tier:17, stripes:['#bf0a30','#1a1a1a','#ffd700','#1a1a1a','#bf0a30'] },
  { id:'gwot_expeditionary', name:'Global War on Terrorism Expeditionary Medal', category:'Campaign / Service', tier:18, stripes:['#1a1a1a','#bf0a30','#1a1a1a'] },
  { id:'gwot_service',       name:'Global War on Terrorism Service Medal',      category:'Campaign / Service', tier:19, stripes:['#1a1a1a','#ffd700','#1a1a1a'] },
  { id:'korea_defense',      name:'Korean Defense Service Medal',               category:'Campaign / Service', tier:20, stripes:['#002868','#bf0a30','#ffffff','#bf0a30','#002868'] },
  { id:'afsm',               name:'Armed Forces Service Medal',                 category:'Campaign / Service', tier:21, stripes:['#002868','#5b92e5','#ffffff','#5b92e5','#002868'] },
  { id:'humanitarian',       name:'Humanitarian Service Medal',                 category:'Campaign / Service', tier:22, stripes:['#5b92e5','#ffffff','#bf0a30'] },
  { id:'mil_outstanding_vol', name:'Military Outstanding Volunteer Service Medal', category:'Campaign / Service', tier:23, stripes:['#5b3a78','#ffffff','#5b3a78'] },
  { id:'remote_combat',      name:'Remote Combat Effects Campaign Medal',       category:'Campaign / Service', tier:24, stripes:['#1a1a1a','#5b92e5','#1a1a1a'] },
  { id:'air_space_campaign', name:'Air and Space Campaign Medal',               category:'Campaign / Service', tier:25, stripes:['#002868','#c9a04a','#bf0a30'] },
  { id:'nuclear_deterrence', name:'Nuclear Deterrence Operations Service Medal', category:'Campaign / Service', tier:26, stripes:['#1a1a1a','#5b92e5','#ffd700'] },

  // ── Service Ribbons & Training ──
  { id:'overseas_short',     name:'Air and Space Overseas Ribbon - Short Tour', category:'Service Ribbon', tier:1, stripes:['#bf0a30','#5b92e5','#bf0a30'] },
  { id:'overseas_long',      name:'Air and Space Overseas Ribbon - Long Tour',  category:'Service Ribbon', tier:2, stripes:['#1a1a1a','#5b92e5','#1a1a1a'] },
  { id:'expeditionary_svc',  name:'Air and Space Expeditionary Service Ribbon', category:'Service Ribbon', tier:3, stripes:['#002868','#c9a04a','#bf0a30'] },
  { id:'longevity',          name:'Air and Space Longevity Service Award',      category:'Service Ribbon', tier:4, stripes:['#5b92e5','#ffffff','#5b92e5'] },
  { id:'dev_special_duty',   name:'Developmental Special Duty Ribbon',          category:'Service Ribbon', tier:5, stripes:['#bf0a30','#1a1a1a','#bf0a30'] },
  { id:'bmt_instructor',     name:'Air Force Basic Military Training Instructor Ribbon', category:'Service Ribbon', tier:6, stripes:['#5b92e5','#ffd700','#5b92e5'] },
  { id:'recruiter_ribbon',   name:'Air Force Recruiter Ribbon',                 category:'Service Ribbon', tier:7, stripes:['#002868','#ffffff','#2e8b57'] },
  { id:'reserve_armed_forces', name:'Armed Forces Reserve Medal',               category:'Service Ribbon', tier:8, stripes:['#3c3b6e','#bf0a30','#3c3b6e'] },
  { id:'nco_pme_grad',       name:'USAF NCO PME Graduate Ribbon',               category:'Service Ribbon', tier:9, stripes:['#bf0a30','#ffffff','#bf0a30'] },
  { id:'bmt_honor_grad',     name:'Basic Military Training Honor Graduate Ribbon', category:'Service Ribbon', tier:10, stripes:['#5b92e5','#ffd700'] },
  { id:'small_arms',         name:'Small Arms Expert Marksmanship Ribbon',      category:'Service Ribbon', tier:11, stripes:['#3c3b6e','#ffd700'] },
  { id:'training_ribbon',    name:'Air and Space Training Ribbon',              category:'Service Ribbon', tier:12, stripes:['#5b92e5','#ffd700','#5b92e5'] },

  // ── Foreign & Allied Awards ──
  { id:'philippine_defense', name:'Philippine Defense Medal',                   category:'Foreign / Allied', tier:1, stripes:['#bf0a30','#002868','#bf0a30'] },
  { id:'philippine_liberation', name:'Philippine Liberation Medal',             category:'Foreign / Allied', tier:2, stripes:['#bf0a30','#002868','#ffd700','#002868','#bf0a30'] },
  { id:'philippine_independence', name:'Philippine Independence Medal',         category:'Foreign / Allied', tier:3, stripes:['#bf0a30','#002868'] },
  { id:'philippine_pres_unit', name:'Philippine Presidential Unit Citation',    category:'Foreign / Allied', tier:4, stripes:['#ffd700'] },
  { id:'rok_pres_unit',      name:'Republic of Korea Presidential Unit Citation', category:'Foreign / Allied', tier:5, stripes:['#5b92e5','#bf0a30','#5b92e5'] },
  { id:'rvn_gallantry',      name:'RVN Gallantry Cross with Palm',              category:'Foreign / Allied', tier:6, stripes:['#bf0a30','#ffffff','#bf0a30','#ffffff','#bf0a30'] },
  { id:'un_service',         name:'United Nations Service Medal',               category:'Foreign / Allied', tier:7, stripes:['#5b92e5'] },
  { id:'un_medal',           name:'United Nations Medal',                       category:'Foreign / Allied', tier:8, stripes:['#5b92e5','#ffffff'] },
  { id:'nato_meritorious',   name:'NATO Meritorious Service Medal',             category:'Foreign / Allied', tier:9, stripes:['#1a1a1a','#5b92e5','#1a1a1a'] },
  { id:'nato_yugoslavia',    name:'NATO Medal for Yugoslavia',                  category:'Foreign / Allied', tier:10, stripes:['#5b92e5','#1a1a1a','#5b92e5'] },
  { id:'nato_kosovo',        name:'NATO Medal for Kosovo',                      category:'Foreign / Allied', tier:11, stripes:['#5b92e5','#ffd700','#5b92e5'] },
  { id:'nato_eagle_assist',  name:'Article 5 NATO Medal - Eagle Assist',        category:'Foreign / Allied', tier:12, stripes:['#5b3a78','#1a1a1a','#5b3a78'] },
  { id:'nato_active_endeavour', name:'Article 5 NATO Medal - Active Endeavour', category:'Foreign / Allied', tier:13, stripes:['#5b3a78','#5b92e5','#5b3a78'] },
  { id:'nato_balkans',       name:'Non Article 5 NATO Medal - Balkans',         category:'Foreign / Allied', tier:14, stripes:['#5b92e5','#bf0a30','#5b92e5'] },
  { id:'nato_isaf',          name:'Non Article 5 NATO Medal - International Security Assistance Force', category:'Foreign / Allied', tier:15, stripes:['#5b92e5','#1a1a1a','#ffd700'] },
  { id:'rvn_campaign',       name:'Republic of Vietnam Campaign Medal',         category:'Foreign / Allied', tier:16, stripes:['#bf0a30','#2e8b57','#bf0a30'] },
  { id:'kuwait_lib_ksa',     name:'Kuwait Liberation Medal (Kingdom of Saudi Arabia)', category:'Foreign / Allied', tier:17, stripes:['#2e8b57','#ffffff','#1a1a1a','#bf0a30'] },
  { id:'kuwait_lib_kuwait',  name:'Kuwait Liberation Medal (Government of Kuwait)', category:'Foreign / Allied', tier:18, stripes:['#bf0a30','#1a1a1a','#5b92e5'] },
  { id:'rok_war_svc',        name:'Republic of Korea Korean War Service Medal', category:'Foreign / Allied', tier:19, stripes:['#002868','#bf0a30','#ffffff'] },
];


// ── PILOT / AIRCREW WINGS TIERS ──────────────────────────────────
const WINGS_BADGES = [
  { id:'wings_basic',   name:'Basic Pilot Wings',   tier:1, desc:'Awarded upon completion of initial qualification training.' },
  { id:'wings_senior',  name:'Senior Pilot Wings',  tier:2, desc:'Awarded for sustained flight experience and proficiency.' },
  { id:'wings_command', name:'Command Pilot Wings', tier:3, desc:'The highest pilot rating, awarded for extensive flight leadership and experience.' },
];

// ── RIBBON & WINGS SVG RENDERING ─────────────────────────────────
// Renders an authentic-style ribbon bar (small rectangle with vertical stripes)
// matching real USAF ribbon color patterns. Returns an <svg> string.
function renderRibbonSVG(medalId, w, h) {
  w = w || 44; h = h || 16;
  const medal = MEDALS_CATALOG.find(m => m.id === medalId);
  const stripes = medal?.stripes || ['#888888'];
  const stripeW = w / stripes.length;
  const rects = stripes.map((color, i) =>
    `<rect x="${(i*stripeW).toFixed(2)}" y="0" width="${stripeW.toFixed(2)}" height="${h}" fill="${color}"/>`
  ).join('');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;border-radius:1px;box-shadow:0 1px 2px rgba(0,0,0,.4)">
    ${rects}
    <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="0.75"/>
  </svg>`;
}

// Renders a pilot wings badge using the authentic USAF Pilot Badge artwork
// (Basic / Senior / Command), served as static SVG assets under
// /assets/wings/. These are real badge vector files, not hand-drawn
// approximations — see public/assets/wings/ for the source SVGs.
const WINGS_BADGE_FILES = {
  1: '/assets/wings/wings_basic.svg',
  2: '/assets/wings/wings_senior.svg',
  3: '/assets/wings/wings_command.svg',
};
function renderWingsBadgeSVG(badgeId, size) {
  size = size || 32;
  const tier = WINGS_BADGES.find(w => w.id === badgeId)?.tier || 1;
  const src = WINGS_BADGE_FILES[tier] || WINGS_BADGE_FILES[1];
  // Real badge artwork is ~3.1:1 aspect ratio (basic) to ~2:1 (command, taller due to wreath)
  const aspect = tier >= 3 ? 0.5 : tier === 2 ? 0.4 : 0.32;
  return `<img src="${src}" width="${size}" height="${Math.round(size*aspect)}" style="display:block;object-fit:contain" alt="${(WINGS_BADGES.find(w=>w.id===badgeId)?.name)||'Pilot Wings'}"/>`;
}


const ALL_PERMISSIONS = [
  { id: 'approve_pilots',    label: 'Approve / deny pilot applications' },
  { id: 'edit_ranks',        label: 'Edit pilot ranks & roles' },
  { id: 'edit_own_wing',     label: 'Edit own wing (history, bases, training, callsigns)' },
  { id: 'edit_any_wing',     label: 'Edit any wing (not just their own)' },
  { id: 'manage_wings',      label: 'Create / delete wings & squadrons' },
  { id: 'manage_roles',      label: 'Create / edit roles & permissions' },
  { id: 'post_news',         label: 'Post site announcements' },
  { id: 'manage_slideshow',  label: 'Manage homepage slideshow' },
  { id: 'customize_site',    label: 'Customize site colors & branding' },
  { id: 'view_all_flights',  label: 'View all flight logs (not just own)' },
  { id: 'delete_flights',    label: 'Delete any flight log entry' },
  { id: 'manage_training',   label: 'Edit training modules' },
  { id: 'award_medals',      label: 'Award medals, ribbons & pilot wings' },
];

// ── ROLES — defaults used until Firestore overrides are loaded ─────────
// isMasterAdmin / isHidden are special: master_admin grants ALL permissions
// silently without showing "Master Admin" anywhere in the UI.
const DEFAULT_ROLES = {
  master_admin:   { name: 'Wing Commander', level: 99, color: '#c8a951', isMasterAdmin: true, permissions: [] },
  wing_commander: { name: 'Wing Commander',      level: 10, color: '#c8a951', permissions: ['edit_ranks','edit_own_wing','manage_training'] },
  sq_commander:   { name: 'Squadron Commander',  level: 8,  color: '#f0cc72', permissions: ['edit_own_wing'] },
  instructor:     { name: 'Instructor',          level: 5,  color: '#4a90d9', permissions: ['manage_training'] },
  pilot:          { name: 'Pilot',               level: 2,  color: '#3dba6e', permissions: [] },
  trainee:        { name: 'Trainee',             level: 1,  color: '#9aa0b8', permissions: [] },
  pending:        { name: 'Pending Approval',    level: 0,  color: '#e09030', permissions: [] },
};

// ROLES starts as the defaults; gets overwritten once Firestore loads (see below)
let ROLES = JSON.parse(JSON.stringify(DEFAULT_ROLES));

// Load custom roles from Firestore — merges with/overrides defaults
async function loadRolesFromFirestore() {
  try {
    const snap = await db.collection('settings').doc('roles').get();
    if (snap.exists && snap.data().roles) {
      const customRoles = snap.data().roles;
      ROLES = { ...DEFAULT_ROLES, ...customRoles };
      // master_admin always stays hidden + has every permission, regardless of edits
      ROLES.master_admin = {
        ...(ROLES.master_admin || DEFAULT_ROLES.master_admin),
        isMasterAdmin: true,
      };
    }
  } catch(e) { console.warn('Could not load custom roles, using defaults', e); }
}

// ── MULTI-ROLE SUPPORT ──────────────────────────────────────────
// Pilots can hold multiple roles (e.g. Wing Commander + Instructor).
// pilot.roles is an array of role IDs. Falls back to legacy pilot.role
// (single string) for older accounts that haven't been migrated yet.
function getPilotRoleIds(pilot) {
  if (!pilot) return ['pending'];
  if (Array.isArray(pilot.roles) && pilot.roles.length) return pilot.roles;
  if (pilot.role) return [pilot.role];
  return ['pending'];
}

// Check if a pilot has a specific permission across ANY of their roles
function hasPermission(pilot, permId) {
  if (!pilot) return false;
  const roleIds = getPilotRoleIds(pilot);
  for (const rid of roleIds) {
    const role = ROLES[rid];
    if (!role) continue;
    if (role.isMasterAdmin) return true; // master admin silently has everything
    if ((role.permissions || []).includes(permId)) return true;
  }
  return false;
}

function isMasterAdminPilot(pilot) {
  return getPilotRoleIds(pilot).some(rid => ROLES[rid]?.isMasterAdmin);
}

// Get the SINGLE highest-authority role to display as primary (hides master_admin identity)
function getDisplayRole(pilot) {
  if (!pilot) return ROLES.pending;
  const roleIds = getPilotRoleIds(pilot);
  // If they hold the hidden master_admin role, show their chosen public title instead
  if (roleIds.some(rid => ROLES[rid]?.isMasterAdmin)) {
    return {
      name:  pilot.publicTitle || 'Wing Commander',
      color: pilot.publicColor || '#c8a951',
      level: 99,
    };
  }
  // Otherwise show whichever held role has the highest authority level
  let best = null;
  for (const rid of roleIds) {
    const role = ROLES[rid];
    if (!role) continue;
    if (!best || (role.level||0) > (best.level||0)) best = role;
  }
  return best || ROLES.pending;
}

// Get ALL display roles for a pilot (for showing multiple badges, e.g. "Wing Commander" + "Instructor")
function getAllDisplayRoles(pilot) {
  if (!pilot) return [ROLES.pending];
  const roleIds = getPilotRoleIds(pilot);
  const out = [];
  for (const rid of roleIds) {
    const role = ROLES[rid];
    if (!role) continue;
    if (role.isMasterAdmin) {
      out.push({ name: pilot.publicTitle || 'Wing Commander', color: pilot.publicColor || '#c8a951', level: 99 });
    } else {
      out.push(role);
    }
  }
  return out.length ? out.sort((a,b)=>(b.level||0)-(a.level||0)) : [ROLES.pending];
}

// ── VIEW AS — ROLE SIMULATION (master admin only) ───────────────
// Lets the master admin preview the site as any role, or as a
// logged-out visitor. The selected role lives in sessionStorage
// (dies when the tab closes) and is ONLY honored after verifying
// that the REAL signed-in pilot holds the master_admin role — a
// non-admin setting this key by hand gets it silently cleared.
//
// IMPORTANT: this is a UI/permission simulation only. Firestore
// security rules still see the real authenticated account, so any
// write made while previewing is still made with real admin access.
const VIEWAS_KEY = 'vtac_viewas';

function getViewAsOverride() {
  try { return sessionStorage.getItem(VIEWAS_KEY) || null; } catch(e) { return null; }
}
function clearViewAsOverride() {
  try { sessionStorage.removeItem(VIEWAS_KEY); } catch(e) {}
}

// ── SITE LOCKDOWN — LOGIN REQUIRED EVERYWHERE ────────────────
// The entire site requires a signed-in account. Only the pages
// listed here are reachable while logged out; every other page
// redirects to the login page before showing anything.
const PUBLIC_PAGES = ['/pages/login.html', '/pages/register.html'];

function isPublicPage() {
  const p = window.location.pathname;
  return PUBLIC_PAGES.some(pub => p === pub || p.endsWith(pub));
}

// Anti-flash guard: hide the page until auth status is confirmed,
// so logged-out visitors never see even a flicker of content
// before the redirect fires. Public pages are never hidden.
if (!isPublicPage()) {
  document.documentElement.style.visibility = 'hidden';
}
function revealPage() {
  document.documentElement.style.visibility = '';
}

// ── AUTH STATE WATCHER ───────────────────────────────────────
let currentUser   = null;
let currentPilot  = null;
let realPilot     = null;   // the TRUE pilot doc — never touched by View As

auth.onAuthStateChanged(async (user) => {
  await loadRolesFromFirestore(); // ensure custom roles/permissions are loaded first
  if (user) {
    currentUser = user;
    try {
      const doc = await db.collection('pilots').doc(user.uid).get();
      if (doc.exists) {
        realPilot    = { uid: user.uid, ...doc.data() };
        currentPilot = realPilot;

        // Status redirects always use the REAL pilot, never the simulation
        if (realPilot.status === 'pending' && !isPendingPage()) {
          window.location.href = '/pages/pending.html';
          return;
        }
        if (realPilot.status === 'denied') {
          auth.signOut();
          window.location.href = '/pages/login.html?denied=1';
          return;
        }

        // Apply View As override — only for a verified master admin
        const viewAs = getViewAsOverride();
        if (viewAs && isMasterAdminPilot(realPilot)) {
          if (typeof renderViewAsBanner === 'function') renderViewAsBanner(viewAs);
          if (viewAs === 'logged_out') {
            // Simulate a logged-out visitor site-wide.
            // NOTE: with the site lockdown active, a REAL logged-out
            // visitor is redirected to the login page — this simulation
            // shows the logged-out nav state without kicking you out,
            // so you can still navigate and use the Exit bar.
            currentUser  = null;
            currentPilot = null;
            revealPage();
            if (typeof updateNavUI === 'function') updateNavUI(null, null);
            onAuthReady(null, null);
            return;
          }
          // Simulate holding ONLY the selected role (strip master admin
          // and the public title/color so nothing leaks through)
          currentPilot = { ...realPilot, role: viewAs, roles: [viewAs], publicTitle: null, publicColor: null };
        } else if (viewAs) {
          clearViewAsOverride(); // set by a non-admin — ignore and clean up
        }
      }
    } catch(e) { console.error('Pilot load error:', e); }
    revealPage(); // signed in — show the page
    if (typeof updateNavUI === 'function') updateNavUI(currentUser, currentPilot);
    onAuthReady(currentUser, currentPilot);
  } else {
    currentUser  = null;
    currentPilot = null;
    realPilot    = null;
    clearViewAsOverride();
    // LOCKDOWN: logged out + not on a public page → straight to login
    if (!isPublicPage()) {
      window.location.replace('/pages/login.html');
      return;
    }
    revealPage();
    if (typeof updateNavUI === 'function') updateNavUI(null, null);
    onAuthReady(null, null);
  }
});

function isPendingPage() {
  return window.location.pathname.includes('pending') ||
         window.location.pathname.includes('login')   ||
         window.location.pathname.includes('register');
}

// Override in each page
function onAuthReady(user, pilot) {}

// ── HELPERS ──────────────────────────────────────────────────
function requireAuth() {
  if (!currentUser) window.location.href = '/pages/login.html';
}
function requireRole(minLevel) {
  requireAuth();
  const roleIds = getPilotRoleIds(currentPilot);
  const maxLevel = Math.max(0, ...roleIds.map(rid => ROLES[rid]?.level || 0));
  if (maxLevel < minLevel) window.location.href = '/index.html';
}
function requireMasterAdmin() {
  requireAuth();
  if (!isMasterAdminPilot(currentPilot)) window.location.href = '/index.html';
}

function getRankName(rankId) {
  return RANKS.find(r => r.id === rankId)?.name || rankId;
}
function getRankAbbr(rankId) {
  return RANKS.find(r => r.id === rankId)?.abbr || rankId;
}
function getWingName(wingId) { return WINGS[wingId]?.name || wingId; }
function getSqName(wingId, sqId) { return WINGS[wingId]?.squadrons[sqId]?.name || sqId; }

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}
function formatDateTime(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

function toast(msg, type='success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 22px;border-radius:22px;font-size:13px;font-weight:600;z-index:9999;pointer-events:none;opacity:0;transition:opacity .3s;font-family:var(--sans)';
    document.body.appendChild(t);
  }
  const colors = { success:'#3dba6e', error:'#d04040', info:'#4a90d9', warn:'#e09030' };
  t.style.background = colors[type] || colors.success;
  t.style.color = '#fff';
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 3000);
}

function showLoading(msg='Loading...') {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:8888;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;backdrop-filter:blur(4px)';
    overlay.innerHTML = `<div style="width:40px;height:40px;border:3px solid #333;border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite"></div><div style="color:#fff;font-size:14px;font-family:var(--sans)">${msg}</div>`;
    document.body.appendChild(overlay);
  }
}
function hideLoading() {
  const o = document.getElementById('loading-overlay');
  if (o) o.remove();
}
