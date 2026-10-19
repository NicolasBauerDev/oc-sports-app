# SportSee — Tableau de bord utilisateur

Nouvelle version de la page profil de SportSee : elle permet à l'utilisateur de
suivre ses sessions et ses calories brûlées.

Projet React + Vite, intégration **desktop uniquement** (lisible à partir de
1024 × 780 px).

## Démarrage

Le front se lance seul, sur des données mockées. Le backend n'est nécessaire
que pour taper sur l'API réelle.

### 1. Le front

```bash
npm install
cp .env.example .env
npm run dev
```

L'application est servie sur <http://localhost:5173>.

`.env.example` active les **données mockées** (`VITE_USE_MOCKS=true`) : à ce
stade le tableau de bord est complet, aucun serveur n'est requis.

> Sans fichier `.env`, l'application tape directement sur
> `http://localhost:3000` — c'est la valeur de repli, et elle suppose le
> backend démarré.

### 2. Le backend, pour passer sur l'API réelle

Dépôt séparé fourni par OpenClassrooms. Il utilise **yarn** et écoute sur le
port **3000**.

```bash
git clone https://github.com/OpenClassrooms-Student-Center/P9-front-end-dashboard.git
cd P9-front-end-dashboard
yarn
yarn dev
```

Puis, dans le `.env` du front :

```
VITE_USE_MOCKS=false
```

et relancer le serveur de développement.

> **Deux utilisateurs existent côté backend : 12 et 18.** Les routes sont donc
> `/user/12` et `/user/18`. Tout autre identifiant renvoie un 404, que le
> tableau de bord affiche comme « Utilisateur introuvable ».

Une alternative Docker est documentée dans le README du backend, si yarn n'est
pas installé.

### Scripts

| Script            | Rôle                                 |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Serveur de développement (port 5173) |
| `npm run build`   | Build de production dans `dist/`     |
| `npm run preview` | Prévisualise le build de production  |
| `npm run lint`    | ESLint sur l'ensemble du projet      |

## Stack technique

- **React 19** + **Vite** (JSX, pas de TypeScript)
- **react-router** pour la navigation (`BrowserRouter` déclaratif)
- **Sass** avec des CSS Modules (`*.module.scss`) : un style par composant, pas
  de fuite de classes entre composants
- **Recharts** pour les graphiques (voir _Pourquoi Recharts_ en fin de document)
- **Fetch** pour les appels HTTP, encapsulé dans un service hors des composants

## Arborescence

```
src/
├── App.jsx                  Routeur et déclaration des écrans
├── main.jsx                 Point d'entrée React
├── assets/                  Icônes et logo (SVG)
├── styles/
│   ├── _variables.scss      Couleurs et dimensions de la maquette
│   └── global.scss          Reset et styles de base
├── mocks/
│   ├── data.js              Données du backend, recopiées à l'identique
│   └── mockApi.js           Imite les 4 endpoints (même enveloppe `{ data }`)
├── models/                  Normalisation des données de l'API
│   ├── UserModel.js         Infos générales + score (`todayScore` ou `score`)
│   ├── ActivityModel.js     Activité quotidienne (dates → numéro de jour)
│   ├── AverageSessionsModel.js  Sessions (jours 1-7 → `L M M J V S D`)
│   └── PerformanceModel.js  Types d'activité (`kind` numérique → libellé)
├── services/
│   ├── api.js               Transport : fetch, `ApiError`, bascule mock/API
│   └── userService.js       4 fonctions renvoyant des instances de modèles
├── hooks/
│   └── useUserData.js       Charge les 4 ressources et suit l'état du chargement
├── components/
│   ├── Layout/              Navbar + Sidebar + zone de contenu
│   ├── Navbar/              Navigation horizontale (US#1)
│   ├── Sidebar/             Navigation verticale d'icônes (US#2)
│   ├── ChartCard/           Habillage d'une carte de graphique
│   ├── ScoreChart/          RadialBarChart du score du jour (US#14)
│   ├── SessionsChart/       LineChart de la durée des sessions (US#12)
│   ├── PerformanceChart/    RadarChart des types d'activité (US#13)
│   ├── ActivityChart/       BarChart de l'activité quotidienne (US#11)
│   └── KeyDataCard/         Carte d'un chiffre clé (US#15)
└── pages/
    ├── Dashboard/           Tableau de bord
    └── Placeholder/         Écrans hors périmètre du sprint + 404
```

## Source des données

La bascule se fait par variable d'environnement, sans toucher au code (voir
`.env.example`) :

| `VITE_USE_MOCKS` | Source                                    |
| ---------------- | ----------------------------------------- |
| `true`           | `src/mocks/` — aucun serveur nécessaire   |
| toute autre      | `VITE_API_URL` (backend NodeJS, port 3000) |

Les deux sources renvoient exactement les mêmes valeurs : ni les modèles ni les
composants ne savent laquelle est active.

## Routes

| Route         | Écran                                              |
| ------------- | -------------------------------------------------- |
| `/`           | Tableau de bord                                    |
| `/user/:id`   | Tableau de bord de l'utilisateur ciblé (étape API) |
| `/profil`     | Écran d'attente                                    |
| `/reglage`    | Écran d'attente                                    |
| `/communaute` | Écran d'attente                                    |
| `*`           | Page introuvable                                   |

## Choix de mise en page

- `Layout` porte un `min-width` de 1024 px : en dessous de la résolution cible,
  la page défile horizontalement plutôt que de se déformer (US#3).
- Les dimensions de la maquette (hauteurs des cartes, largeur de la colonne des
  chiffres clés) sont fixes ; les largeurs de graphiques sont fluides pour que la
  mise en page tienne entre 1024 px et les grands écrans.
- Les valeurs et couleurs communes sont centralisées dans
  `src/styles/_variables.scss`.

## État d'avancement

Fait :

- Navigation horizontale et verticale, mise en page générale (US#1 à US#3)
- Couche de données complète : mocks, service hors composants, normalisation —
  testée sur les mocks **et** sur le backend, avec des résultats identiques
- Prénom (US#4) et chiffres clés (US#10, US#15) alimentés par les données, avec
  les états de chargement et d'erreur
- Score du jour en `RadialBarChart` (US#14)
- Durée moyenne des sessions en `LineChart` (US#12), avec infobulle sur mesure et
  assombrissement de la zone à droite du curseur
- Types d'activité en `RadarChart` (US#13)
- Activité quotidienne en `BarChart` (US#11), avec deux échelles verticales,
  infobulle et bande de survol

**Les User Stories du sprint sont toutes intégrées.** Restent, si besoin :
documentation complémentaire, tests automatisés, et le passage en responsive
mobile/tablette explicitement sorti du périmètre par le Product Owner.

### Animations Recharts désactivées

Les animations d'entrée des graphiques (`isAnimationActive={false}`) sont
volontairement coupées. Recharts n'atteint l'état final qu'à la fin de
l'animation : si celle-ci n'aboutit pas — onglet en arrière-plan, image perdue,
préférence « animations réduites » — la courbe reste invisible (`stroke-dasharray`
à `0px`) et le radar reste réduit à un point. Le comportement a été observé.
Un graphique ne doit pas dépendre d'une animation pour afficher ses données, et
la maquette est statique.

### Écarts assumés avec la maquette

- **Score** : la maquette dessine, pour 12 %, un arc qui couvre visuellement bien
  plus de 12 % du cercle. L'arc implémenté est proportionnel à la donnée.
- **Sessions** : sur la maquette la courbe dépasse les bords de la carte. Y
  parvenir demanderait d'ajouter des points qui ne sont pas des données (et qui
  seraient survolables). La courbe s'arrête donc à 12 px des bords.
- **Activité quotidienne** : l'axe des poids ne part pas de zéro, d'après la
  maquette (elle affiche 69 / 70 / 71). Sur une plage de quelques kilos, un axe
  partant de zéro rendrait toutes les barres identiques. La contrepartie connue
  est que l'écart entre les barres paraît plus marqué qu'il ne l'est.

### Pourquoi Recharts

Recharts est construit sur D3 mais expose des composants React déclaratifs
(`<BarChart>`, `<LineChart>`, `<RadarChart>`, `<RadialBarChart>`) — soit
exactement les quatre graphiques de la maquette, sans avoir à manipuler le DOM
à la main comme avec D3. `ResponsiveContainer` gère le redimensionnement, et les
tooltips personnalisés attendus par les User Stories sont de simples composants
React.

Version utilisée : **Recharts 3**, qui déclare React 19 dans ses `peerDependencies`.

À noter : Recharts fait passer le bundle de 253 kB à 675 kB (199 kB gzippés).
Acceptable pour une application desktop, mais si le poids devenait un sujet, un
`import()` dynamique par graphique permettrait de le sortir du bundle initial.
