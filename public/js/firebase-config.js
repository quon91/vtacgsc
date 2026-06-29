// ═══════════════════════════════════════════════════════════════
//  VTAC GLOBAL STRIKE COMMAND — FIREBASE CONFIG
//  Project: vtacgsc
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
    location: 'Abilene, TX',
    aircraft: ['B-1B Lancer'],
    color: '#c8a951',
    squadrons: {
      '28bs': { name: '28th Bomb Squadron', callsign: 'BONE', nickname: 'Mohawks' },
      '9bs':  { name: '9th Bomb Squadron',  callsign: 'WOLF', nickname: 'Tigers' },
    }
  },
  '509bw': {
    name: '509th Bomb Wing',
    base: 'Whiteman AFB (KSZL)',
    location: 'Knob Noster, MO',
    aircraft: ['B-2 Spirit'],
    color: '#4a90d9',
    squadrons: {
      '13bs': { name: '13th Bomb Squadron', callsign: 'SPIRIT', nickname: "Devil's Advocates" },
    }
  },
  '2bw': {
    name: '2nd Bomb Wing',
    base: 'Barksdale AFB (KBAD)',
    location: 'Bossier City, LA',
    aircraft: ['B-52H Stratofortress'],
    color: '#3dba6e',
    squadrons: {
      '96bs':  { name: '96th Bomb Squadron',  callsign: 'BUFF',  nickname: '96th' },
      '343bs': { name: '343rd Bomb Squadron', callsign: 'IRON',  nickname: '343rd' },
      '11bs':  { name: '11th Bomb Squadron',  callsign: 'STORM', nickname: '11th' },
    }
  }
};

// ── RANK STRUCTURE ───────────────────────────────────────────
const RANKS = [
  { id: 'rec',   name: 'Recruit',            abbr: 'REC',   level: 0 },
  { id: 'ab',    name: 'Airman Basic',        abbr: 'AB',    level: 1 },
  { id: 'amn',   name: 'Airman',              abbr: 'Amn',   level: 2 },
  { id: 'a1c',   name: 'Airman First Class',  abbr: 'A1C',   level: 3 },
  { id: 'sra',   name: 'Senior Airman',       abbr: 'SrA',   level: 4 },
  { id: 'ssgt',  name: 'Staff Sergeant',      abbr: 'SSgt',  level: 5 },
  { id: 'tsgt',  name: 'Technical Sergeant',  abbr: 'TSgt',  level: 6 },
  { id: 'msgt',  name: 'Master Sergeant',     abbr: 'MSgt',  level: 7 },
  { id: '2lt',   name: 'Second Lieutenant',   abbr: '2Lt',   level: 8 },
  { id: '1lt',   name: 'First Lieutenant',    abbr: '1Lt',   level: 9 },
  { id: 'capt',  name: 'Captain',             abbr: 'Capt',  level: 10 },
  { id: 'maj',   name: 'Major',               abbr: 'Maj',   level: 11 },
  { id: 'ltcol', name: 'Lieutenant Colonel',  abbr: 'LtCol', level: 12 },
  { id: 'col',   name: 'Colonel',             abbr: 'Col',   level: 13 },
  { id: 'bgen',  name: 'Brigadier General',   abbr: 'BGen',  level: 14 },
  { id: 'mgen',  name: 'Major General',       abbr: 'MGen',  level: 15 },
  { id: 'lgen',  name: 'Lieutenant General',  abbr: 'LGen',  level: 16 },
  { id: 'gen',   name: 'General',             abbr: 'Gen',   level: 17 },
];

// ── ROLES ───────────────────────────────────────────────────
const ROLES = {
  master_admin:   { name: 'Master Admin',       level: 99, color: '#ff4444' },
  wing_commander: { name: 'Wing Commander',      level: 10, color: '#c8a951' },
  sq_commander:   { name: 'Squadron Commander',  level: 8,  color: '#f0cc72' },
  instructor:     { name: 'Instructor',          level: 5,  color: '#4a90d9' },
  pilot:          { name: 'Pilot',               level: 2,  color: '#3dba6e' },
  trainee:        { name: 'Trainee',             level: 1,  color: '#9aa0b8' },
  pending:        { name: 'Pending Approval',    level: 0,  color: '#e09030' },
};

// ── AUTH STATE WATCHER ───────────────────────────────────────
let currentUser  = null;
let currentPilot = null;

auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    try {
      const doc = await db.collection('pilots').doc(user.uid).get();
      if (doc.exists) {
        currentPilot = { uid: user.uid, ...doc.data() };
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
function requireAuth()        { if (!currentUser)  window.location.href = '/pages/login.html'; }
function requireMasterAdmin() { requireAuth(); if (currentPilot?.role !== 'master_admin') window.location.href = '/index.html'; }
function requireRole(minLvl)  { requireAuth(); if ((ROLES[currentPilot?.role||'pending']?.level||0) < minLvl) window.location.href = '/index.html'; }

function getRankName(id) { return RANKS.find(r=>r.id===id)?.name || id; }
function getRankAbbr(id) { return RANKS.find(r=>r.id===id)?.abbr || id; }
function getWingName(id) { return WINGS[id]?.name || id; }
function getSqName(wId,sId) { return WINGS[wId]?.squadrons[sId]?.name || sId; }

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
}
function formatDateTime(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
}

function toast(msg, type='success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 22px;border-radius:22px;font-size:13px;font-weight:600;z-index:9999;pointer-events:none;opacity:0;transition:opacity .3s;font-family:var(--sans)';
    document.body.appendChild(t);
  }
  const colors = {success:'#3dba6e',error:'#d04040',info:'#4a90d9',warn:'#e09030'};
  t.style.background = colors[type]||colors.success;
  t.style.color = type==='warn'?'#000':'#fff';
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(()=>t.style.opacity='0', 3000);
}

function showLoading(msg='Loading...') {
  let o = document.getElementById('loading-overlay');
  if (!o) {
    o = document.createElement('div');
    o.id = 'loading-overlay';
    o.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:8888;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;backdrop-filter:blur(4px)';
    o.innerHTML = `<div style="width:40px;height:40px;border:3px solid #333;border-top-color:#c8a951;border-radius:50%;animation:spin 1s linear infinite"></div><div style="color:#fff;font-size:14px;font-family:var(--sans)">${msg}</div>`;
    document.body.appendChild(o);
  }
}
function hideLoading() { document.getElementById('loading-overlay')?.remove(); }
