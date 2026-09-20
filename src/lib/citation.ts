import type { Article, Author, Issue } from '@/types'
import { formatDate } from './utils'

export function splitName(name: string) {
  const tokens = name.trim().split(/\s+/)
  const isUpper = (s: string) => s.length > 1 && s === s.toUpperCase() && /[A-ZÀ-Ý]/.test(s)
  const surname: string[] = []
  const first: string[] = []
  tokens.forEach((t) => (isUpper(t) ? surname : first).push(t))
  if (!surname.length && first.length) surname.push(first.pop()!)
  const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase()
  return { surname: surname.map(cap).join(' '), first: first.join(' ') }
}
const initials = (first: string) => first.split(/\s+/).filter(Boolean).map((p) => p[0].toUpperCase() + '.').join(' ')

export interface CitationCtx { article: Article; authors: Author[]; issue?: Issue; url: string }

const pagesOf = (a: Article) => (a.pages ? a.pages.replace('–', '–') : '')

export function apa({ article: a, authors, issue, url }: CitationCtx) {
  const list = authors.map((x) => { const n = splitName(x.name); return `${n.surname}, ${initials(n.first)}` })
  const who = list.length > 1 ? `${list.slice(0, -1).join(', ')}, & ${list[list.length - 1]}` : list[0] ?? ''
  const d = formatDate(a.date, 'en', { year: 'numeric', month: 'long', day: 'numeric' })
  const year = new Date(a.date).getFullYear()
  const month = d.split(' ')[1]
  return `${who} (${year}, ${month} ${new Date(a.date).getDate()}). ${a.title}. L'Empreinte${issue ? `, ${issue.number}` : ''}${pagesOf(a) ? `, ${pagesOf(a)}` : ''}. ${url}`
}

export function mla({ article: a, authors, issue, url }: CitationCtx) {
  const ns = authors.map((x) => splitName(x.name))
  const who = ns.length === 1 ? `${ns[0].surname}, ${ns[0].first}` : ns.length === 2 ? `${ns[0].surname}, ${ns[0].first}, and ${ns[1].first} ${ns[1].surname}` : `${ns[0].surname}, ${ns[0].first}, et al`
  const d = new Date(a.date)
  const mon = d.toLocaleDateString('en-GB', { month: 'short' })
  return `${who}. “${a.title}.” L'Empreinte${issue ? `, no. ${issue.number}` : ''}, ${mon} ${d.getFullYear()}${pagesOf(a) ? `, pp. ${pagesOf(a)}` : ''}, ${url.replace(/^https?:\/\//, '')}.`
}

export function bibtex({ article: a, authors, issue, url }: CitationCtx) {
  const ns = authors.map((x) => splitName(x.name))
  const key = `${(ns[0]?.surname ?? 'anon').toLowerCase().replace(/[^a-z]/g, '')}${new Date(a.date).getFullYear()}${a.slug.split('-')[0].replace(/[^a-z]/g, '')}`
  return `@article{${key},
  author  = {${ns.map((n) => `${n.surname}, ${n.first}`).join(' and ')}},
  title   = {${a.title}},
  journal = {L'Empreinte},
  year    = {${new Date(a.date).getFullYear()}},${issue ? `\n  number  = {${issue.number}},` : ''}${a.pages ? `\n  pages   = {${a.pages.replace('–', '--')}},` : ''}
  url     = {${url}}
}`
}
