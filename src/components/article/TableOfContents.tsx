import { useEffect, useState } from 'react'
import type { Article } from '@/types'
import { cx } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { toc } from './ArticleBody'

/** Sommaire de l'article avec section active (desktop uniquement). */
export default function TableOfContents({ article }: { article: Article }) {
  const { t } = useI18n()
  const items = toc(article)
  const [active, setActive] = useState(items[0]?.id ?? '')
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (vis) setActive(vis.target.id)
    }, { rootMargin: '-15% 0px -70% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [article.slug]) // eslint-disable-line react-hooks/exhaustive-deps
  if (items.length < 2) return null
  return (
    <nav aria-label={t('article.inThisArticle')} className="sticky top-28">
      <p className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.12em] text-stone-700 rtl:tracking-normal">{t('article.inThisArticle')}</p>
      <ul className="mt-4 space-y-3 border-s border-ink/15">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={active === i.id ? 'true' : undefined} className={cx('-ms-px block border-s-2 ps-4 font-sans text-[0.875rem] leading-snug transition-colors duration-200', active === i.id ? 'border-mark text-ink' : 'border-transparent text-stone-500 hover:text-ink')}>{i.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
