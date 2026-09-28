import type { Article, ArticleImage } from '@/types'
import { img } from './images'

/**
 * Photos libres de droits (licence Unsplash : usage libre, sans attribution obligatoire),
 * choisies pour correspondre au sujet de chaque article. Elles sont chargées depuis le CDN
 * d'Unsplash (connexion internet requise). Pour les héberger vous-même, téléchargez-les et
 * remplacez `unsplash(...)` par un import local.
 *
 * Les articles qui ont leur propre figure (CNN, régression, CSP, conteneurs, arbres, Seeds for
 * the Future) conservent cette figure d'origine.
 */
const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const photo = (id: string, alt: string, credit: string, position = '50% 50%'): ArticleImage => ({
  src: unsplash(id),
  alt,
  caption: `Photo : ${credit} / Unsplash`,
  position,
})

export const photoOverrides: Record<string, ArticleImage> = {
  // ---- Numéro 1 ----
  'a-quel-point-linformatique-est-si-loin-de-la-nature': photo('1562202880-1f9f814222ab', 'Macrophotographie de fourmis, symbole de l’intelligence collective dans la nature.', 'Unsplash'),
  'the-fast-inverse-square-root-algorithm': photo('1719253480609-579ad1622c65', 'Écran d’ordinateur affichant des lignes de code.', 'Glen Carrie'),
  'smart-contracts-banking-emerging-markets': photo('1518544884411-3a6cb9236aab', 'Pièce de bitcoin posée sur une surface en bois.', 'André François McKenzie'),
  'mitre-attck': photo('1614064548237-096f735f344f', 'Cadenas posé sur un ordinateur portable, avec des traînées de lumière.', 'FlyD'),
  'ai-integration-in-small-businesses': photo('1612012060786-58a0bf29474c', 'Devanture en bois d’une petite boutique.', 'Piret Ilver'),
  'what-if-we-were-the-solution': photo('1716703435453-a7733d600d68', 'Groupe de personnes réunies autour d’une table de travail.', 'Musemind UX Agency'),
  'entrepreneurship-in-algeria': { src: img.campusReal, alt: 'Vue aérienne du campus de l’ESTIN.', caption: "Le campus de l'ESTIN, client de l'auteur.", position: '50% 40%' },
  'the-lean-mindset': photo('1677506048148-0c914dd8197b', 'Tableau blanc couvert de notes adhésives organisées en colonnes.', 'Paymo'),
  'le-laboratoire-litan': photo('1766297247924-6638d54e7c89', 'Deux chercheurs travaillant sur des ordinateurs dans un laboratoire.', 'Chidera Faustina Okeke'),
  'internet-of-things': photo('1722488359737-7a9b8a8436c7', 'Objets connectés domestiques posés sur une table.', 'Jakub Żerdzicki'),

  // ---- Numéro 2 ----
  'ai-safety-governance': photo('1680783954745-3249be59e527', 'Main de robot et main humaine se tendant l’une vers l’autre.', 'Cash Macanaya'),
  'accessibility-in-web-content': photo('1625466124375-dcb0bae69af7', 'Clavier noir et blanc pour l’accessibilité.', 'Mastars'),
  'streamlining-iot-security-fuzzing': photo('1518770660439-4636190af475', 'Macrophotographie d’une carte électronique.', 'Unsplash'),
  'when-machines-start-to-write': photo('1560091549-c6c2e6fdce59', 'Machine à écrire vintage avec une feuille de papier.', 'Glenn Carstens-Peters'),
  'rencontre-pr-tari': { src: img.campusReal, alt: 'Vue aérienne du campus de l’ESTIN.', caption: "Le campus de l'ESTIN.", position: '50% 40%' },
  'analyse-mathematique-nombres-premiers': photo('1453733190371-0a9bedd82893', 'Formules mathématiques écrites sur un vieux tableau noir.', 'Roman Mager'),
  'de-la-recherche-a-limpact-reel': photo('1766297247924-6638d54e7c89', 'Deux chercheurs travaillant sur des ordinateurs dans un laboratoire.', 'Chidera Faustina Okeke'),
}

export const withPhotos = (list: Article[]): Article[] =>
  list.map((a) => (photoOverrides[a.slug] ? { ...a, image: photoOverrides[a.slug] } : a))
