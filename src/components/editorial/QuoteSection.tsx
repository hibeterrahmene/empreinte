import { useState } from 'react'
import { Link } from 'react-router-dom'
import { repo } from '@/data/repository'
import { useI18n } from '@/lib/i18n'
import { cx } from '@/lib/utils'
import { Arrow } from '@/components/ui/Button'

/** Citations issues des articles : une grande citation active + sélection typographique à côté. */
export default function QuoteSection() {
  const { t } = useI18n()
  const quotes = repo.quotes()
  const [i, setI] = useState(0)
  const q = quotes[i]
  const article = repo.article(q.article)
  const author = repo.author(q.author)
  return (
    <section aria-labelledby="quotes-h" className="page mt-24 md:mt-36">
      <h2 id="quotes-h" className="sr-only">{t('home.quotes')}</h2>
      <div className="grid gap-10 border-t border-ink pt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:pt-14">
        <figure key={q.id} className="swap-in">
          <span aria-hidden className="block font-display text-[6rem] font-bold leading-[0.6] text-mark md:text-[9rem]">“</span>
          <blockquote lang={article?.lang}>
            <p className="font-display font-semibold tracking-[-0.035em]" style={{ fontSize: 'clamp(2rem, 5.2vw, 4.75rem)', lineHeight: 1.03 }}>{q.text}</p>
          </blockquote>
          <figcaption className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[0.9375rem]">
            <span className="font-semibold">{author?.name}</span>
            {article && <Link to={`/articles/${article.slug}`} className="group inline-flex items-center gap-1.5 text-stone-700 hover:text-ink"><span className="link" lang={article.lang}>{article.title}</span><Arrow /></Link>}
          </figcaption>
        </figure>
        <div role="group" aria-label={t('home.quotes')} className="self-end">
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {quotes.map((x, idx) => (
              <li key={x.id}>
                <button type="button" onClick={() => setI(idx)} aria-pressed={idx === i} className={cx('flex w-full gap-3 py-4 text-start transition-colors duration-200', idx === i ? 'text-ink' : 'text-stone-500 hover:text-ink')}>
                  <span aria-hidden className={cx('mt-2 h-2 w-2 shrink-0 rounded-full transition-colors', idx === i ? 'bg-mark' : 'bg-transparent')} />
                  <span className="line-clamp-2 font-display text-[1.0625rem] font-medium leading-snug tracking-[-0.015em]" lang={repo.article(x.article)?.lang}>{x.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
