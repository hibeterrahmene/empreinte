import type { Issue } from '@/types'
import { img } from './images'

/**
 * Les deux numéros réellement publiés de L'Empreinte. Couvertures et PDF sont les
 * fichiers originaux fournis par la rédaction (public/issues/).
 */
export const issues: Issue[] = [
  {
    slug: 'issue-1-june-2025',
    number: 1,
    title: 'Beyond the borders of the digital',
    subtitle: 'Au-delà des frontières du numérique',
    date: '2025-06-04',
    summary:
      "Le premier numéro de la revue des étudiants de l'ESTIN : intelligence artificielle inspirée du vivant, algorithmes bas niveau, smart contracts, cybersécurité, entrepreneuriat étudiant, et deux entretiens avec le laboratoire LITAN et la spécialité IoT de l'école.",
    editorial: [
      "Sous l'égide de Monsieur le Directeur de l'école, la bibliothèque de l'ESTIN a le plaisir d'annoncer la création de la revue de la bibliothèque L'Empreinte, née d'une initiative du Dr S. Iken, responsable de la bibliothèque.",
      "La revue souhaiterait assurer le rôle d'un support de communication permettant à nos étudiants de s'exprimer, de dire, d'annoncer leur avis sur le développement technologique fulgurant que connaît notre monde actuel. Elle servira aussi à informer nos étudiants sur les avancées les plus récentes dans les domaines technologiques et celui des sciences de l'informatique.",
      "Pourquoi le choix de l'intitulé L'Empreinte ? Elle permet à notre étudiant de laisser sa signature pour les générations futures car les numéros de la revue seront archivés. Les fils voire les petits-fils peuvent lire les contributions de leurs parents.",
      "La vocation de notre revue est certes la vulgarisation, mais aussi elle suivra de très près le monde des start-up et celui des innovations. La revue sera sans aucun penchant idéologique, apolitique et totalement neutre, obéissant ainsi à l'éthique régissant les revues scientifiques.",
      'Nous invitons les étudiants à laisser leur Empreinte.',
    ],
    cover: { image: img.cover1 },
    pdfUrl: '/issues/lempreinte-numero-1-juin-2025.pdf',
  },
  {
    slug: 'issue-2-april-2026',
    number: 2,
    title: 'Digital Technologies: Concepts and Academic Perspectives',
    date: '2026-04-01',
    summary:
      'A guided exploration of modern digital technologies, from artificial intelligence and software systems to security, accessibility, and academic perspectives — with interviews of the ESTIN director, Pr. Abdelkamel Tari, and of faculty researchers.',
    editorial: [
      'This second issue of L’Empreinte brings together a diverse collection of scientific articles exploring a wide range of technological fields. It contributes to a broader reflection on the evolution of digital technologies and modern computing, covering both technical foundations such as Artificial Intelligence, Containers, IoT security, Data Structures, and key ethical and societal issues, including AI governance, intellectual property, and digital accessibility.',
      'This edition also highlights the human and institutional sides of science and innovation, with topics related to academic leadership and innovation pathways. Its goal is to better understand, guide, and shape the future of science and technology.',
      'In addition, L’Empreinte is honored to feature insightful interviews with faculty members, researchers, and other figures from the academic world. These conversations give readers the opportunity to broaden their perspectives, discover the views of experienced researchers in technology and scientific research, and reflect on the future of the digital world.',
    ],
    cover: { image: img.cover2 },
    pdfUrl: '/issues/lempreinte-numero-2-avril-2026.pdf',
    pages: 114,
  },
]
