// ═══════════════════════════════════════════════════════════════
// RANKING PÚBLICO
// ═══════════════════════════════════════════════════════════════

async function loadRanking() {
  const container = document.getElementById('ranking-container');

  try {
    const [prodesRes, realRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/prodes?select=*`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/resultados?select=*&limit=1`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      }),
    ]);

    const prodes    = await prodesRes.json();
    const resultArr = await realRes.json();
    const real      = resultArr[0] || {};

    // ¿Hay algún resultado cargado?
    const { filled: realFilled } = countFilled(real);
    if (realFilled === 0) {
      container.innerHTML = `
        <p style="color:var(--ink-soft);font-size:.85rem;text-align:center;padding:1.5rem 0">
          El ranking se activará cuando se carguen los primeros resultados reales.<br>
          <span style="font-size:.75rem">Volvé a chequearlo durante el torneo.</span>
        </p>`;
      return;
    }

    // Calcular puntaje de cada prode
    const ranked = prodes
      .map(p => ({ ...p, _pts: calcScore(p, real) }))
      .sort((a, b) => b._pts - a._pts);

    if (!ranked.length) {
      container.innerHTML = `<p style="color:var(--ink-soft);font-size:.85rem">Todavía no hay prodes cargados.</p>`;
      return;
    }

    const div = document.createElement('div');
    div.className = 'ranking-grid';

    ranked.forEach((p, i) => {
      const pos  = i + 1;
      const cls  = pos === 1 ? 'top-1' : pos === 2 ? 'top-2' : pos === 3 ? 'top-3' : '';
      const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos <= 5 ? '🎁' : '';
      const prize = pos <= 5 ? `<div class="prize-badge">Premio ${pos}°</div>` : '';

      const row = document.createElement('div');
      row.className = `ranking-row ${cls}`;
      row.innerHTML = `
        <div class="rank-pos">${medal || pos}</div>
        <div>
          <div class="rank-name">${escHtml(p.nombre)}</div>
          <div class="rank-sub">${escHtml(p.jugadora || p.telefono || '')}</div>
          ${prize}
        </div>
        <div style="text-align:right">
          <div class="rank-pts">${p._pts}</div>
          <div class="rank-pts-label">puntos</div>
        </div>
      `;
      div.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(div);

  } catch (err) {
    console.error(err);
    container.innerHTML = `<p style="color:var(--rose);font-size:.83rem">Error al cargar el ranking.</p>`;
  }
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

loadRanking();
