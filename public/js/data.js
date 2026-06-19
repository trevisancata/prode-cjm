// ═══════════════════════════════════════════════════════════════
// DATOS DEL TORNEO
// ═══════════════════════════════════════════════════════════════

const GRUPOS = [
  { id:'a', name:'A', matches:[['CZE','SUD'],['MEX','COR'],['CZE','MEX'],['SUD','COR']] },
  { id:'b', name:'B', matches:[['SUI','BIH'],['CAN','QAT'],['SUI','CAN'],['BIH','QAT']] },
  { id:'c', name:'C', matches:[['USA','AUS'],['TUR','PAR'],['TUR','USA'],['PAR','AUS']] },
  { id:'d', name:'D', matches:[['ESP','SAU'],['URU','CVE'],['CVE','SAU'],['URU','ESP']] },
  { id:'e', name:'E', matches:[['ALE','CMA'],['ECU','CUR'],['CUR','CMA'],['ECU','ALE']] },
  { id:'f', name:'F', matches:[['PBA','SUE'],['TUN','JAP'],['JAP','SUE'],['TUN','PBA']] },
  { id:'g', name:'G', matches:[['BEL','IRA'],['NZE','EGI'],['EGI','IRA'],['NZE','BEL']] },
  { id:'h', name:'H', matches:[['FRA','IRQ'],['NOR','SEN'],['NOR','FRA'],['SEN','IRQ']] },
  { id:'i', name:'I', matches:[['ARG','AUT'],['JOR','AGL'],['AGL','AUT'],['JOR','ARG']] },
  { id:'j', name:'J', matches:[['POR','UZB'],['COL','RDC'],['COL','POR'],['RDC','UZB']] },
  { id:'k', name:'K', matches:[['ING','GHA'],['PAN','CRO'],['PAN','ING'],['CRO','GHA']] },
  { id:'l', name:'L', matches:[['ESC','MAR'],['BRA','HAI'],['BRA','ESC'],['MAR','HAI']] },
];

const KNOCKOUT_ROUNDS = [
  { id:'r32',  name:'Octavos — llave A', matches:[
    ['1E','3ABCDF'],['1I','3CDFGH'],['2A','2B'],['1F','2C'],
    ['2K','2L'],['1H','2J'],['1D','1G'],['3AEHIJ','3BEFIJ'],
  ]},
  { id:'r32b', name:'Octavos — llave B', matches:[
    ['1C','2F'],['2E','2I'],['1A','3CEFHI'],['1L','3EHIJK'],
    ['1J','2H'],['2D','2G'],['1B','1K'],['3DEIJL','3EFGIJ'],
  ]},
  { id:'qf',     name:'Cuartos de final',  matches:[['QF1 Local','QF1 Visit'],['QF2 Local','QF2 Visit'],['QF3 Local','QF3 Visit'],['QF4 Local','QF4 Visit']] },
  { id:'sf',     name:'Semifinales',        matches:[['SF1 Local','SF1 Visit'],['SF2 Local','SF2 Visit']] },
  { id:'final',  name:'Final',              matches:[['Final Local','Final Visit']] },
  { id:'bronze', name:'Tercer puesto',      matches:[['3° Local','3° Visit']] },
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
// Compara un prode contra los resultados reales y devuelve puntos
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

    // Resultado exacto: 5 pts
    if (ph === rh && pa === ra) { pts += 5; return; }

    // Ganador/empate correcto: 3 pts
    const rSign = Math.sign(rh - ra);
    const pSign = Math.sign(ph - pa);
    if (rSign === pSign) pts += 3;
  });

  // Bonos
  if (real.campeon    && prode.campeon    && normalize(prode.campeon)    === normalize(real.campeon))    pts += 100;
  if (real.subcampeon && prode.subcampeon && normalize(prode.subcampeon) === normalize(real.subcampeon)) pts += 50;
  if (real.tercero    && prode.tercero    && normalize(prode.tercero)    === normalize(real.tercero))    pts += 25;
  if (real.goleador   && prode.goleador   && normalize(prode.goleador)   === normalize(real.goleador))   pts += 100;

  return pts;
}

function normalize(str) {
  return str.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
