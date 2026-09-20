import type { Issue } from '@/types'
import { img } from './images'

/**
 * Numéro 1 : données issues de la maquette (couverture réelle, texte de présentation).
 * Numéros 2 et 3 : DÉMONSTRATION (couvertures générées à partir des logos) — à remplacer.
 */
export const issues: Issue[] = [
  {
    slug: 'issue-1-june-2025',
    number: 1,
    title: 'Beyond the borders of the digital',
    subtitle: 'Au-delà des frontières du numérique',
    date: '2025-06-15',
    summary:
      "What if our most advanced technologies were inspired by nature? This inaugural issue explores bio-inspired intelligence, innovative algorithms, and student entrepreneurship in Algeria. Featuring exclusive interviews on the LITAN laboratory and ESTIN's new IoT specialty.",
    editorial: [
      'Every journal begins with a decision to leave something behind. For this first issue, we chose to leave a mark — an empreinte — on the way students at ESTIN talk about technology: not as a finished product to consume, but as a living practice to question.',
      'The pieces gathered here share one curiosity. What happens when computing looks at nature not as a metaphor but as a method? From the bit-level tricks that made real-time graphics possible to the ants that inspired routing algorithms, the answers are rarely where we expect them.',
      'They also share a conviction: that ambition needs structure. Two contributors write frankly about what it takes to start up in Algeria today. We hope this issue gives you a reason to read, to disagree, and — above all — to write for the next one.',
    ],
    cover: { image: img.coverN1 },
    pdfUrl: '#', // PLACEHOLDER — lien vers le PDF hébergé
  },
  {
    slug: 'issue-2-december-2025',
    number: 2,
    title: 'Trust, by design',
    subtitle: 'Sécurité, confiance et infrastructures',
    date: '2025-12-15',
    summary:
      'How do systems earn our trust? Four contributors look at passwordless authentication, the handshake that secures the web, cloud independence and zero trust on a student budget.',
    editorial: [
      'Trust is an engineering property before it is a feeling. It is designed, tested, and — too often — assumed.',
      'This issue follows the trail of a single request across the network: who you are, who you are talking to, and where your data ends up. Each article takes a piece of that chain apart.',
    ],
    cover: { variant: 'clay', art: img.poster },
    pdfUrl: '#',
    pages: 44,
    demo: true,
  },
  {
    slug: 'issue-3-june-2026',
    number: 3,
    title: 'Machines that listen',
    subtitle: 'Robotique, capteurs et intelligence embarquée',
    date: '2026-06-15',
    summary:
      'From a robot arm built out of salvaged servos to a sensor network on a hillside campus: this issue is about machines that sense, decide and act — and the students who build them.',
    editorial: [
      'A machine that listens is a machine that has to be wrong sometimes. Sensors drift, batteries die, radios drop packets. Engineering, here, is the art of being wrong gracefully.',
      'The four pieces in this issue are field notes: honest accounts of what worked, what did not, and what we would do differently.',
    ],
    cover: { variant: 'night' },
    pdfUrl: '#',
    pages: 52,
    demo: true,
  },
]
