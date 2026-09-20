import type { Author } from '@/types'

/**
 * DONNÉES DE DÉMONSTRATION.
 * Les cinq premiers noms proviennent des maquettes ; les suivants sont fictifs.
 * Remplacer par la table « auteurs » du backend.
 */
const base = { role: 'Contributor', affiliation: 'ESTIN' }

export const authors: Author[] = [
  { id: 'tiziri-bouaoud', name: 'Tiziri BOUAOUD', ...base, bio: "Writes for L'Empreinte on the meeting point between computing and the living world." },
  { id: 'anis-koua', name: 'Mohamed Anis KOUA', ...base, bio: "Writes for L'Empreinte about algorithms, low-level programming and how old tricks still shape modern software." },
  { id: 'abdelbasset-meghraoui', name: 'Abdelbasset MEGHRAOUI', ...base, bio: "Writes for L'Empreinte about student initiative and building useful things locally." },
  { id: 'mahdi-boukendoul', name: 'Mahdi BOUKENDOUL', ...base, bio: "Writes for L'Empreinte about applied AI and the way small organisations adopt it." },
  { id: 'aymen-benraya', name: 'Aymen BENRAYA', ...base, bio: "Writes for L'Empreinte about entrepreneurship, freelancing and the practical side of starting up." },
  { id: 'yasmine-haddad', name: 'Yasmine HADDAD', ...base, bio: "Writes for L'Empreinte about authentication, privacy and everyday security." },
  { id: 'karim-ouali', name: 'Karim OUALI', ...base, bio: "Writes for L'Empreinte about networks, protocols and how the web establishes trust." },
  { id: 'lydia-amrouche', name: 'Lydia AMROUCHE', ...base, bio: "Writes for L'Empreinte about cloud platforms and infrastructure economics." },
  { id: 'sofiane-benamara', name: 'Sofiane BENAMARA', ...base, bio: "Writes for L'Empreinte about robotics prototyping with modest budgets." },
  { id: 'amel-touati', name: 'Amel TOUATI', ...base, bio: "Writes for L'Empreinte about sensor networks and embedded systems." },
  { id: 'riad-cherif', name: 'Riad CHERIF', ...base, bio: "Writes for L'Empreinte about language models and local inference." },
]
