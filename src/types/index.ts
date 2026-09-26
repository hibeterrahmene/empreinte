export type LangCode = 'en' | 'fr' | 'ar'

export interface Category {
  slug: string
  name: string
  description: string
}

export interface Author {
  id: string
  name: string
  role: string
  affiliation: string
  bio: string
}

export interface IssueCover {
  /** Image de couverture réelle (prioritaire). */
  image?: string
  /** Sinon : couverture typographique générée à partir des logos officiels. */
  variant?: 'night' | 'clay' | 'cream'
  art?: string
}

export interface Issue {
  slug: string
  number: number
  title: string
  subtitle?: string
  date: string // ISO
  summary: string
  editorial: string[]
  cover: IssueCover
  pdfUrl?: string
  pages?: number
  /** true = donnée de démonstration à remplacer */
  demo?: boolean
}

export type Block =
  | { type: 'p'; text: string; lead?: boolean }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string; id: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'figure'; alt: string; caption: string; credit?: string; src?: string; custom?: 'ieee754'; wide?: boolean }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'code'; language: string; code: string; caption?: string }

export interface ArticleImage {
  src: string
  alt: string
  caption?: string
  position?: string
}

export interface Article {
  slug: string
  title: string
  deck: string
  category: string // Category.slug
  authors: string[] // Author.id
  issue: string // Issue.slug
  date: string // ISO
  lang: LangCode
  excerpt: string
  keywords: string[]
  image?: ArticleImage
  body: Block[]
  notes?: { id: number; text: string }[]
  references: string[]
  pages?: string
  popularity: number
  featured?: boolean
  demo?: boolean
  /** Rubrique imprimée du numéro (Varia, Dossier, Comptes-rendus, Entretiens…), quand elle existe. */
  section?: string
}

export interface PullQuoteItem {
  id: string
  text: string
  article: string // Article.slug
  author: string // Author.id
}

export type SubmissionStatus = 'received' | 'in_review' | 'revisions' | 'accepted' | 'declined'

export interface Submission {
  id: string
  title: string
  category: string
  submittedAt: string
  status: SubmissionStatus
  note?: string
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  affiliation: string
  bio: string
  orcid?: string
}

export interface UserPrefs {
  language: LangCode
  digest: boolean
  newIssue: boolean
  submissionUpdates: boolean
  comments: boolean
  reduceMotion: boolean
}

export interface SearchFilters {
  q: string
  fullText: boolean
  authors: string[]
  topics: string[]
  years: string[]
  issues: string[]
  from: string
  to: string
  sort: 'relevance' | 'newest' | 'oldest'
}

export interface SearchHit {
  article: Article
  score: number
  snippet: string
}
