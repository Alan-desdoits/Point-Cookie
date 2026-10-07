# Points Cookie — carnet de recettes (web app)

Site statique en HTML/CSS/JS pur, sans build ni dépendance, pensé **mobile d'abord (iPhone 11 et 14)**, puis tablette et ordinateur. Une seule page : `index.html`. Le texte du site est en **français**.

## Règles de travail (à respecter à chaque fois)

- **Ne jamais commiter ni pousser.** L'utilisateur s'en occupe lui-même. Pas de `git add`/`commit`/`push`.
- **Ne jamais inventer de recettes.** Les recettes viennent de l'utilisateur, qui les donne au fur et à mesure. `recettes.js` est vide au départ : pas de recette « exemple » ou « placeholder » à laisser dans le dépôt (pour tester, en mettre une temporairement puis la retirer).
- **Contraste** : tout texte doit respecter WCAG AA (≥ 4,5:1 ; ≥ 3:1 pour le texte ≥ 24 px, ou ≥ 18,66 px en gras). Vérifier à chaque changement de couleur.
- **Responsive** : aucune liste ne doit défiler latéralement (les puces passent à la ligne) et la page ne doit jamais déborder horizontalement, de 320 px à 1920 px.
- Ne pas ajouter de framework, de bundler ni de bibliothèque : tout reste lisible et modifiable à la main.

## Structure du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | La page : en-tête, colonne/tiroir de filtres, grille de cartes, fiche recette (`#detail`). |
| `style.css` | Tout le style (variables en haut de fichier). Direction artistique « billet de cinéma » claire, palette Matinée. |
| `data.js` | **Catalogues** : catégories (`CATS`), saisons (`SEASONS`), tags (`TAGS`), fruits & légumes (`PRODUCE`) + calcul de saison. |
| `recettes.js` | **Les recettes** (`window.RECIPES`). C'est le fichier que l'on modifie le plus. Un modèle commenté s'y trouve. |
| `app.js` | Logique : filtres, tags multi-sélection, produits de saison, fiche recette, contrôle des recettes. |
| `emoji/` | Images d'emojis récents (poivron, petit pois) + dessin du haricot vert. Licence dans `emoji/LICENSE.txt`. |
| `icons/` | Icône de l'app : `icon.svg` (source) et ses PNG (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png` 180 px pour l'écran d'accueil iPhone). |
| `manifest.webmanifest` | Manifeste de web app (nom, couleurs, icônes) : permet « Ajouter à l'écran d'accueil ». |

## Ce que fait le site

- **Cartes** horizontales façon billet de cinéma (talon à gauche : emoji, numéro, code-barres ; sur téléphone le talon est réduit à l'emoji).
- **Fiche recette** (clic sur une carte) : titre, nombre de personnes (boutons − / + qui recalculent les quantités), temps de préparation, temps de cuisson, tags, ingrédients, **étapes en frise verticale avec un emoji par étape**.
- **Filtres** : catégorie (Plats / Desserts), saison de la recette, recherche texte, **tags** (sélection multiple), **fruits & légumes de saison**. Tous les filtres se cumulent en « ET » : une recette doit avoir tous les tags/produits sélectionnés.
- **Fruits & légumes de saison** : liste calculée d'après **la date du jour à ± 15 jours** (champ `m` de chaque produit dans `data.js`). Ce sont aussi des tags : cliquer sur « Carotte » affiche toutes les recettes dont un ingrédient est lié à `carotte`. Le petit chiffre sur la puce = nombre de recettes concernées ; une puce en pointillés italique = aucune recette.
- **Tags** : discrets au repos, rouge plein quand sélectionnés.
- Le tag **`rapide`** est ajouté automatiquement quand `prep + cook ≤ 30`. Ne pas le mettre à la main.
- **Contrôle automatique** : au chargement, `app.js` vérifie chaque recette et affiche dans la **console du navigateur (F12)** les erreurs (champ manquant, tag inconnu, produit inconnu, étape mal formée, id en double). Une recette avec un champ obligatoire manquant est ignorée.

## Ajouter une recette — procédure

Quand l'utilisateur donne une recette (texte, photo, lien…) :

1. **Ouvrir `recettes.js`** et ajouter un objet à la fin de `window.RECIPES` (virgule entre les recettes). Format :

```js
{
  id: 'blanquette-veau',                  // unique ; minuscules, sans accent, tirets
  title: 'Blanquette de veau',
  cat: 'plat',                            // 'plat' ou 'dessert' (ids de CATS)
  seasons: ['automne', 'hiver'],          // 'printemps' | 'ete' | 'automne' | 'hiver' | 'all'
  e: '🍲',                                // emoji de la recette (carte + fiche)
  servings: 6,                            // nombre de personnes
  prep: 30, cook: 90,                     // minutes ; cook: 0 s'il n'y a pas de cuisson
  tags: ['viande', 'gluten', 'lactose'],  // ids de TAGS ; PAS « rapide » (automatique)
  ing: [
    [1, 'kg', 'de veau'],                 // [quantité, unité, nom, id produit (optionnel)]
    [3, '', 'carottes', 'carotte'],       // 4e valeur = id de PRODUCE → ingrédient filtrable
    [1, 'c. à soupe', "d'huile d'olive"],
    [null, '', 'Sel, poivre']             // quantité null = « au goût » (non multipliée)
  ],
  steps: [
    ['🔪', "Coupez la viande en morceaux."],
    ['💧', "Couvrez d'eau froide et portez à ébullition."],
    ['🔥', "Laissez mijoter 1 h 15 à feu doux."]
  ]
}
```

2. **Ingrédients** :
   - Le nom contient la préposition (« de veau », « d'huile ») : l'affichage est `quantité unité nom`.
   - Les quantités sont proportionnelles au nombre de personnes (boutons − / +), elles doivent donc être numériques pour la quantité de base de `servings`.
   - Pour tout **fruit ou légume** : renseigner le 4ᵉ élément avec son id de `PRODUCE` (`data.js`), sinon il ne sera pas filtrable. Un fruit/légume absent de `PRODUCE` doit être **ajouté dans `data.js`** (voir plus bas) avant de l'utiliser.
3. **Étapes : un emoji par étape**, sous la forme `['emoji', 'texte']`. Choisir un emoji qui représente l'action ou l'ingrédient de l'étape (🔪 couper, 🥣 mélanger, 🔥 cuire, ♨️ mijoter, 🧈 beurre, 🥚 œufs, ❄️ repos au frais, 🍽️ servir…). Une étape donnée en simple chaîne reçoit une puce « • » (à éviter).
4. **Tags** — choisir uniquement parmi ceux de `TAGS` (`data.js`) : `viande`, `poisson`, `vegetarien`, `vegan`, `gluten`, `lactose`, `oeuf`, `sucre`, `fruitsacoque`, `epice` (et `rapide`, automatique). Les tags d'allergènes/contenus signifient **« contient »** (ex. `gluten` = contient du gluten). Un plat végétarien reçoit `vegetarien` ; un plat sans produit animal : `vegan` (et `vegetarien`).
5. **Saison de la recette** (`seasons`) : les saisons où elle est pertinente, ou `['all']`.
6. **Vérifier** (voir « Tester ») : la console ne doit afficher aucun avertissement `[recettes]`.
7. Rendre compte à l'utilisateur de ce qui a été ajouté, **sans commiter**.

Si une information manque (temps, personnes, saison…), la **demander** plutôt que d'inventer.

## Modifier les catalogues (`data.js`)

- **Nouveau fruit/légume** : ajouter une ligne dans `PRODUCE`, dans la section légumes ou fruits :
  `{ id: 'fenouil', label: 'Fenouil', e: '🌿', t: 'legume', m: [10, 3] }`
  - `t` : `'legume'` ou `'fruit'` ; `m` : `[mois de début, mois de fin]` (1 = janvier), `[10, 3]` = d'octobre à mars.
  - L'id est en minuscules, sans accent, avec des tirets (`haricot-vert`).
  - Si l'emoji n'existe pas ou s'affiche mal (carré vide) sur certains appareils — c'est le cas des emojis Unicode récents —, utiliser une **image** : déposer un SVG dans `emoji/` et mettre `e: '<img class="emo" src="emoji/xxx.svg" alt="">'`. Sources libres possibles : Twemoji via `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/<code-unicode>.svg` (CC-BY 4.0 : garder la mention dans `emoji/LICENSE.txt`). Les emojis récents posant problème ici : poivron (`poivron.svg`), petit pois (`petit-pois.svg`), haricot vert (`haricot-vert.svg`, dessin maison car aucun emoji n'existe).
  - Demander à l'utilisateur avant de télécharger un fichier depuis Internet.
- **Nouveau tag** : ajouter dans `TAGS` `{ id, label, e, h }` (`h` = teinte 0-360 pour la couleur de la puce). Penser au contraste.
- **Nouvelle catégorie** : ajouter dans `CATS`. Si la catégorie doit avoir sa propre couleur de talon, ajouter une variable (`--stub3`) et une règle `.card[data-cat="..."] .card-visual` dans `style.css`.

## Direction artistique et style (`style.css`)

- Palette « Matinée » : fond crème `#f3e9d6`, surface `#fbf4e4`, papier du billet `#fffdf7`, encre brun-rouge `#2b1210`, accent rouge salle de cinéma `#a3141b`, talon doré `#f2d28b` (plats) / rosé `#f4c1b5` (desserts). Tout est piloté par les variables CSS de `:root`.
- Polices (Google Fonts) : **Bebas Neue** (titres, capitales), **Nunito** (texte), **Courier Prime** (numéro de billet).
- Mobile (< 640 px) : talon réduit à 54 px (variable `--visual-w`), numéro et code-barres masqués, filtres dans un **tiroir** (bouton « Filtres »). Ordinateur (≥ 960 px) : colonne de filtres fixe à gauche. La fiche recette est une feuille plein écran sur mobile et une fenêtre centrée dès 760 px.
- Les étapes sont une frise verticale : `.steps` / `.step-e` (emoji dans un rond fin) / `.step-t`.
- Garder des **zones tactiles ≥ 34–44 px**, le champ de recherche en **16 px** (sinon iOS zoome) et les marges `env(safe-area-inset-*)` pour l'encoche.

## Icône de l'app

Cookie au trait, rouge `#a3141b` sur crème `#f3e9d6` (proposition « 10 · Contour » de la planche d'icônes). `icons/icon.svg` est le fichier source ; il est carré, plein cadre (c'est l'iPhone qui arrondit les coins), et le cookie reste dans les ~70 % centraux. Il est référencé dans `index.html` (favicon SVG + PNG 192, `apple-touch-icon`) et dans `manifest.webmanifest`.

Si l'icône change : modifier `icons/icon.svg`, puis régénérer les trois PNG aux tailles exactes (192, 512, 180). Exemple avec Edge, sans outil à installer (créer une page temporaire qui affiche le SVG à la taille voulue, puis) :

```bash
msedge --headless --disable-gpu --hide-scrollbars --user-data-dir=<dossier temporaire> --window-size=512,512 --screenshot=icons/icon-512.png file:///<page temporaire>.html
```

(Edge refuse les fenêtres plus petites qu'environ 180 px : pas de PNG 32 px ; les navigateurs utilisent le SVG ou le PNG 192 réduit.) Vérifier ensuite les dimensions des PNG. Ne pas laisser de fichiers temporaires dans le projet.

## Tester

Pas de build. Servir le dossier en local puis ouvrir `http://localhost:8765` :

```bash
python -m http.server 8765
```

(Ouvrir `index.html` directement par `file://` fonctionne aussi, mais le navigateur peut mettre les scripts en cache : faire un rechargement forcé, Ctrl+Maj+R.)

Checklist après un changement :

1. Console du navigateur (F12) : aucun avertissement `[recettes]`, aucune erreur.
2. Taille mobile 390 × 844 (iPhone 14) et 414 × 896 (iPhone 11) ; puis 768, 1024, 1440 : pas de défilement horizontal de la page, ni des listes de puces.
3. Cliquer un fruit/légume de saison, un tag, une catégorie : la grille se filtre, le compteur de recettes est juste ; combiner deux tags.
4. Ouvrir une fiche : quantités qui changent avec − / +, étapes avec leurs emojis, fermeture avec ✕, Échap ou clic sur le fond.
5. Contraste : relire les couleurs modifiées (outil de contraste du navigateur ou calcul WCAG).

## Pièges connus

- L'id d'une recette doit être **unique** ; un doublon fait ignorer la seconde.
- Les saisons de produits sont **calculées avec la date de l'appareil** : en mars, un produit de saison avril–juin apparaît déjà (marge de 15 jours).
- Les puces « de saison » n'affichent que les produits de saison ; un produit sélectionné qui n'est plus de saison reste visible (zone `#produceExtra`) pour pouvoir être désélectionné.
- Si on ajoute un ingrédient avec un id produit absent de `data.js`, il est affiché mais pas filtrable (et la console l'indique).
