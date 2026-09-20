/**
 * Configuration éditoriale du site.
 * ⚠ Les champs marqués PLACEHOLDER sont des données de démonstration :
 * remplacez-les par les informations officielles avant publication.
 */
export const siteConfig = {
  name: "L'Empreinte",
  tagline: 'Au-delà des frontières du numérique',
  /** Numéro mis en avant sur la page d'accueil (comme sur la maquette). */
  featuredIssueSlug: 'issue-1-june-2025',
  university: {
    short: 'ESTIN',
    fullName: "École Supérieure en Sciences et Technologies de l'Informatique et du Numérique",
    city: 'Béjaïa',
    country: 'Algeria',
    url: 'https://www.estin.dz', // PLACEHOLDER
  },
  contact: {
    email: 'lempreinte@estin.dz', // PLACEHOLDER
    submissions: 'submissions@estin.dz', // PLACEHOLDER
    address: ['ESTIN — Editorial office', 'Béjaïa, Algeria'], // PLACEHOLDER
  },
  social: [
    { label: 'Instagram', href: '#' }, // PLACEHOLDER
    { label: 'LinkedIn', href: '#' }, // PLACEHOLDER
    { label: 'Facebook', href: '#' }, // PLACEHOLDER
  ],
  issn: 'ISSN 0000-0000', // PLACEHOLDER
} as const

/** Équipe éditoriale — PLACEHOLDER : noms fictifs, à remplacer. */
export const editorialTeam = [
  { name: 'Editor-in-Chief', person: 'To be announced', group: 'Editorial board' },
  { name: 'Managing Editor', person: 'To be announced', group: 'Editorial board' },
  { name: 'Faculty Advisor', person: 'To be announced', group: 'Editorial board' },
  { name: 'Review Committee', person: 'Student reviewers & faculty', group: 'Review committee' },
  { name: 'Art Direction', person: 'To be announced', group: 'Production' },
  { name: 'Translation (AR · FR · EN)', person: 'To be announced', group: 'Production' },
] as const
