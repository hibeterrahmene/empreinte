# L'Empreinte — site du journal (ESTIN)

React 18 · TypeScript · Tailwind CSS 3 · Vite · React Router · Lucide.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # sortie dans dist/ (le fichier public/_redirects gère le routage SPA sur Netlify)
```

## Structure

```
src/
  assets/logos/     logos officiels recadrés (dark/light) : L'Empreinte, ESTIN
  assets/images/    illustrations du campus (recadrages WebP) + couverture du n°1
  components/
    ui/             Button, Tag/Chip, Modal, Accordion, Tabs, Reveal, SectionHeading
    forms/          TextField, TextArea, SelectField, CheckboxField, ToggleField, FileField
    layout/         Header, Footer, Layout, AuthLayout, Logo, LanguageSwitcher, SearchOverlay
    editorial/      ArticleCard, IssueCard, IssueCover, AuthorCard, Metadata, SearchBar,
                    FilterPanel, QuoteSection, Highlight, Wave
    article/        ArticleBody, Figure, CitationBlock, ShareBar, TableOfContents
  pages/            Home, Issues, Issue, Search, Topics, Article, Contribute, Profile,
                    Login/Register/Forgot, About (+ contact), Legal, NotFound
  data/             siteConfig, categories, authors, issues, articles/, quotes, i18n, repository
  hooks/ lib/       auth simulée, lecture, recherche, citation, validation, i18n
  styles/           index.css (design system), fonts.css
```

## Brancher un backend

Toutes les lectures passent par `src/data/repository.ts` : remplacez le corps de chaque méthode
par un appel API (par ex. Django REST Framework) en gardant les signatures. La recherche est déjà
asynchrone (états chargement / aucun résultat). L'authentification (`src/hooks/useAuth.tsx`) est
simulée dans `localStorage` : à remplacer par vos endpoints.

## Données de démonstration à remplacer

- `siteConfig.ts` : e-mails, adresse, réseaux, ISSN, équipe éditoriale (valeurs provisoires).
- `issues.ts` : le n°1 reprend la maquette ; les n°2 et n°3 sont fictifs (`demo: true`).
- `articles/` : les 5 articles du n°1 reprennent les titres/auteurs des maquettes, mais leurs textes sont
  rédigés pour la démo. Les articles des n°2 et n°3 sont fictifs.
- `pdfUrl: '#'` : mettre les vraies URLs des PDF.
- `i18n.ts` : textes d'interface en EN / FR / AR (RTL). Directives, FAQ et mentions légales sont des propositions à valider.

## Polices

Figtree est chargée via `@fontsource`. **Neue Haas Grotesk Display Pro** est une police sous licence :
déposez vos fichiers `.woff2` dans `public/fonts` et décommentez `src/styles/fonts.css`. En attendant,
Inter Tight (métriques proches) est utilisée automatiquement.

## Design system (résumé)

Couleurs : encre `#0A0A0B`, crème `#F8EDD6`, nuit `#0B1629`, bleu marque `#548EC1` (texte/boutons : `#2C6AA0`
pour le contraste AA), jaune étiquette `#FFDD36`, argile `#D2622D`. Rayons ≤ 4 px, aucune ombre, séparateurs 1 px.
Titres : Neue Haas (fallback Inter Tight) 600, interlettrage −0.03 em. Interface : Figtree.
