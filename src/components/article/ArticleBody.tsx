import { Fragment } from 'react'
import type { Article, Block } from '@/types'
import Figure, { Ieee754Diagram } from './Figure'
import { cx } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

/** Formatage inline minimal : **gras**, *italique*, [[n]] renvoi de note. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[\[\d+\]\])/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**')) return <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
        if (p.startsWith('[[')) {
          const n = p.slice(2, -2)
          return <sup key={i}><a id={`ref-${n}`} href={`#note-${n}`} aria-label={`Note ${n}`}>{n}</a></sup>
        }
        if (p.startsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>
        return <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}

function Render({ b }: { b: Block }) {
  const { t } = useI18n()
  switch (b.type) {
    case 'p':
      return <p className={cx(b.lead && 'font-medium text-[1.3125rem] leading-[1.5] md:text-[1.5rem]')}><Inline text={b.text} /></p>
    case 'h2':
      return <h2 id={b.id}>{b.text}</h2>
    case 'h3':
      return <h3 id={b.id}>{b.text}</h3>
    case 'quote':
      return (
        <blockquote className="!my-12 border-s-[3px] border-mark ps-6 md:ps-8">
          <p className="font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.028em] md:text-[2.25rem]">{b.text}</p>
          {b.cite && <footer className="mt-4 font-sans text-[0.875rem] font-medium text-stone-700">— {b.cite}</footer>}
        </blockquote>
      )
    case 'list': {
      const L = b.ordered ? 'ol' : 'ul'
      return <L>{b.items.map((it, i) => <li key={i}><Inline text={it} /></li>)}</L>
    }
    case 'figure':
      return (
        <Figure caption={b.caption} credit={b.credit} wide={b.wide}>
          {b.custom === 'ieee754' ? <Ieee754Diagram label={b.alt} /> : <img src={b.src} alt={b.alt} loading="lazy" className="w-full" />}
        </Figure>
      )
    case 'table':
      return (
        <figure className="!my-10">
          <figcaption className="mb-3 font-sans text-[0.875rem] font-semibold">{b.caption}</figcaption>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={b.caption}>
            <table className="tbl w-full min-w-[420px]">
              <thead><tr>{b.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="!border-b !border-ink/15 !py-3 !pe-4 !text-[0.9375rem] !font-semibold !normal-case !tracking-normal !text-ink">{c}</th> : <td key={j}>{c}</td>))}</tr>)}</tbody>
            </table>
          </div>
        </figure>
      )
    case 'callout':
      return (
        <aside className="!my-10 border-s-4 border-clay bg-cream p-6 md:p-8" aria-label={b.title}>
          <p className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.12em] rtl:tracking-normal" style={{ color: '#9A3F14' }}>{t('article.sidebar')}</p>
          <p className="mt-2 font-display text-[1.25rem] font-semibold leading-snug">{b.title}</p>
          <p className="mt-2 font-sans text-[1rem] leading-relaxed text-ink/85">{b.text}</p>
        </aside>
      )
    case 'code':
      return (
        <figure className="!my-10">
          <pre tabIndex={0} className="overflow-x-auto rounded bg-night p-5 font-mono text-[0.8125rem] leading-relaxed text-white md:text-[0.875rem]" aria-label={`${b.language} code`}><code>{b.code}</code></pre>
          {b.caption && <figcaption className="mt-2 font-sans text-[0.8125rem] text-stone-700">{b.caption}</figcaption>}
        </figure>
      )
  }
}

export default function ArticleBody({ article }: { article: Article }) {
  const { t } = useI18n()
  return (
    <div className="prose-article" lang={article.lang} dir={article.lang === 'ar' ? 'rtl' : 'ltr'}>
      {article.body.map((b, i) => <Render key={i} b={b} />)}
      {article.notes && article.notes.length > 0 && (
        <section aria-labelledby="notes-title" className="!mt-14 border-t border-ink pt-6">
          <h2 id="notes-title" className="!mt-0 font-sans !text-[0.75rem] font-bold uppercase !tracking-[0.12em]">{t('article.notes')}</h2>
          <ol className="mt-4 space-y-3 font-sans !text-[0.9375rem] leading-relaxed text-stone-700">
            {article.notes.map((n) => (
              <li key={n.id} id={`note-${n.id}`} className="ps-1 !mt-0">
                {n.text} <a href={`#ref-${n.id}`} className="no-underline" aria-label={t('article.backToText')}>↩</a>
              </li>
            ))}
          </ol>
        </section>
      )}
      {article.references.length > 0 && (
        <section aria-labelledby="refs-title" className="!mt-12 border-t border-ink pt-6">
          <h2 id="refs-title" className="!mt-0 font-sans !text-[0.75rem] font-bold uppercase !tracking-[0.12em]">{t('article.references')}</h2>
          <ul className="mt-4 space-y-3 font-sans !text-[0.9375rem] leading-relaxed text-stone-700 !list-none !ps-0" dir="ltr" lang="en">
            {article.references.map((r) => <li key={r} className="ps-6 -indent-6 !mt-0">{r}</li>)}
          </ul>
        </section>
      )}
    </div>
  )
}

export const toc = (a: Article) => a.body.filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')
