// ═══════════════════════════════════════════════════════════════
// DATOS DEL TORNEO
// ═══════════════════════════════════════════════════════════════

const GRUPOS = [
  { id:'a', name:'A', matches:[['CZE','SUD'],['MEX','COR'],['CZE','MEX'],['SUD','COR']] },
  { id:'b', name:'B', matches:[['SUI','BIH'],['CAN','QAT'],['SUI','CAN'],['BIH','QAT']] },
  { id:'c', name:'C', matches:[['ESC','MAR'],['BRA','HAI'],['BRA','ESC'],['MAR','HAI']] },
  { id:'d', name:'D', matches:[['USA','AUS'],['TUR','PAR'],['TUR','USA'],['PAR','AUS']] },
  { id:'e', name:'E', matches:[['ALE','CMA'],['ECU','CUR'],['CUR','CMA'],['ECU','ALE']] },
  { id:'f', name:'F', matches:[['PBA','SUE'],['TUN','JAP'],['JAP','SUE'],['TUN','PBA']] },
  { id:'g', name:'G', matches:[['BEL','IRA'],['NZE','EGI'],['EGI','IRA'],['NZE','BEL']] },
  { id:'h', name:'H', matches:[['ESP','SAU'],['URU','CVE'],['CVE','SAU'],['URU','ESP']] },
  { id:'i', name:'I', matches:[['FRA','IRQ'],['NOR','SEN'],['NOR','FRA'],['SEN','IRQ']] },
  { id:'j', name:'J', matches:[['ARG','AUT'],['JOR','AGL'],['AGL','AUT'],['JOR','ARG']] },
  { id:'k', name:'K', matches:[['POR','UZB'],['COL','RDC'],['COL','POR'],['RDC','UZB']] },
  { id:'l', name:'L', matches:[['ING','GHA'],['PAN','CRO'],['PAN','ING'],['CRO','GHA']] },
];

const KNOCKOUT_ROUNDS = [
  // 32avos — 16 partidos (llave A: 8, llave B: 8)
  { id:'r64a', name:'32avos — llave A', matches:[
    ['1E','3ABCDF'],['1I','3CDFGH'],['2A','2B'],['1F','2C'],
    ['2K','2L'],['1H','2J'],['1D','1G'],['3AEHIJ','3BEFIJ'],
  ]},
  { id:'r64b', name:'32avos — llave B', matches:[
    ['1C','2F'],['2E','2I'],['1A','3CEFHI'],['1L','3EHIJK'],
    ['1J','2H'],['2D','2G'],['1B','1K'],['3DEIJL','3EFGIJ'],
  ]},
  // 8vos — 8 partidos
  { id:'r32', name:'Octavos de final', matches:[
    ['R64A G1','R64B G1'],['R64A G2','R64B G2'],
    ['R64A G3','R64B G3'],['R64A G4','R64B G4'],
    ['R64A G5','R64B G5'],['R64A G6','R64B G6'],
    ['R64A G7','R64B G7'],['R64A G8','R64B G8'],
  ]},
  // 4tos — 4 partidos
  { id:'qf', name:'Cuartos de final', matches:[
    ['8vos G1','8vos G2'],['8vos G3','8vos G4'],
    ['8vos G5','8vos G6'],['8vos G7','8vos G8'],
  ]},
  // Semis — 2 partidos
  { id:'sf', name:'Semifinales', matches:[
    ['4tos G1','4tos G2'],['4tos G3','4tos G4'],
  ]},
  { id:'final',  name:'Final',          matches:[['Semi G1','Semi G2']] },
  { id:'bronze', name:'Tercer puesto',  matches:[['Semi G3','Semi G4']] },
];

// ── Key helpers ──────────────────────────────────────────
function gKey(gId, idx, side) { return `g_${gId}_${idx}_${side}`; }
function kKey(rId, idx, side) { return `ko_${rId}_${idx}_${side}`; }

// ── Completitud ──────────────────────────────────────────
function countFilled(record) {
  let filled = 0, total = 0;
  GRUPOS.forEach(g => g.matches.forEach((_, i) => {
    total++;
    const h = record[gKey(g.id,i,'h')], a = record[gKey(g.id,i,'a')];
    if (h != null && a != null) filled++;
  }));
  KNOCKOUT_ROUNDS.forEach(r => r.matches.forEach((_, i) => {
    total++;
    const h = record[kKey(r.id,i,'h')], a = record[kKey(r.id,i,'a')];
    if (h != null && a != null) filled++;
  }));
  return { filled, total };
}

// ── Motor de puntaje ─────────────────────────────────────
function calcScore(prode, real) {
  let pts = 0;
  const allMatches = [];
  GRUPOS.forEach(g => g.matches.forEach((_, i) => {
    allMatches.push({ hKey: gKey(g.id,i,'h'), aKey: gKey(g.id,i,'a') });
  }));
  KNOCKOUT_ROUNDS.forEach(r => r.matches.forEach((_, i) => {
    allMatches.push({ hKey: kKey(r.id,i,'h'), aKey: kKey(r.id,i,'a') });
  }));

  allMatches.forEach(({ hKey, aKey }) => {
    const rh = real[hKey], ra = real[aKey];
    const ph = prode[hKey], pa = prode[aKey];
    if (rh == null || ra == null || ph == null || pa == null) return;
    if (ph === rh && pa === ra) { pts += 5; return; }
    if (Math.sign(ph-pa) === Math.sign(rh-ra)) pts += 3;
  });

  if (real.campeon    && prode.campeon    && normalize(prode.campeon)    === normalize(real.campeon))    pts += 100;
  if (real.subcampeon && prode.subcampeon && normalize(prode.subcampeon) === normalize(real.subcampeon)) pts += 50;
  if (real.tercero    && prode.tercero    && normalize(prode.tercero)    === normalize(real.tercero))    pts += 25;
  if (real.goleador   && prode.goleador   && normalize(prode.goleador)   === normalize(real.goleador))   pts += 100;

  return pts;
}

function normalize(str) {
  return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
