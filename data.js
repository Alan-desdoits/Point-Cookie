/* Catalogues : catégories, saisons, tags, fruits & légumes.
   Les recettes sont dans recettes.js. Mode d'emploi complet : CLAUDE.md */

/* Catégories de recettes (id utilisé dans le champ "cat" d'une recette) */
window.CATS = [
  { id: 'plat', label: 'Plats', e: '🍽️' },
  { id: 'dessert', label: 'Desserts', e: '🍰' }
];

/* Saison d'une recette (champ "seasons") — 'all' = toute l'année */
window.SEASONS = [
  { id: 'printemps', label: 'Printemps', e: '🌸' },
  { id: 'ete', label: 'Été', e: '☀️' },
  { id: 'automne', label: 'Automne', e: '🍂' },
  { id: 'hiver', label: 'Hiver', e: '❄️' }
];

/* Tags : h = teinte (0-360) de la puce. "rapide" est ajouté automatiquement (prép + cuisson <= 30 min). */
window.TAGS = [
  { id: 'viande',        label: 'Viande',                e: '🥩',  h: 5 },
  { id: 'poisson',       label: 'Poisson',               e: '🐟',  h: 200 },
  { id: 'vegetarien',    label: 'Végétarien',            e: '🥕',  h: 100 },
  { id: 'vegan',         label: 'Végan',                 e: '🌱',  h: 140 },
  { id: 'gluten',        label: 'Gluten',                e: '🌾',  h: 40 },
  { id: 'lactose',       label: 'Lactose',               e: '🥛',  h: 215 },
  { id: 'oeuf',          label: 'Œufs',                  e: '🥚',  h: 48 },
  { id: 'sucre',         label: 'Sucre',                 e: '🍬',  h: 330 },
  { id: 'fruitsacoque',  label: 'Fruits à coque',        e: '🥜',  h: 25 },
  { id: 'epice',         label: 'Épicé',                 e: '🌶️', h: 355 },
  { id: 'rapide',        label: 'Rapide (≤ 30 min)',     e: '⚡',   h: 270 }
];

/* Fruits & légumes.
   m = [mois de début, mois de fin] (1 = janvier … 12 = décembre). [9, 2] = de septembre à février.
   e = emoji, ou balise <img> (dossier emoji/) pour les emojis récents mal affichés sur certains appareils. */
window.PRODUCE = [
  // Légumes
  { id: 'asperge',      label: 'Asperge',       e: '🌱', t: 'legume', m: [4, 6] },
  { id: 'radis',        label: 'Radis',         e: '🌸', t: 'legume', m: [3, 10] },
  { id: 'petit-pois',   label: 'Petit pois',    e: '<img class="emo" src="emoji/petit-pois.svg" alt="">', t: 'legume', m: [5, 7] },
  { id: 'epinard',      label: 'Épinard',       e: '🥬', t: 'legume', m: [9, 5] },
  { id: 'artichaut',    label: 'Artichaut',     e: '🌿', t: 'legume', m: [5, 9] },
  { id: 'laitue',       label: 'Laitue',        e: '🥬', t: 'legume', m: [4, 9] },
  { id: 'tomate',       label: 'Tomate',        e: '🍅', t: 'legume', m: [6, 9] },
  { id: 'courgette',    label: 'Courgette',     e: '🥒', t: 'legume', m: [6, 9] },
  { id: 'concombre',    label: 'Concombre',     e: '🥒', t: 'legume', m: [6, 8] },
  { id: 'aubergine',    label: 'Aubergine',     e: '🍆', t: 'legume', m: [7, 9] },
  { id: 'poivron',      label: 'Poivron',       e: '<img class="emo" src="emoji/poivron.svg" alt="">', t: 'legume', m: [7, 9] },
  { id: 'haricot-vert', label: 'Haricot vert',  e: '<img class="emo" src="emoji/haricot-vert.svg" alt="">', t: 'legume', m: [6, 9] },
  { id: 'mais',         label: 'Maïs',          e: '🌽', t: 'legume', m: [8, 10] },
  { id: 'carotte',      label: 'Carotte',       e: '🥕', t: 'legume', m: [1, 12] },
  { id: 'oignon',       label: 'Oignon',        e: '🧅', t: 'legume', m: [1, 12] },
  { id: 'potiron',      label: 'Potiron',       e: '🎃', t: 'legume', m: [9, 2] },
  { id: 'champignon',   label: 'Champignon',    e: '🍄', t: 'legume', m: [9, 11] },
  { id: 'poireau',      label: 'Poireau',       e: '🌿', t: 'legume', m: [9, 4] },
  { id: 'chou-fleur',   label: 'Chou-fleur',    e: '🥦', t: 'legume', m: [10, 3] },
  { id: 'brocoli',      label: 'Brocoli',       e: '🥦', t: 'legume', m: [10, 3] },
  { id: 'betterave',    label: 'Betterave',     e: '🟣', t: 'legume', m: [10, 3] },
  { id: 'panais',       label: 'Panais',        e: '🥕', t: 'legume', m: [10, 3] },
  { id: 'patate-douce', label: 'Patate douce',  e: '🍠', t: 'legume', m: [10, 2] },
  { id: 'navet',        label: 'Navet',         e: '🟣', t: 'legume', m: [10, 3] },
  { id: 'celeri',       label: 'Céleri',        e: '🌿', t: 'legume', m: [10, 3] },
  { id: 'endive',       label: 'Endive',        e: '🥬', t: 'legume', m: [11, 3] },
  // Fruits
  { id: 'fraise',       label: 'Fraise',        e: '🍓', t: 'fruit', m: [4, 7] },
  { id: 'rhubarbe',     label: 'Rhubarbe',      e: '🌱', t: 'fruit', m: [4, 6] },
  { id: 'cerise',       label: 'Cerise',        e: '🍒', t: 'fruit', m: [5, 7] },
  { id: 'abricot',      label: 'Abricot',       e: '🍑', t: 'fruit', m: [6, 8] },
  { id: 'peche',        label: 'Pêche',         e: '🍑', t: 'fruit', m: [6, 9] },
  { id: 'melon',        label: 'Melon',         e: '🍈', t: 'fruit', m: [6, 9] },
  { id: 'framboise',    label: 'Framboise',     e: '🍓', t: 'fruit', m: [6, 9] },
  { id: 'pasteque',     label: 'Pastèque',      e: '🍉', t: 'fruit', m: [7, 8] },
  { id: 'prune',        label: 'Prune',         e: '🟣', t: 'fruit', m: [7, 9] },
  { id: 'raisin',       label: 'Raisin',        e: '🍇', t: 'fruit', m: [8, 10] },
  { id: 'figue',        label: 'Figue',         e: '🟣', t: 'fruit', m: [8, 10] },
  { id: 'pomme',        label: 'Pomme',         e: '🍎', t: 'fruit', m: [9, 3] },
  { id: 'poire',        label: 'Poire',         e: '🍐', t: 'fruit', m: [9, 2] },
  { id: 'coing',        label: 'Coing',         e: '🍐', t: 'fruit', m: [10, 12] },
  { id: 'chataigne',    label: 'Châtaigne',     e: '🌰', t: 'fruit', m: [10, 12] },
  { id: 'noisette',     label: 'Noisette',      e: '🌰', t: 'fruit', m: [9, 10] },
  { id: 'clementine',   label: 'Clémentine',    e: '🍊', t: 'fruit', m: [11, 2] },
  { id: 'orange',       label: 'Orange',        e: '🍊', t: 'fruit', m: [12, 3] },
  { id: 'citron',       label: 'Citron',        e: '🍋', t: 'fruit', m: [11, 3] },
  { id: 'kiwi',         label: 'Kiwi',          e: '🥝', t: 'fruit', m: [11, 4] }
];

window.MONTH_NAMES = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* « De saison » = de saison à la date du jour, à ± 15 jours près. */
window.isInSeason = function (p, today = new Date()) {
  const inRange = (month, [a, b]) => (a <= b ? month >= a && month <= b : month >= a || month <= b);
  const monthAt = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.getMonth() + 1; };
  return [-15, 0, 15].some((o) => inRange(monthAt(o), p.m));
};
