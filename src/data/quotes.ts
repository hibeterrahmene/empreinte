import type { PullQuoteItem } from '@/types'

/** Citations authentiques extraites des articles des numéros 1 et 2. */
export const Q = {
  nature: "C'est peu de le dire, mais la nature a été le meilleur laboratoire pour les conceptions de l'homme.",
  solution: 'We are students in a higher school. We cannot afford to be part of the problem. We must be part of the solution.',
  leanMindset: 'In the first place your mind is your startup. Build it lean.',
  entrepreneurship: "Starting an agency wasn't just a choice; it was the only way to take my career to the next level.",
  invSqrt: 'Beyond its historical significance, it provides deep insight into numerical optimization, low-level computing, and the trade-offs between precision and performance.',
  regression: 'One should never be a passive consumer of information. True skill lies in the ability to research, synthesize, and build a solid foundation.',
  containers: 'Writing code is only half of delivering software that actually runs and scales in the real world.',
  machinesWrite: 'The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.',
} as const

export const quotes: PullQuoteItem[] = [
  { id: 'q1', text: Q.nature, article: 'a-quel-point-linformatique-est-si-loin-de-la-nature', author: 'tiziri-bouaoud' },
  { id: 'q2', text: Q.solution, article: 'what-if-we-were-the-solution', author: 'meghraoui' },
  { id: 'q3', text: Q.leanMindset, article: 'the-lean-mindset', author: 'ismail-ouhererre' },
  { id: 'q4', text: Q.entrepreneurship, article: 'entrepreneurship-in-algeria', author: 'aymen-benraya' },
  { id: 'q5', text: Q.regression, article: 'supervised-machine-learning-linear-regression', author: 'mahdi-boukendoul' },
  { id: 'q6', text: Q.containers, article: 'containers-what-are-they', author: 'abderrahmane-lamari' },
  { id: 'q7', text: Q.machinesWrite, article: 'when-machines-start-to-write', author: 'yasmine-oukemoum' },
]
