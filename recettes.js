/* Recettes de Points Cookie.
   Pour en ajouter : copier le modèle ci-dessous, le remplir, et l'ajouter dans la liste.
   Mode d'emploi détaillé (champs, emojis des étapes, vérifications) : CLAUDE.md

   MODÈLE
   {
     id: 'blanquette-veau',                 // unique, minuscules, sans accent, avec des tirets
     title: 'Blanquette de veau',
     cat: 'plat',                           // 'plat' ou 'dessert'
     seasons: ['automne', 'hiver'],         // 'printemps' | 'ete' | 'automne' | 'hiver' | 'all'
     e: '🍲',                               // emoji de la recette (carte + fiche)
     servings: 6,                           // nombre de personnes
     prep: 30, cook: 90,                    // minutes (cook: 0 si pas de cuisson)
     tags: ['viande', 'gluten', 'lactose'], // ids de TAGS (data.js). « rapide » est automatique.
     ing: [                                 // [quantité | null, unité, 'nom (avec « de »)', id fruit/légume (optionnel)]
       [1, 'kg', 'de veau'],
       [3, '', 'carottes', 'carotte'],      // 4e valeur = id de PRODUCE (data.js) → l'ingrédient devient filtrable
       [null, '', 'Sel, poivre']            // null = « au goût »
     ],
     steps: [                               // [emoji de l'étape, texte]
       ['🔪', "Coupez la viande en morceaux."],
       ['🔥', "Faites cuire 1 h 30 à feu doux."]
     ]
   }
*/
window.RECIPES = [
];
