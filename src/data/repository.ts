/**
 * Couche d'accès aux données.
 * Aujourd'hui : données locales. Demain : remplacer le corps de chaque méthode par un appel
 * à l'API (ex. Django REST Framework) en conservant les signatures.
 */
import type { Article, Author, Category, Issue, PullQuoteItem, SearchFilters, SearchHit } from '@/types'
import { articles } from './articles'
import { authors } from './authors'
import { categories } from './categories'
import { issues } from './issues'
import { quotes } from './quotes'
import { runSearch } from '@/lib/search'
import { yearOf } from '@/lib/utils'
import { siteConfig } from './siteConfig'

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date)

export const repo = {
  categories: (): Category[] => categories,
  category: (slug: string) => categories.find((c) => c.slug === slug),

  authors: (): Author[] => authors,
  author: (id: string) => authors.find((a) => a.id === id),
  authorsOf: (a: Article) => a.authors.map((id) => authors.find((x) => x.id === id)).filter(Boolean) as Author[],

  issues: (): Issue[] => [...issues].sort(byDateDesc),
  issue: (slug: string) => issues.find((i) => i.slug === slug),
  featuredIssue: () => issues.find((i) => i.slug === siteConfig.featuredIssueSlug) ?? repo.issues()[0],
  latestIssue: () => repo.issues()[0],
  issueYears: () => Array.from(new Set(issues.map((i) => yearOf(i.date)))).sort().reverse(),
  articleYears: () => Array.from(new Set(articles.map((a) => yearOf(a.date)))).sort().reverse(),

  articles: (): Article[] => [...articles].sort(byDateDesc),
  article: (slug: string) => articles.find((a) => a.slug === slug),
  articlesOfIssue: (slug: string) => articles.filter((a) => a.issue === slug).sort((a, b) => (a.pages ?? '').localeCompare(b.pages ?? '', undefined, { numeric: true })),
  articlesOfCategory: (slug: string) => articles.filter((a) => a.category === slug),
  featured: (n = 4) => articles.filter((a) => a.featured).sort(byDateDesc).slice(0, n),
  recent: (n = 8) => repo.articles().slice(0, n),
  popular: (n = 4) => [...articles].sort((a, b) => b.popularity - a.popularity).slice(0, n),
  related: (a: Article, n = 3) =>
    articles
      .filter((x) => x.slug !== a.slug)
      .map((x) => ({
        x,
        s: (x.category === a.category ? 3 : 0) + x.keywords.filter((k) => a.keywords.includes(k)).length + (x.authors.some((id) => a.authors.includes(id)) ? 2 : 0),
      }))
      .filter((r) => r.s > 0)
      .sort((p, q) => q.s - p.s)
      .slice(0, n)
      .map((r) => r.x),

  quotes: (): PullQuoteItem[] => quotes,

  /** Asynchrone à dessein : reproduit la latence d'une vraie API pour tester les états de chargement. */
  search: (filters: SearchFilters): Promise<SearchHit[]> =>
    new Promise((resolve) => setTimeout(() => resolve(runSearch(articles, authors, filters)), 380)),
}
