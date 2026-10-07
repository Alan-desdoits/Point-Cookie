/* Points Cookie — logique : filtres, tags (multi-sélection), fruits & légumes de saison, fiche recette.
   Données : data.js (catalogues) et recettes.js (recettes). Mode d'emploi : CLAUDE.md */
(function () {
  const { PRODUCE, TAGS, CATS, SEASONS } = window;
  const $ = (s) => document.querySelector(s);
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const tagById = Object.fromEntries(TAGS.map((t) => [t.id, t]));
  const prodById = Object.fromEntries(PRODUCE.map((p) => [p.id, p]));
  const catById = Object.fromEntries(CATS.map((c) => [c.id, c]));

  // --- Contrôle des recettes : les erreurs s'affichent dans la console du navigateur (F12) ---
  const seen = new Set();
  function check(r) {
    const w = []; let fatal = false;
    ['id', 'title', 'cat', 'seasons', 'e', 'servings', 'prep', 'cook', 'tags', 'ing', 'steps'].forEach((k) => {
      if (r[k] == null) { w.push(`champ manquant : ${k}`); fatal = true; }
    });
    if (!fatal) {
      if (seen.has(r.id)) { w.push('id déjà utilisé par une autre recette'); fatal = true; }
      seen.add(r.id);
      if (!catById[r.cat]) { w.push(`catégorie inconnue : ${r.cat}`); fatal = true; }
      r.seasons.forEach((s) => { if (s !== 'all' && !SEASONS.some((x) => x.id === s)) w.push(`saison inconnue : ${s}`); });
      r.tags = r.tags.filter((t) => tagById[t] || (w.push(`tag inconnu (ignoré) : ${t}`), false));
      r.ing.forEach((i) => { if (i[3] && !prodById[i[3]]) { w.push(`fruit/légume inconnu dans data.js : ${i[3]}`); i[3] = null; } });
      r.steps.forEach((s, k) => { if (!Array.isArray(s) || s.length < 2) w.push(`étape ${k + 1} : format attendu ['emoji', 'texte']`); });
    }
    if (w.length) console.warn(`[recettes] "${r.id || r.title || '?'}"${fatal ? ' (ignorée)' : ''} :\n - ${w.join('\n - ')}`);
    return !fatal;
  }

  // --- Préparation des données ---
  const RECIPES = (window.RECIPES || []).filter(check);
  RECIPES.forEach((r) => {
    r.produce = [...new Set(r.ing.filter((i) => i[3]).map((i) => i[3]))];
    if (r.prep + r.cook <= 30 && !r.tags.includes('rapide')) r.tags.push('rapide');
    r.search = norm(r.title + ' ' + r.ing.map((i) => i[2]).join(' '));
  });

  const state = { cat: null, season: null, tags: new Set(), q: '' };

  // --- Utilitaires d'affichage ---
  const fmtTime = (min) => {
    if (!min) return '—';
    const h = Math.floor(min / 60), r = min % 60;
    return h ? `${h} h${r ? ' ' + String(r).padStart(2, '0') : ''}` : `${min} min`;
  };
  const fmtQty = (q) => String(Math.round(q * 10) / 10).replace('.', ',');
  const chip = (kind, id, label, pressed, extra = '', hue = '', cls = '') =>
    `<button type="button" class="chip${cls}" data-act="${kind}" data-id="${id}" aria-pressed="${pressed}"${hue !== '' ? ` style="--h:${hue}"` : ''}>${extra}${esc(label)}`;

  // --- Filtrage ---
  function matches(r, ignoreTag) {
    if (state.cat && r.cat !== state.cat) return false;
    if (state.season && !r.seasons.includes('all') && !r.seasons.includes(state.season)) return false;
    if (state.q && !r.search.includes(norm(state.q))) return false;
    for (const t of state.tags) if (t !== ignoreTag && !r.tags.includes(t) && !r.produce.includes(t)) return false;
    return true;
  }
  const countFor = (id) => RECIPES.filter((r) => matches(r, id) && (r.tags.includes(id) || r.produce.includes(id))).length;

  // --- Rendu des filtres ---
  function renderFilters() {
    const set = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };

    set('#cats',
      chip('cat', '', 'Tout', !state.cat) + '</button>' +
      CATS.map((c) => chip('cat', c.id, c.label, state.cat === c.id, `<span class="e">${c.e}</span>`) + '</button>').join(''));

    set('#seasons',
      SEASONS.map((s) => chip('season', s.id, s.label, state.season === s.id, `<span class="e">${s.e}</span>`) + '</button>').join(''));

    set('#tags',
      TAGS.map((t) => chip('tag', t.id, t.label, state.tags.has(t.id), `<span class="e">${t.e}</span>`, t.h) + '</button>').join(''));

    // Fruits & légumes de saison (selon la date du jour, ± 15 jours) ; n = nombre de recettes concernées
    const title = $('#produceTitle');
    if (title) title.textContent = `De saison · ${window.MONTH_NAMES[new Date().getMonth()]}`;
    const list = PRODUCE.filter((p) => window.isInSeason(p));
    const produceChip = (p, pressed, withCount) => {
      const n = withCount ? countFor(p.id) : 1;
      return chip('tag', p.id, p.label, pressed, `<span class="e">${p.e}</span>`, p.t === 'fruit' ? 340 : 110, n ? '' : ' none')
        + (withCount ? `<small class="n">${n}</small>` : '') + '</button>';
    };
    set('#produceVeg', list.filter((p) => p.t === 'legume').map((p) => produceChip(p, state.tags.has(p.id), true)).join(''));
    set('#produceFruit', list.filter((p) => p.t === 'fruit').map((p) => produceChip(p, state.tags.has(p.id), true)).join(''));

    // Un produit sélectionné qui n'est plus de saison reste visible pour pouvoir être désélectionné
    const hidden = [...state.tags].filter((id) => prodById[id] && !list.includes(prodById[id]));
    set('#produceExtra', hidden.map((id) => produceChip(prodById[id], true, false)).join(''));

    const nFilters = (state.cat ? 1 : 0) + (state.season ? 1 : 0) + state.tags.size;
    document.querySelectorAll('.js-badge').forEach((b) => { b.textContent = nFilters; b.hidden = !nFilters; });
    document.querySelectorAll('.js-reset').forEach((b) => { b.hidden = !(nFilters || state.q); });
  }

  // --- Rendu des cartes ---
  function renderGrid() {
    const list = RECIPES.filter((r) => matches(r));
    const count = $('#count');
    if (count) count.textContent = `${list.length} recette${list.length > 1 ? 's' : ''}`;
    const grid = $('#grid');
    if (!RECIPES.length) {
      grid.innerHTML = `<div class="empty"><div class="big">🍪</div><p>Aucune recette pour le moment.</p></div>`;
      return;
    }
    if (!list.length) {
      grid.innerHTML = `<div class="empty"><div class="big">🍳</div><p>Aucune recette ne correspond à ces filtres.</p><button class="btn js-reset" data-act="reset">Réinitialiser les filtres</button></div>`;
      return;
    }
    grid.innerHTML = list.map((r) => {
      const seasons = r.seasons.includes('all') ? "Toute l'année" : r.seasons.map((s) => SEASONS.find((x) => x.id === s).label).join(' · ');
      return `<article class="card" data-cat="${r.cat}" tabindex="0" role="button" data-act="open" data-id="${r.id}" aria-label="${esc(r.title)}">
        <div class="card-visual"><span class="card-emoji">${r.e}</span></div>
        <div class="card-body">
          <div class="card-cat">${catById[r.cat].label.replace(/s$/, '')} <i>·</i> ${seasons}</div>
          <h3 class="card-title">${esc(r.title)}</h3>
          <div class="meta">
            <span title="Personnes">👥 ${r.servings}</span>
            <span title="Préparation">🔪 ${fmtTime(r.prep)}</span>
            <span title="Cuisson">🔥 ${fmtTime(r.cook)}</span>
          </div>
          <div class="pills">${r.tags.map((t) => `<span class="pill" style="--h:${tagById[t].h}">${tagById[t].label.replace(' (≤ 30 min)', '')}</span>`).join('')}</div>
        </div>
      </article>`;
    }).join('');
  }

  const render = () => { renderFilters(); renderGrid(); };

  // --- Fiche recette ---
  let current = null, servings = 0;
  function renderDetail() {
    const r = current, ratio = servings / r.servings;
    $('#detail .d-sheet').innerHTML = `
      <div class="d-top">
        <button class="d-close" data-act="close" aria-label="Fermer">✕</button>
      </div>
      <div class="d-hero"><span class="d-emoji">${r.e}</span></div>
      <div class="d-content">
        <div class="d-cat">${catById[r.cat].label.replace(/s$/, '')}</div>
        <h2 class="d-title">${esc(r.title)}</h2>
        <div class="d-stats">
          <div class="stat"><span class="k">Personnes</span>
            <span class="v stepper"><button data-act="dec" aria-label="Moins">−</button><b>${servings}</b><button data-act="inc" aria-label="Plus">+</button></span></div>
          <div class="stat"><span class="k">Préparation</span><span class="v">${fmtTime(r.prep)}</span></div>
          <div class="stat"><span class="k">Cuisson</span><span class="v">${fmtTime(r.cook)}</span></div>
        </div>
        <div class="pills">${r.tags.map((t) => `<span class="pill" style="--h:${tagById[t].h}">${tagById[t].e} ${tagById[t].label.replace(' (≤ 30 min)', '')}</span>`).join('')}</div>
        <h3 class="d-h">Ingrédients</h3>
        <ul class="ing">${r.ing.map((i) => {
          const q = i[0] == null ? '' : `<b>${fmtQty(i[0] * ratio)}${i[1] ? ' ' + esc(i[1]) : ''}</b> `;
          const p = i[3] ? ` data-act="produce" data-id="${i[3]}"` : '';
          return `<li${i[3] ? ' class="is-produce"' : ''}${p}>${q}${esc(i[2])}${i[3] ? ` <span class="tagme">${prodById[i[3]].e}</span>` : ''}</li>`;
        }).join('')}</ul>
        <h3 class="d-h">Préparation</h3>
        <ol class="steps">${r.steps.map((s) => {
          const [e, t] = Array.isArray(s) ? s : ['•', s]; // une étape sans emoji reçoit une puce
          return `<li><span class="step-e" aria-hidden="true">${e}</span><span class="step-t">${esc(t)}</span></li>`;
        }).join('')}</ol>
      </div>`;
  }
  function openDetail(id) {
    current = RECIPES.find((r) => r.id === id); servings = current.servings;
    renderDetail();
    const d = $('#detail');
    d.classList.add('open'); document.body.classList.add('no-scroll');
    d.querySelector('.d-sheet').scrollTop = 0;
    d.querySelector('.d-close').focus({ preventScroll: true });
  }
  function closeDetail() {
    $('#detail').classList.remove('open'); document.body.classList.remove('no-scroll');
  }

  // --- Événements ---
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('d-backdrop') || e.target.classList.contains('drawer-backdrop')) {
      closeDetail(); document.body.classList.remove('filters-open'); return;
    }
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const id = el.dataset.id;
    switch (el.dataset.act) {
      case 'cat': state.cat = id || null; render(); break;
      case 'season': state.season = state.season === id ? null : id; render(); break;
      case 'tag': state.tags.has(id) ? state.tags.delete(id) : state.tags.add(id); render(); break;
      case 'reset': state.cat = state.season = null; state.tags.clear(); state.q = ''; { const s = $('#search'); if (s) s.value = ''; } render(); break;
      case 'open': openDetail(id); break;
      case 'close': closeDetail(); break;
      case 'inc': servings = Math.min(servings + 1, 24); renderDetail(); break;
      case 'dec': servings = Math.max(servings - 1, 1); renderDetail(); break;
      case 'produce': // clic sur un ingrédient de la fiche = filtre par cet ingrédient
        state.tags.add(id); closeDetail(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      case 'filters': document.body.classList.toggle('filters-open'); break;
      case 'closefilters': document.body.classList.remove('filters-open'); break;
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeDetail(); document.body.classList.remove('filters-open'); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.card')) { e.preventDefault(); openDetail(e.target.dataset.id); }
  });
  const search = $('#search');
  if (search) search.addEventListener('input', () => { state.q = search.value.trim(); renderGrid(); renderFilters(); });

  render();
})();
