// ═══════════════════════════════════════════════════════════════
// FORMULARIO DE CARGA
// ═══════════════════════════════════════════════════════════════

function buildGrupos() {
  const grid = document.getElementById('grupos-grid');
  GRUPOS.forEach(g => {
    const card = document.createElement('div');
    card.className = 'grupo-card';
    card.innerHTML = `<div class="grupo-header">Grupo ${g.name}</div><div class="grupo-body"></div>`;
    const body = card.querySelector('.grupo-body');
    g.matches.forEach((match, i) => {
      body.appendChild(makeMatchRow(
        gKey(g.id, i, 'h'), gKey(g.id, i, 'a'),
        match[0], match[1]
      ));
    });
    grid.appendChild(card);
  });
}

function buildKnockout() {
  const container = document.getElementById('knockout-container');
  KNOCKOUT_ROUNDS.forEach(r => {
    const wrap = document.createElement('div');
    wrap.className = 'ko-round';
    wrap.innerHTML = `<div class="ko-round-title">${r.name}</div><div class="ko-matches"></div>`;
    const matchesEl = wrap.querySelector('.ko-matches');
    r.matches.forEach((match, i) => {
      const row = document.createElement('div');
      row.className = 'ko-match';
      const hk = kKey(r.id, i, 'h'), ak = kKey(r.id, i, 'a');
      row.innerHTML = `
        <span class="ko-team home" title="${match[0]}">${match[0]}</span>
        <input class="score-box" type="number" min="0" max="99" id="${hk}" name="${hk}" inputmode="numeric" placeholder="—" autocomplete="off">
        <span class="score-sep">-</span>
        <input class="score-box" type="number" min="0" max="99" id="${ak}" name="${ak}" inputmode="numeric" placeholder="—" autocomplete="off">
        <span class="ko-team away" title="${match[1]}">${match[1]}</span>
      `;
      matchesEl.appendChild(row);
    });
    container.appendChild(wrap);
  });
}

function makeMatchRow(hk, ak, home, away) {
  const row = document.createElement('div');
  row.className = 'match-row';
  row.innerHTML = `
    <span class="team home">${home}</span>
    <input class="score-box" type="number" min="0" max="99" id="${hk}" name="${hk}" inputmode="numeric" placeholder="—" autocomplete="off">
    <span class="score-sep">-</span>
    <input class="score-box" type="number" min="0" max="99" id="${ak}" name="${ak}" inputmode="numeric" placeholder="—" autocomplete="off">
    <span class="team away">${away}</span>
  `;
  return row;
}

function collectFormData() {
  const record = {
    nombre:     document.getElementById('nombre').value.trim(),
    telefono:   document.getElementById('telefono').value.trim()    || null,
    jugadora:   document.getElementById('jugadora').value.trim()    || null,
    campeon:    document.getElementById('campeon').value.trim()     || null,
    subcampeon: document.getElementById('subcampeon').value.trim()  || null,
    tercero:    document.getElementById('tercero').value.trim()     || null,
    goleador:   document.getElementById('goleador').value.trim()    || null,
  };
  GRUPOS.forEach(g => g.matches.forEach((_, i) => {
    ['h','a'].forEach(s => {
      const k = gKey(g.id, i, s);
      const v = document.getElementById(k).value;
      record[k] = v !== '' ? parseInt(v, 10) : null;
    });
  }));
  KNOCKOUT_ROUNDS.forEach(r => r.matches.forEach((_, i) => {
    ['h','a'].forEach(s => {
      const k = kKey(r.id, i, s);
      const el = document.getElementById(k);
      const v = el ? el.value : '';
      record[k] = v !== '' ? parseInt(v, 10) : null;
    });
  }));
  return record;
}

async function saveToSupabase(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/prodes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);
}

// ── Submit ───────────────────────────────────────────────────
document.getElementById('prode-form').addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  if (!nombre) { showFeedback('Ingresá tu nombre y apellido para continuar.', 'err'); return; }

  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  document.getElementById('btn-text').textContent = 'Guardando...';
  document.getElementById('btn-spinner').hidden = false;

  try {
    await saveToSupabase(collectFormData());
    showFeedback(`✓ Prode de ${nombre} guardado. ¡Buena suerte!`, 'ok');
    document.getElementById('form-feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    console.error(err);
    showFeedback('No se pudo guardar. Revisá tu conexión e intentá de nuevo.', 'err');
  } finally {
    btn.disabled = false;
    document.getElementById('btn-text').textContent = 'Guardar prode';
    document.getElementById('btn-spinner').hidden = true;
  }
});

document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('¿Limpiar todos los datos del formulario?')) return;
  document.getElementById('prode-form').reset();
  document.querySelectorAll('.score-box').forEach(b => b.classList.remove('filled'));
  const fb = document.getElementById('form-feedback');
  fb.hidden = true; fb.className = 'feedback';
});

function showFeedback(msg, type) {
  const el = document.getElementById('form-feedback');
  el.textContent = msg; el.className = `feedback ${type}`; el.hidden = false;
}

// Marcar casilla como filled + avanzar foco
document.addEventListener('input', e => {
  if (!e.target.classList.contains('score-box')) return;
  e.target.classList.toggle('filled', e.target.value !== '');
  if (e.target.value.length >= 2) {
    const boxes = Array.from(document.querySelectorAll('.score-box'));
    const idx = boxes.indexOf(e.target);
    if (idx < boxes.length - 1) boxes[idx + 1].focus();
  }
});

// ── Init ─────────────────────────────────────────────────────
buildGrupos();
buildKnockout();
