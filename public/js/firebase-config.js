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
// ═══════════════════════════════════════════════════════════════
//  VTAC GSC — TRAINING CERTIFICATIONS CATALOG
//  Add this block to firebase-config.js after the WINGS_BADGES section.
//  Based on real USAF AFMAN 11-2B-1V1, AFMAN 11-2B-2V1, AFMAN 11-2B-52V1
//  qualification frameworks and the B-1 MQT Handbook (Dyess AFB).
// ═══════════════════════════════════════════════════════════════

// ── TRAINING QUALIFICATION STATUS LEVELS ────────────────────────
// These mirror the real USAF bomber aircrew qualification framework.
// IQT → BMC → CMR is the standard progression path.
const QUAL_STATUS = [
  {
    id:    'iqt',
    name:  'Initial Qualification Training',
    abbr:  'IQT',
    color: '#9aa0b8',
    desc:  'Currently in Initial Qualification Training. Under full IP supervision. Not authorized for unsupervised flight.',
  },
  {
    id:    'bmc',
    name:  'Basic Mission Capable',
    abbr:  'BMC',
    color: '#4a90d9',
    desc:  'Completed IQT and MQT. Qualified in some aspects of the unit mission. Must be able to attain CMR within 30 days of tasking.',
  },
  {
    id:    'cmr',
    name:  'Combat Mission Ready',
    abbr:  'CMR',
    color: '#3dba6e',
    desc:  'Fully mission qualified. Current and proficient in all assigned mission areas. Primary designation for combat-coded positions.',
  },
  {
    id:    'ncmr',
    name:  'Non-Combat Mission Ready',
    abbr:  'N-CMR',
    color: '#e09030',
    desc:  'Was CMR; has regressed due to time/currency. Must complete re-qualification program before returning to CMR status.',
  },
  {
    id:    'ip',
    name:  'Instructor Pilot',
    abbr:  'IP',
    color: '#c8a951',
    desc:  'Certified to instruct student pilots. Requires additional upgrade training and Sq/CC certification beyond CMR.',
  },
];

// ── TRAINING CERTIFICATIONS CATALOG ─────────────────────────────
// Aircraft-specific certifications awarded by IPs and Wing Commanders.
// Organized by aircraft MDS and phase, matching the real AFMAN training
// framework for AFGSC bomber crews.
const TRAINING_CERTS = [

  // ══════════════════════════════════════════════════
  //  B-1B LANCER — 7th Bomb Wing / KDYS
  //  Based on AFMAN 11-2B-1V1 and B-1 MQT Handbook
  // ══════════════════════════════════════════════════
  {
    id:       'b1b_module100',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'Module 100',
    name:     'Local Area Orientation & Aircraft Familiarization',
    abbr:     'LAO/BMC',
    color:    '#c8a951',
    desc:     'Completion of Module 100. Local Area Orientation / Instrument element mandatory. Awards Basic Mission Capable (BMC) status and authorizes operation of the B-1B in the local area under instructor supervision.',
    awardsQual: 'bmc',
  },
  {
    id:       'b1b_instruments',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'Phase 1',
    name:     'Instrument Qualification',
    abbr:     'INST QUAL',
    color:    '#c8a951',
    desc:     'IFR proficiency, instrument departure, holding procedures, precision ILS approach (CAT I), and non-precision RNAV/VOR approach to published minimums at KDYS.',
    awardsQual: null,
  },
  {
    id:       'b1b_ils_cert',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'Phase 1',
    name:     'ILS Approach Certification',
    abbr:     'ILS CERT',
    color:    '#c8a951',
    desc:     'Demonstrated proficiency in precision ILS approach at KDYS. Covers FMS NAV page setup, PFD softkey selection, APR mode sequence (LOC → G/S capture), ATH management below 2,500 ft AGL, and decision height procedure.',
    awardsQual: null,
  },
  {
    id:       'b1b_rnav_cert',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'Phase 1',
    name:     'RNAV/GPS Approach Certification',
    abbr:     'RNAV CERT',
    color:    '#c8a951',
    desc:     'Demonstrated proficiency in GPS/RNAV approach. Covers NAV HOLD (not APR), GPS PFD softkey, FPLN loading, manual V/S descent management from FAF, and MDA level-off.',
    awardsQual: null,
  },
  {
    id:       'b1b_night',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'Phase 2',
    name:     'Night Currency Qualification',
    abbr:     'NIGHT QUAL',
    color:    '#c8a951',
    desc:     'Night VFR departure, night traffic pattern, night instrument approach, and night full-stop landing. Lighting configuration and night-currency proficiency demonstrated.',
    awardsQual: null,
  },
  {
    id:       'b1b_ar',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'Phase 2',
    name:     'Air Refueling Qualification',
    abbr:     'AR QUAL',
    color:    '#c8a951',
    desc:     'Tanker rejoin (point-parallel or enroute), precontact, contact, simulated onload, and breakaway procedures. Demonstrated proficiency in stabilized contact and crew coordination.',
    awardsQual: null,
  },
  {
    id:       'b1b_lowlevel',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'Phase 2',
    name:     'Low-Level Navigation Qualification',
    abbr:     'LL QUAL',
    color:    '#c8a951',
    desc:     'Low-level navigation route at 500–1,000 ft AGL. Route study, MSA awareness, terrain clearance planning, and abort criteria briefed and demonstrated.',
    awardsQual: null,
  },
  {
    id:       'b1b_sat',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'Phase 3',
    name:     'Surface Attack Certification',
    abbr:     'SAT CERT',
    color:    '#c8a951',
    desc:     'Simulated surface attack with Time-on-Target (TOT ±30 sec) control. IP-to-target run, weapons release, and safe escape maneuver demonstrated to grade 3 standard.',
    awardsQual: null,
  },
  {
    id:       'b1b_cmr',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'CMR',
    name:     'Combat Mission Ready — B-1B',
    abbr:     'B-1B CMR',
    color:    '#c8a951',
    desc:     'Full Combat Mission Ready qualification on the B-1B Lancer. All Phase 1, 2, and 3 training complete. Current and proficient in instruments, night, air refueling, low-level navigation, and surface attack.',
    awardsQual: 'cmr',
  },
  {
    id:       'b1b_ip',
    aircraft: 'B-1B',
    wing:     '7bw',
    phase:    'IP',
    name:     'Instructor Pilot Qualification — B-1B',
    abbr:     'B-1B IP',
    color:    '#f0cc72',
    desc:     'Certified Instructor Pilot on the B-1B Lancer. Authorized to instruct and evaluate student pilots in all phases of MQT. Requires Sq/CC certification.',
    awardsQual: 'ip',
  },

  // ══════════════════════════════════════════════════
  //  B-2 SPIRIT — 509th Bomb Wing / KSZL
  //  Based on AFMAN 11-2B-2V1 framework
  // ══════════════════════════════════════════════════
  {
    id:       'b2_iqt',
    aircraft: 'B-2',
    wing:     '509bw',
    phase:    'IQT',
    name:     'B-2 Initial Qualification Training',
    abbr:     'B-2 IQT',
    color:    '#4a90d9',
    desc:     'Initial qualification on the B-2 Spirit. Covers cockpit familiarization, MFD system (8 displays), FMS/CDU keypad operation, autopilot modes, stealth mode procedures, and basic airwork. Currently under full IP supervision.',
    awardsQual: 'iqt',
  },
  {
    id:       'b2_cockpit_cert',
    aircraft: 'B-2',
    wing:     '509bw',
    phase:    'Phase 1',
    name:     'Cockpit Systems Certification',
    abbr:     'SYS CERT',
    color:    '#4a90d9',
    desc:     'Demonstrated knowledge of all 8 MFD sub-pages (HUD, NAV, GPS, ECS, FUEL, FCH, ENG, STATS), FMS COMM/NAV/PRFM/FPLN pages, stealth mode procedures, and cargo door/crew hatch operations.',
    awardsQual: null,
  },
  {
    id:       'b2_ils_cert',
    aircraft: 'B-2',
    wing:     '509bw',
    phase:    'Phase 1',
    name:     'ILS Approach Certification — B-2',
    abbr:     'ILS CERT',
    color:    '#4a90d9',
    desc:     'Precision ILS approach on the B-2. FMS NAV MODE = NAV required for APP mode. CRS SEL, APP capture, and full autopilot sequence demonstrated to IP standard.',
    awardsQual: null,
  },
  {
    id:       'b2_weapons_cert',
    aircraft: 'B-2',
    wing:     '509bw',
    phase:    'Phase 2',
    name:     'Weapon Delivery Certification',
    abbr:     'WPN CERT',
    color:    '#4a90d9',
    desc:     'Simulated weapons delivery. Release criteria met (>20,000 ft AGL, >230 KIAS, wings level), STATS page READY FOR RELEASE confirmed, cargo door sequence, and bomb bay door closure after release.',
    awardsQual: null,
  },
  {
    id:       'b2_bmc',
    aircraft: 'B-2',
    wing:     '509bw',
    phase:    'BMC',
    name:     'Basic Mission Capable — B-2',
    abbr:     'B-2 BMC',
    color:    '#4a90d9',
    desc:     'Basic Mission Capable on the B-2 Spirit. IQT and MQT Phase 1 complete. Qualified in basic flight operations, systems, and instrument procedures.',
    awardsQual: 'bmc',
  },
  {
    id:       'b2_cmr',
    aircraft: 'B-2',
    wing:     '509bw',
    phase:    'CMR',
    name:     'Combat Mission Ready — B-2',
    abbr:     'B-2 CMR',
    color:    '#7ab8ff',
    desc:     'Full Combat Mission Ready qualification on the B-2 Spirit. All phases complete including instruments, weapons delivery, and night operations.',
    awardsQual: 'cmr',
  },
  {
    id:       'b2_ip',
    aircraft: 'B-2',
    wing:     '509bw',
    phase:    'IP',
    name:     'Instructor Pilot Qualification — B-2',
    abbr:     'B-2 IP',
    color:    '#f0cc72',
    desc:     'Certified Instructor Pilot on the B-2 Spirit. Authorized to instruct and evaluate student pilots in all phases of B-2 MQT.',
    awardsQual: 'ip',
  },

  // ══════════════════════════════════════════════════
  //  B-52H STRATOFORTRESS — 2nd Bomb Wing / KBAD
  //  Based on AFMAN 11-2B-52V1
  // ══════════════════════════════════════════════════
  {
    id:       'b52_module100',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'Phase 1',
    name:     'Transition & Aircraft Familiarization',
    abbr:     'TRANS CERT',
    color:    '#3dba6e',
    desc:     'Normal ground operations, engine start, taxi (max 25 kts/10 kts turns), takeoff, VFR pattern work, closed patterns, go-around, and full-stop landing. TOLD speeds and checklist discipline demonstrated.',
    awardsQual: null,
  },
  {
    id:       'b52_instruments',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'Phase 2',
    name:     'Instrument Qualification — B-52H',
    abbr:     'INST QUAL',
    color:    '#3dba6e',
    desc:     'Instrument departure, enroute IFR navigation, holding procedures, ILS approach to DA, missed approach execution, and instrument full-stop landing demonstrated.',
    awardsQual: null,
  },
  {
    id:       'b52_ar',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'Phase 2',
    name:     'Air Refueling Qualification — B-52H',
    abbr:     'AR QUAL',
    color:    '#3dba6e',
    desc:     'Tanker rejoin at 270–290 KIAS, precontact stabilization, contact, simulated onload with continuous CG monitoring, and breakaway procedures. Mass/inertia management demonstrated.',
    awardsQual: null,
  },
  {
    id:       'b52_lowlevel',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'Phase 3',
    name:     'Low-Level Navigation Qualification — B-52H',
    abbr:     'LL QUAL',
    color:    '#3dba6e',
    desc:     'Low-level navigation route at 500–1,000 ft AGL, 300–360 KCAS. Route study, MSA, terrain clearance, and abort criteria. Altitude and route discipline demonstrated.',
    awardsQual: null,
  },
  {
    id:       'b52_tot',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'Phase 3',
    name:     'Surface Attack / TOT Certification — B-52H',
    abbr:     'SAT/TOT',
    color:    '#3dba6e',
    desc:     'Simulated surface attack with Time-on-Target control (±30 sec window). IP-to-target run, simulated weapons release, and safe escape maneuver demonstrated to grade 3 standard.',
    awardsQual: null,
  },
  {
    id:       'b52_night',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'Phase 3',
    name:     'Night Currency Qualification — B-52H',
    abbr:     'NIGHT QUAL',
    color:    '#3dba6e',
    desc:     'Night exterior/interior lighting configuration, night VFR departure, night instrument approach, and night full-stop landing. Night currency requirements demonstrated.',
    awardsQual: null,
  },
  {
    id:       'b52_bmc',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'BMC',
    name:     'Basic Mission Capable — B-52H',
    abbr:     'B-52 BMC',
    color:    '#3dba6e',
    desc:     'Basic Mission Capable on the B-52H Stratofortress. Phase 1 and 2 complete. Qualified in aircraft handling, instruments, and air refueling.',
    awardsQual: 'bmc',
  },
  {
    id:       'b52_cmr',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'CMR',
    name:     'Combat Mission Ready — B-52H',
    abbr:     'B-52 CMR',
    color:    '#6ddea0',
    desc:     'Full Combat Mission Ready qualification on the B-52H Stratofortress. All three phases complete: instruments, AR, low-level navigation, surface attack/TOT, and night operations.',
    awardsQual: 'cmr',
  },
  {
    id:       'b52_ip',
    aircraft: 'B-52H',
    wing:     '2bw',
    phase:    'IP',
    name:     'Instructor Pilot Qualification — B-52H',
    abbr:     'B-52 IP',
    color:    '#f0cc72',
    desc:     'Certified Instructor Pilot on the B-52H Stratofortress. Authorized to instruct and evaluate student pilots in all phases of B-52H MQT.',
    awardsQual: 'ip',
  },
];

// Helper: get all certs for a specific aircraft
function getCertsForAircraft(aircraft) {
  return TRAINING_CERTS.filter(c => c.aircraft === aircraft);
}

// Helper: get all certs for a specific wing
function getCertsForWing(wingId) {
  return TRAINING_CERTS.filter(c => c.wing === wingId);
}

// Helper: render a cert badge inline (small colored pill)
function renderCertBadge(certId) {
  const cert = TRAINING_CERTS.find(c => c.id === certId);
  if (!cert) return '';
  return `<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;background:${cert.color}22;color:${cert.color};border:1px solid ${cert.color}55;white-space:nowrap">${cert.abbr}</span>`;
}

// Helper: render qual status badge
function renderQualBadge(qualId) {
  const qual = QUAL_STATUS.find(q => q.id === qualId);
  if (!qual) return '';
  return `<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:800;background:${qual.color}22;color:${qual.color};border:1px solid ${qual.color}55">${qual.abbr}</span>`;
}

// ── ROLES — defaults used until Firestore overrides are loaded ─────────
// isMasterAdmin / isHidden are special: master_admin grants ALL permissions
// silently without showing "Master Admin" anywhere in the UI.
const DEFAULT_ROLES = {
  master_admin:   { name: 'Wing Commander', level: 99, color: '#c8a951', isMasterAdmin: true, permissions: [] },
  wing_commander: { name: 'Wing Commander',      level: 10, color: '#c8a951', permissions: ['edit_ranks','edit_own_wing','manage_training'] },
  sq_commander:   { name: 'Squadron Commander',  level: 8,  color: '#f0cc72', permissions: ['edit_own_wing'] },
  instructor:     { name: 'Instructor',          level: 5,  color: '#4a90d9', permissions: ['manage_training', 'award_medals'] },
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

// ── AUTH STATE WATCHER ───────────────────────────────────────
let currentUser   = null;
let currentPilot  = null;

auth.onAuthStateChanged(async (user) => {
  await loadRolesFromFirestore(); // ensure custom roles/permissions are loaded first
  if (user) {
    currentUser = user;
    try {
      const doc = await db.collection('pilots').doc(user.uid).get();
      if (doc.exists) {
        currentPilot = { uid: user.uid, ...doc.data() };
        // Redirect pending users away from protected pages
        if (currentPilot.status === 'pending' && !isPendingPage()) {
          window.location.href = '/pages/pending.html';
          return;
        }
        if (currentPilot.status === 'denied') {
          auth.signOut();
          window.location.href = '/pages/login.html?denied=1';
          return;
        }
      }
    } catch(e) { console.error('Pilot load error:', e); }
    onAuthReady(currentUser, currentPilot);
  } else {
    currentUser  = null;
    currentPilot = null;
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



    // ═══════════════════════════════════════════════════════════════
//  AUTH TIMING BUG FIX
//  The problem: your training pages (and likely others) call
//  requireAuth() or requireRole() SYNCHRONOUSLY at page load,
//  but Firebase auth state is ASYNCHRONOUS. When the page loads,
//  currentUser is still null for ~200-500ms while Firebase restores
//  the session from IndexedDB. The sync check sees null → redirects
//  to home → logs the user out visually.
//
//  The fix: NEVER call requireAuth() at the top level. Instead,
//  put ALL auth-gated logic inside onAuthReady(), which only fires
//  AFTER Firebase has confirmed the auth state.
//
//  WRONG (what causes the bug):
//  ┌─────────────────────────────────────────┐
//  │  requireAuth();          ← fires NOW    │
//  │  // currentUser is null  ← too early    │
//  │  // → redirect to /index.html           │
//  └─────────────────────────────────────────┘
//
//  RIGHT (the fix):
//  ┌─────────────────────────────────────────┐
//  │  function onAuthReady(user, pilot) {    │
//  │    if (!user) {                         │
//  │      window.location.href = '/pages/login.html'; │
//  │      return;                            │
//  │    }                                    │
//  │    // safe — Firebase confirmed auth    │
//  │    loadPageContent(pilot);              │
//  │  }                                      │
//  └─────────────────────────────────────────┘
//
//  Also add requiresLogin: true as a data attribute on the body
//  tag for pages that need auth, so a lightweight pre-check can
//  show a loading spinner instead of a blank flash.
// ═══════════════════════════════════════════════════════════════

// ── REPLACE these functions in firebase-config.js ─────────────

// Old requireAuth (BROKEN — synchronous):
// function requireAuth() {
//   if (!currentUser) window.location.href = '/pages/login.html';
// }

// New pattern — call this INSIDE onAuthReady() on each page:
function guardAuth(user, redirectTo) {
  redirectTo = redirectTo || '/pages/login.html';
  if (!user) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// Guard for minimum role level — call INSIDE onAuthReady():
function guardRole(pilot, minLevel, redirectTo) {
  redirectTo = redirectTo || '/index.html';
  if (!pilot) { window.location.href = redirectTo; return false; }
  const roleIds = getPilotRoleIds(pilot);
  const maxLevel = Math.max(0, ...roleIds.map(rid => ROLES[rid]?.level || 0));
  if (maxLevel < minLevel) { window.location.href = redirectTo; return false; }
  return true;
}

// Guard for specific permission — call INSIDE onAuthReady():
function guardPermission(pilot, permId, redirectTo) {
  redirectTo = redirectTo || '/index.html';
  if (!hasPermission(pilot, permId)) { window.location.href = redirectTo; return false; }
  return true;
}

// ── LOADING STATE HELPER ──────────────────────────────────────
// Call showAuthLoading() at the TOP of every page that needs auth.
// It shows a spinner immediately so there's no blank flash.
// onAuthReady() calls hideAuthLoading() once Firebase responds.
function showAuthLoading() {
  const el = document.createElement('div');
  el.id = 'auth-loading';
  el.style.cssText = `
    position:fixed;inset:0;background:var(--bg,#080a0f);
    display:flex;align-items:center;justify-content:center;
    flex-direction:column;gap:14px;z-index:9999
  `;
  el.innerHTML = `
    <div style="width:36px;height:36px;border:3px solid #1e2440;border-top-color:#c8a951;border-radius:50%;animation:spin 1s linear infinite"></div>
    <div style="color:#404860;font-size:13px;font-family:sans-serif">Authenticating…</div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `;
  document.body.appendChild(el);
}
function hideAuthLoading() {
  const el = document.getElementById('auth-loading');
  if (el) el.remove();
}

  if (o) o.remove();
}
