import type { Article, Author, SearchFilters, SearchHit } from '@/types'
import { articleText, escapeRegExp, norm, yearOf } from './utils'
import { categories } from '@/data/categories'

export const emptyFilters: SearchFilters = {
  q: '',
  fullText: true,
  authors: [],
  topics: [],
  years: [],
  issues: [],
  from: '',
  to: '',
  sort: 'relevance',
}

export const tokenize = (q: string) => norm(q).split(/\s+/).filter(Boolean)

function snippetFor(text: string, tokens: string[], max = 220) {
  const plain = text.replace(/\s+/g, ' ').trim()
  if (!tokens.length) return plain.slice(0, max) + (plain.length > max ? '…' : '')
  const n = norm(plain)
  let idx = -1
  for (const t of tokens) {
    const i = n.indexOf(t)
    if (i !== -1 && (idx === -1 || i < idx)) idx = i
  }
  if (idx === -1) return plain.slice(0, max) + (plain.length > max ? '…' : '')
  const start = Math.max(0, idx - 80)
  const end = Math.min(plain.length, start + max)
  return (start > 0 ? '…' : '') + plain.slice(start, end) + (end < plain.length ? '…' : '')
}

export function runSearch(all: Article[], authors: Author[], f: SearchFilters): SearchHit[] {
  const tokens = tokenize(f.q)
  const authorName = (id: string) => authors.find((a) => a.id === id)?.name ?? ''
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? ''

  const hits: SearchHit[] = []
  for (const a of all) {
    if (f.authors.length && !a.authors.some((id) => f.authors.includes(id))) continue
    if (f.topics.length && !f.topics.includes(a.category)) continue
    if (f.years.length && !f.years.includes(yearOf(a.date))) continue
    if (f.issues.length && !f.issues.includes(a.issue)) continue
    if (f.from && a.date < f.from) continue
    if (f.to && a.date > f.to + 'T23:59:59') continue

    let score = 0
    let snippetSource = a.excerpt
    if (tokens.length) {
      const fields = {
        title: norm(a.title),
        keywords: norm(a.keywords.join(' ')),
        people: norm(a.authors.map(authorName).join(' ') + ' ' + catName(a.category)),
        deck: norm(a.deck + ' ' + a.excerpt),
      }
      const body = f.fullText ? norm(articleText(a)) : ''
      let ok = true
      for (const t of tokens) {
        const re = new RegExp('(?:^|[^a-z0-9])' + escapeRegExp(t), 'g')
        const count = (s: string) => (s.match(re) ?? []).length
        const s =
          count(fields.title) * 10 + count(fields.keywords) * 6 + count(fields.people) * 5 +
          count(fields.deck) * 3 + Math.min(count(body), 8)
        if (!s) { ok = false; break }
        score += s
      }
      if (!ok) continue
      if (f.fullText && !tokens.some((t) => norm(a.excerpt).includes(t))) snippetSource = articleText(a)
    } else {
      score = a.popularity / 100
    }
    hits.push({ article: a, score, snippet: snippetFor(snippetSource, tokens) })
  }

  hits.sort((x, y) => {
    if (f.sort === 'newest') return y.article.date.localeCompare(x.article.date)
    if (f.sort === 'oldest') return x.article.date.localeCompare(y.article.date)
    return y.score - x.score || y.article.date.localeCompare(x.article.date)
  })
  return hits
}

/** (dé)sérialisation des filtres dans l'URL — le lien de recherche est partageable. */
export function filtersFromParams(p: URLSearchParams): SearchFilters {
  const list = (k: string) => (p.get(k) ? p.get(k)!.split(',').filter(Boolean) : [])
  const sort = p.get('sort')
  return {
    q: p.get('q') ?? '',
    fullText: p.get('ft') !== '0',
    authors: list('author'),
    topics: list('topic'),
    years: list('year'),
    issues: list('issue'),
    from: p.get('from') ?? '',
    to: p.get('to') ?? '',
    sort: sort === 'newest' || sort === 'oldest' ? sort : 'relevance',
  }
}

export function filtersToParams(f: SearchFilters) {
  const p = new URLSearchParams()
  if (f.q.trim()) p.set('q', f.q.trim())
  if (!f.fullText) p.set('ft', '0')
  if (f.authors.length) p.set('author', f.authors.join(','))
  if (f.topics.length) p.set('topic', f.topics.join(','))
  if (f.years.length) p.set('year', f.years.join(','))
  if (f.issues.length) p.set('issue', f.issues.join(','))
  if (f.from) p.set('from', f.from)
  if (f.to) p.set('to', f.to)
  if (f.sort !== 'relevance') p.set('sort', f.sort)
  return p
}

export const activeFilterCount = (f: SearchFilters) =>
  f.authors.length + f.topics.length + f.years.length + f.issues.length + (f.from ? 1 : 0) + (f.to ? 1 : 0)
