import { Link } from 'react-router-dom'
import { CalendarDays, Clock } from 'lucide-react'
import type { Author } from '@/types'
import { cx, formatDate, initials } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

export function AuthorAvatar({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  return (
    <span aria-hidden className={cx('inline-flex shrink-0 select-none items-center justify-center rounded-full bg-stone-200 font-sans font-semibold text-stone-700', className)} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials(name)}
    </span>
  )
}

interface Props {
  authors: Author[]
  date?: string
  minutes?: number
  avatar?: boolean
  link?: boolean
  size?: 'sm' | 'md'
  center?: boolean
  className?: string
}

/** « By Auteur · 📅 juin 2025 · 6 min » — ligne de métadonnées unique du site. */
export default function Metadata({ authors, date, minutes, avatar = true, link = false, size = 'md', center, className }: Props) {
  const { t, lang } = useI18n()
  const text = size === 'sm' ? 'text-[0.8125rem]' : 'text-[0.875rem]'
  return (
    <div className={cx('flex flex-wrap items-center gap-x-5 gap-y-2 font-sans', text, center && 'justify-center', className)}>
      <div className="flex items-center gap-2">
        {avatar && <AuthorAvatar name={authors[0]?.name ?? ''} size={size === 'sm' ? 22 : 26} />}
        <span>
          <em className="me-1 text-stone-700">{t('meta.by')}</em>
          {authors.map((a, i) => (
            <span key={a.id}>
              {i > 0 && ', '}
              {link ? <Link to={`/search?author=${a.id}`} className="link font-medium">{a.name}</Link> : <span className="font-medium">{a.name}</span>}
            </span>
          ))}
        </span>
      </div>
      {date && (
        <span className="inline-flex items-center gap-1.5 text-stone-700">
          <CalendarDays className="h-4 w-4" aria-hidden />
          <time dateTime={date}>{formatDate(date, lang)}</time>
        </span>
      )}
      {minutes !== undefined && (
        <span className="inline-flex items-center gap-1.5 text-stone-700">
          <Clock className="h-4 w-4" aria-hidden />
          {t('meta.minRead', { n: minutes })}
        </span>
      )}
    </div>
  )
}
