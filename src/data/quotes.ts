import type { PullQuoteItem } from '@/types'

/** Citations extraites des articles. Les mêmes chaînes sont réutilisées dans les blocs `quote`. */
export const Q = {
  fastRoot: 'The most elegant hack is the one that turns a division into a subtraction.',
  nature: "La nature ne calcule pas : elle s'adapte.",
  entrepreneurship: 'Talent was never the missing ingredient. A legal, bankable structure was.',
  smallBusiness: 'A small business does not need a strategy for AI. It needs one problem worth solving.',
  solution: 'Every complaint is a specification waiting for an engineer.',
  passkeys: 'A password is a secret we ask people to remember and attackers to guess.',
  robotArm: 'A robot arm is a very patient argument between friction and gravity.',
} as const

export const quotes: PullQuoteItem[] = [
  { id: 'q1', text: Q.nature, article: 'a-quel-point-linformatique-est-si-loin-de-la-nature', author: 'tiziri-bouaoud' },
  { id: 'q2', text: Q.entrepreneurship, article: 'entrepreneurship-in-algeria', author: 'aymen-benraya' },
  { id: 'q3', text: Q.fastRoot, article: 'the-fast-inverse-square-root-algorithm', author: 'anis-koua' },
  { id: 'q4', text: Q.solution, article: 'what-if-we-were-the-solution', author: 'abdelbasset-meghraoui' },
  { id: 'q5', text: Q.passkeys, article: 'passkeys-the-end-of-the-password', author: 'yasmine-haddad' },
]
