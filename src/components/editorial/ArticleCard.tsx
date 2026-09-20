import { Link } from 'react-router-dom'
import type { Article } from '@/types'
import { repo } from '@/data/repository'
import { articleImage } from '@/lib/articleImage'
import { cx, formatDate, readingMinutes } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import Tag from '@/components/ui/Tag'
import Metadata from './Metadata'
import Highlight from './Highlight'
import Button from '@/components/ui/Button'
import { CalendarDays } from 'lucide-react'

type Variant = 'feature' | 'thumb' | 'row' | 'result' | 'text'

interface Props {
  article: Article
  variant?: Variant
  tokens?: string[]
  snippet?: string
  priority?: boolean
  className?: string
}

function Picture({ article, ratio, className, sizes }: { article: Article; ratio: string; className?: string; sizes?: string }) {
  const im = articleImage(article)
  return (
    <div className={cx('overflow-hidden bg-cream', ratio, className)}>
      <img src={im.src} alt={im.alt} loading="lazy" decoding="async" sizes={sizes} style={{ objectPosition: im.position }} className="h-full w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover/card:scale-[1.035]" />
    </div>
  )
}

/** Carte éditoriale : lien étendu sur le titre, étiquette cliquable au-dessus. */
export default function ArticleCard({ article, variant = 'feature', tokens = [], snippet, className }: Props) {
  const { t, lang, cat } = useI18n()
  const authors = repo.authorsOf(article)
  const minutes = readingMinutes(article)
  const href = `/articles/${article.slug}`
  const tag = <Tag to={`/search?topic=${article.category}`} className="relative z-10">{cat(article.category)}</Tag>
  const titleLink = (cls: string) => (
    <h3 className={cls}>
      <Link to={href} lang={article.lang} className="after:absolute after:inset-0 after:content-[''] hover:underline hover:decoration-1 hover:underline-offset-4">
        <Highlight text={article.title} tokens={tokens} />
      </Link>
    </h3>
  )

  if (variant === 'feature')
    return (
      <article className={cx('group/card relative', className)}>
        <Picture article={article} ratio="aspect-[16/10]" sizes="(min-width:1024px) 55vw, 100vw" />
        <div className="mt-5">
          {tag}
          {titleLink('t-h1 mt-4 !text-[clamp(1.75rem,3.2vw,2.75rem)] max-w-[22ch]')}
          <p className="mt-3 max-w-[56ch] font-display text-[1.0625rem] leading-snug text-stone-700" lang={article.lang}>{article.excerpt}</p>
          <Metadata authors={authors} date={article.date} minutes={minutes} className="mt-5" />
        </div>
      </article>
    )

  if (variant === 'thumb')
    return (
      <article className={cx('group/card relative grid grid-cols-[minmax(96px,38%)_1fr] items-start gap-4 md:gap-5', className)}>
        <Picture article={article} ratio="aspect-[4/3]" sizes="200px" />
        <div className="min-w-0">
          {tag}
          {titleLink('t-h4 mt-2.5 md:text-[1.125rem]')}
          <Metadata authors={authors} size="sm" avatar className="mt-3" />
        </div>
      </article>
    )

  if (variant === 'row')
    return (
      <article className={cx('group/card relative grid gap-5 py-7 sm:grid-cols-[minmax(200px,38%)_1fr] sm:gap-8', className)}>
        <Picture article={article} ratio="aspect-[4/3] sm:aspect-auto sm:min-h-[200px]" sizes="(min-width:640px) 30vw, 100vw" />
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-4">
            {tag}
            <span className="inline-flex items-center gap-1.5 font-sans text-[0.8125rem] text-stone-700"><CalendarDays className="h-4 w-4" aria-hidden /><time dateTime={article.date}>{formatDate(article.date, lang)}</time></span>
          </div>
          {titleLink('t-h3 mt-4')}
          <p className="mt-2.5 line-clamp-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-stone-700" lang={article.lang}>{article.excerpt}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
            <Metadata authors={authors} size="sm" minutes={minutes} />
            <span className="relative z-10 hidden sm:block"><Button to={href} variant="outline" size="sm" aria-label={`${t('common.readMore')}: ${article.title}`}>{t('common.readMore')}</Button></span>
          </div>
        </div>
      </article>
    )

  if (variant === 'result')
    return (
      <article className={cx('group/card relative grid gap-5 py-8 md:grid-cols-[1fr_200px] md:gap-10', className)}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {tag}
            <Link to={`/issues/${article.issue}`} className="relative z-10 font-sans text-[0.8125rem] font-medium text-stone-700 hover:text-ink hover:underline">
              {t('common.issueN', { n: repo.issue(article.issue)?.number ?? '' })}
            </Link>
          </div>
          {titleLink('t-h3 mt-3')}
          <p className="mt-2.5 max-w-[68ch] text-[0.9375rem] leading-relaxed text-stone-700" lang={article.lang}><Highlight text={snippet ?? article.excerpt} tokens={tokens} /></p>
          <Metadata authors={authors} date={article.date} minutes={minutes} size="sm" className="mt-4" />
          {article.keywords.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[0.8125rem] text-stone-500" aria-label={t('search.keywords')}>
              {article.keywords.slice(0, 4).map((k) => <li key={k}>#{k.replace(/\s+/g, '-')}</li>)}
            </ul>
          )}
        </div>
        <div className="order-first md:order-last"><Picture article={article} ratio="aspect-[16/9] md:aspect-[4/3]" sizes="200px" /></div>
      </article>
    )

  return (
    <article className={cx('group/card relative', className)}>
      {tag}
      {titleLink('t-h4 mt-2.5 md:text-[1.1875rem]')}
      <Metadata authors={authors} date={article.date} size="sm" avatar={false} className="mt-2.5" />
    </article>
  )
}
