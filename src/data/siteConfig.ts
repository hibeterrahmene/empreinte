/**
 * Configuration éditoriale du site.
 * Les champs marqués PLACEHOLDER n'ont pas été communiqués dans les documents fournis
 * (présentation de la revue, numéros 1 et 2) : à remplacer par les informations officielles.
 */
export const siteConfig = {
  name: "L'Empreinte",
  tagline: 'Au-delà des frontières du numérique',
  /** Sous-titre officiel : « Revue de l'étudiant de l'ESTIN » (document de présentation). */
  subtitle: "Revue de l'étudiant de l'ESTIN",
  /** Le numéro le plus récent est mis en avant automatiquement (voir repo.featuredIssue). */
  featuredIssueSlug: 'issue-2-april-2026',
  university: {
    short: 'ESTIN',
    fullName: "École Nationale Supérieure en Sciences et Technologies de l'Informatique et du Numérique",
    city: 'Béjaïa',
    country: 'Algeria',
    url: 'https://www.estin.dz',
  },
  contact: {
    email: 'lempreinte@estin.dz', // PLACEHOLDER — non communiqué
    submissions: 'submissions@estin.dz', // PLACEHOLDER — non communiqué
    address: ['ESTIN — Bibliothèque', 'Béjaïa, Algérie'], // PLACEHOLDER — non communiqué
  },
  /** Formulaire Google utilisé pour les appels à contribution des numéros 1 et 2. */
  googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfY_RtrN6nm1gzGiPqZ2zq_rWcCsY8DFh5b0xyldXeyikTRRw/viewform',
  social: [
    { label: 'Instagram', href: '#' }, // PLACEHOLDER — non communiqué
    { label: 'LinkedIn', href: '#' }, // PLACEHOLDER — non communiqué
    { label: 'Facebook', href: '#' }, // PLACEHOLDER — non communiqué
  ],
  /** Née d'une initiative du Dr S. Iken, responsable de la bibliothèque de l'ESTIN. */
  founder: { name: 'Dr. Sofiane IKEN', role: 'Responsable de la bibliothèque de l’ESTIN, fondateur de la revue' },
  /** Dédicace imprimée en page 2 du numéro 1. */
  dedication: 'À la mémoire de Zahia et Chams.',
} as const

/**
 * Équipe éditoriale réelle du numéro 1 (juin 2025), telle qu'imprimée dans la revue.
 * Certains membres sont aussi auteurs d'articles (voir authors.ts).
 */
export const editorialTeam = {
  chiefEditors: ['Iles Aissou', 'Widad Ahmanache', 'Inès Maakni', 'Hibet-Errahmene Kara'],
  reviewCommittee: [
    'Abdallah Elghazali Merzougui', 'Tiziri Bouaoud', 'Amina Layadi', 'Anes Adjal',
    'Anfal Moubaraka Kherfi', 'Anis Ouaret', 'Asma Belalem', 'Assia Mezemate',
    'Aymene Haroune', 'Chams-Eddine Kehoul', 'Houda Hamoudi', 'Ikram Fodil',
    'Ikram Grimed', 'Ismail Ouhererre', 'Israa Souiki', 'Iyad Sebti',
    'Kenza Kifouche', 'Laeticia Imane Mellata', 'Louisa Hadji', 'Lyna Allouche',
    'Mahdi Boukendoul', 'Maroua Ghedjati', 'Maya Boughiden', 'Mohamed Moncif Fokroun',
    'Nour El Isslem Merzougui', 'Sadjed Louahouah',
  ],
} as const

/** Les cinq objectifs de la revue, tels qu'énoncés dans le document de présentation. */
export const missionGoals = [
  'Valoriser les travaux des étudiants en offrant une plateforme où ils peuvent publier articles, analyses, projets et créations intellectuelles.',
  'Encourager la culture scientifique et technologique au sein de l’école en diffusant du contenu de qualité rédigé par les étudiants.',
  'Renforcer la participation et l’esprit communautaire en impliquant les étudiants dans la rédaction, la contribution et la gestion de la revue.',
  'Initier les étudiants à la recherche scientifique en leur offrant un espace pour explorer des thèmes, structurer leurs idées, rédiger des articles et se familiariser avec les méthodes de recherche.',
  'Garder une trace des initiatives et des réalisations des étudiants — d’où l’intitulé L’Empreinte.',
] as const
