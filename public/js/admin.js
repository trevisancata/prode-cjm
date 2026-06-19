// ═══════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════

// ── Contraseña simple (cliente-side, para protección básica) ───
const ADMIN_PASSWORD = 'jugadoras.jm'; // Cambiala acá

function checkPass() {
  const val = document.getElementById('admin-pass').value;
  if (val === ADMIN_PASSWORD) {
    document.getElementById('gate').hidden = true;
    document.getElementById('admin-main').hidden = false;
    init();
  } else {
    document.getElementById('gate-err').hidden = false;
  }
}
document.getElementById('admin-pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPass();
});

// ── Tab switching ─────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('tab-prodes').hidden     = tab !== 'prodes';
  document.getElementById('tab-resultados').hidden = tab !== 'resultados';
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (tab === 'prodes' && i === 0) || (tab === 'resultados' && i === 1));
  });
}

// ── State ─────────────────────────────────────────────────────
let allProdes = [];
let realData  = {};

// ── Fetch ─────────────────────────────────────────────────────
async function fetchAll() {
  const [pRes, rRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/prodes?select=*&order=created_at.desc`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    }),
    fetch(`${SUPABASE_URL}/rest/v1/resultados?select=*&limit=1`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    }),
  ]);
  allProdes = await pRes.json();
  const arr = await rRes.json();
  realData  = arr[0] || {};
}

// ── Render prodes table ───────────────────────────────────────
function renderTable() {
  const q = (document.getElementById('search').value || '').toLowerCase();
  const rows = q ? allProdes.filter(p => (p.nombre||'').toLowerCase().includes(q)) : allProdes;
  document.getElementById('stat-total').textContent = `${allProdes.length} prodes`;

  const tbody = document.getElementById('table-body');
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="12" class="table-empty">Sin prodes todavía.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  rows.forEach((p, i) => {
    const { filled, total } = countFilled(p);
    const pct = total > 0 ? Math.round(filled / total * 100) : 0;
    const pts = calcScore(p, realData);
    const dt  = p.created_at
      ? new Date(p.created_at).toLocaleString('es-AR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' })
      : '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--ink-soft);font-size:.72rem">${i+1}</td>
      <td><strong>${esc(p.nombre||'—')}</strong></td>
      <td>${esc(p.telefono||'—')}</td>
      <td>${esc(p.jugadora||'—')}</td>
      <td>${esc(p.campeon||'—')}</td>
      <td>${esc(p.subcampeon||'—')}</td>
      <td>${esc(p.tercero||'—')}</td>
      <td>${esc(p.goleador||'—')}</td>
      <td>
        <div class="prog-wrap">
          <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
          <span class="prog-pct">${pct}%</span>
        </div>
      </td>
      <td><strong style="color:var(--rose)">${pts}</strong></td>
      <td style="font-size:.72rem;color:var(--ink-soft);white-space:nowrap">${dt}</td>
      <td><button class="btn btn-ghost btn-sm detail-btn" data-id="${p.id}">ver ▾</button></td>
    `;
    tbody.appendChild(tr);

    // Fila de detalle
    const dtr = document.createElement('tr');
    dtr.className = 'detail-row';
    dtr.id = `detail_${p.id}`;
    const dtd = document.createElement('td');
    dtd.colSpan = 12;
    dtd.className = 'detail-cell';
    dtd.innerHTML = buildDetail(p);
    dtr.appendChild(dtd);
    tbody.appendChild(dtr);
  });

  tbody.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = document.getElementById(`detail_${btn.dataset.id}`);
      const open = row.classList.toggle('open');
      btn.textContent = open ? 'ocultar ▴' : 'ver ▾';
    });
  });
}

function buildDetail(p) {
  let html = '<div class="match-tags">';
  GRUPOS.forEach(g => {
    g.matches.forEach((match, i) => {
      const ph = p[gKey(g.id,i,'h')], pa = p[gKey(g.id,i,'a')];
      const rh = realData[gKey(g.id,i,'h')], ra = realData[gKey(g.id,i,'a')];
      const filled = ph != null && pa != null;
      let cls = '';
      if (filled && rh != null && ra != null) {
        if (ph === rh && pa === ra) cls = 'hit-exact';
        else if (Math.sign(ph-pa) === Math.sign(rh-ra)) cls = 'hit-sign';
      }
      const label = filled ? `${match[0]} ${ph}-${pa} ${match[1]}` : `${match[0]} ?-? ${match[1]}`;
      html += `<span class="match-tag ${cls}" title="G${g.name}">${label}</span>`;
    });
  });
  html += '</div>';
  return html;
}

// ── Export CSV ────────────────────────────────────────────────
function exportCSV() {
  if (!allProdes.length) return;
  const headers = ['nombre','telefono','jugadora','puntos','campeon','subcampeon','tercero','goleador','creado'];
  GRUPOS.forEach(g => g.matches.forEach((m, i) => {
    headers.push(`G${g.name}_${m[0]}vs${m[1]}_loc`, `G${g.name}_${m[0]}vs${m[1]}_vis`);
  }));
  KNOCKOUT_ROUNDS.forEach(r => r.matches.forEach((_, i) => {
    headers.push(`${r.id}_${i}_loc`, `${r.id}_${i}_vis`);
  }));

  const rows = allProdes.map(p => {
    const pts = calcScore(p, realData);
    const base = [p.nombre||'',p.telefono||'',p.jugadora||'',pts,p.campeon||'',p.subcampeon||'',p.tercero||'',p.goleador||'',p.created_at||''];
    GRUPOS.forEach(g => g.matches.forEach((_,i) => {
      base.push(p[gKey(g.id,i,'h')] ?? '', p[gKey(g.id,i,'a')] ?? '');
    }));
    KNOCKOUT_ROUNDS.forEach(r => r.matches.forEach((_,i) => {
      base.push(p[kKey(r.id,i,'h')] ?? '', p[kKey(r.id,i,'a')] ?? '');
    }));
    return base;
  });

  const csv = [headers,...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv);
  a.download = `prodes_mundial_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

// ── Resultados form ───────────────────────────────────────────
function buildResForm() {
  // Grupos
  const grid = document.getElementById('res-grupos-grid');
  GRUPOS.forEach(g => {
    const card = document.createElement('div');
    card.className = 'grupo-card';
    card.innerHTML = `<div class="grupo-header">Grupo ${g.name}</div><div class="grupo-body"></div>`;
    const body = card.querySelector('.grupo-body');
    g.matches.forEach((match, i) => {
      const hk = `res_${gKey(g.id,i,'h')}`, ak = `res_${gKey(g.id,i,'a')}`;
      const row = document.createElement('div');
      row.className = 'match-row';
      row.innerHTML = `
        <span class="team home">${match[0]}</span>
        <input class="score-box" type="number" min="0" max="99" id="${hk}" inputmode="numeric" placeholder="—" autocomplete="off">
        <span class="score-sep">-</span>
        <input class="score-box" type="number" min="0" max="99" id="${ak}" inputmode="numeric" placeholder="—" autocomplete="off">
        <span class="team away">${match[1]}</span>
      `;
      body.appendChild(row);
    });
    grid.appendChild(card);
  });

  // Knockout
  const ko = document.getElementById('res-knockout-container');
  KNOCKOUT_ROUNDS.forEach(r => {
    const wrap = document.createElement('div');
    wrap.className = 'ko-round';
    wrap.innerHTML = `<div class="ko-round-title">${r.name}</div><div class="ko-matches"></div>`;
    const matchesEl = wrap.querySelector('.ko-matches');
    r.matches.forEach((match, i) => {
      const hk = `res_${kKey(r.id,i,'h')}`, ak = `res_${kKey(r.id,i,'a')}`;
      const row = document.createElement('div');
      row.className = 'ko-match';
      row.innerHTML = `
        <span class="ko-team home" title="${match[0]}">${match[0]}</span>
        <input class="score-box" type="number" min="0" max="99" id="${hk}" inputmode="numeric" placeholder="—" autocomplete="off">
        <span class="score-sep">-</span>
        <input class="score-box" type="number" min="0" max="99" id="${ak}" inputmode="numeric" placeholder="—" autocomplete="off">
        <span class="ko-team away" title="${match[1]}">${match[1]}</span>
      `;
      matchesEl.appendChild(row);
    });
    ko.appendChild(wrap);
  });
}

function loadResIntoForm() {
  GRUPOS.forEach(g => g.matches.forEach((_, i) => {
    ['h','a'].forEach(s => {
      const el = document.getElementById(`res_${gKey(g.id,i,s)}`);
      if (el) { const v = realData[gKey(g.id,i,s)]; el.value = v != null ? v : ''; }
    });
  }));
  KNOCKOUT_ROUNDS.forEach(r => r.matches.forEach((_, i) => {
    ['h','a'].forEach(s => {
      const el = document.getElementById(`res_${kKey(r.id,i,s)}`);
      if (el) { const v = realData[kKey(r.id,i,s)]; el.value = v != null ? v : ''; }
    });
  }));
  ['campeon','subcampeon','tercero','goleador'].forEach(f => {
    const el = document.getElementById(`res-${f}`);
    if (el) el.value = realData[f] || '';
  });
}

function collectResData() {
  const record = {
    campeon:    document.getElementById('res-campeon').value.trim()    || null,
    subcampeon: document.getElementById('res-subcampeon').value.trim() || null,
    tercero:    document.getElementById('res-tercero').value.trim()    || null,
    goleador:   document.getElementById('res-goleador').value.trim()   || null,
    updated_at: new Date().toISOString(),
  };
  GRUPOS.forEach(g => g.matches.forEach((_, i) => {
    ['h','a'].forEach(s => {
      const k = gKey(g.id,i,s);
      const v = document.getElementById(`res_${k}`).value;
      record[k] = v !== '' ? parseInt(v,10) : null;
    });
  }));
  KNOCKOUT_ROUNDS.forEach(r => r.matches.forEach((_, i) => {
    ['h','a'].forEach(s => {
      const k = kKey(r.id,i,s);
      const el = document.getElementById(`res_${k}`);
      const v = el ? el.value : '';
      record[k] = v !== '' ? parseInt(v,10) : null;
    });
  }));
  return record;
}

async function saveResultados() {
  const btn = document.getElementById('btn-save-res');
  btn.disabled = true;
  document.getElementById('res-btn-text').textContent = 'Guardando...';
  document.getElementById('res-spinner').hidden = false;

  try {
    const data = collectResData();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/resultados?id=eq.00000000-0000-0000-0000-000000000001`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) throw new Error(await res.text());
    realData = { ...realData, ...data };
    showResFeedback('✓ Resultados guardados. El ranking ya se actualizó.', 'ok');
    renderTable(); // refrescar puntos en la tabla
  } catch (err) {
    console.error(err);
    showResFeedback('Error al guardar. Revisá tu conexión.', 'err');
  } finally {
    btn.disabled = false;
    document.getElementById('res-btn-text').textContent = 'Guardar resultados';
    document.getElementById('res-spinner').hidden = true;
  }
}

function showResFeedback(msg, type) {
  const el = document.getElementById('res-feedback');
  el.textContent = msg; el.className = `feedback ${type}`; el.hidden = false;
}

// ── Util ──────────────────────────────────────────────────────
function esc(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Init ──────────────────────────────────────────────────────
async function init() {
  buildResForm();
  try {
    await fetchAll();
    renderTable();
    loadResIntoForm();
  } catch (err) {
    console.error(err);
  }

  document.getElementById('btn-refresh').addEventListener('click', async () => {
    await fetchAll(); renderTable(); loadResIntoForm();
  });
  document.getElementById('btn-export').addEventListener('click', exportCSV);
  document.getElementById('search').addEventListener('input', renderTable);
  document.getElementById('btn-save-res').addEventListener('click', saveResultados);

  document.addEventListener('input', e => {
    if (e.target.classList.contains('score-box')) {
      e.target.classList.toggle('filled', e.target.value !== '');
    }
  });
}
