import type { Article, Block } from '@/types'

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ')

export const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function formatDate(iso: string, lang = 'en', opts?: Intl.DateTimeFormatOptions) {
  const locale = lang === 'ar' ? 'ar-DZ-u-nu-latn' : lang === 'fr' ? 'fr-FR' : 'en-GB'
  return new Date(iso).toLocaleDateString(locale, opts ?? { month: 'long', year: 'numeric' })
}
export const formatDay = (iso: string, lang = 'en') =>
  formatDate(iso, lang, { day: 'numeric', month: 'long', year: 'numeric' })

export const yearOf = (iso: string) => String(new Date(iso).getFullYear())

/** Texte brut d'un bloc (recherche plein texte, temps de lecture). */
export function blockText(b: Block): string {
  switch (b.type) {
    case 'p':
    case 'h2':
    case 'h3':
    case 'quote':
      return b.text
    case 'list':
      return b.items.join(' ')
    case 'figure':
      return b.caption
    case 'table':
      return [b.caption, ...b.head, ...b.rows.flat()].join(' ')
    case 'callout':
      return `${b.title} ${b.text}`
    case 'code':
      return ''
  }
}
export const articleText = (a: Article) => a.body.map(blockText).join(' ').replace(/\[\[\d+\]\]|\*/g, '')

export function readingMinutes(a: Article) {
  const words = articleText(a).split(/\s+/).length
  return Math.max(3, Math.round(words / 190) + 2)
}

export function slugify(s: string) {
  return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }
}
