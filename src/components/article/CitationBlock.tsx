import { useMemo, useState } from 'react'
import { Check, Copy, Quote } from 'lucide-react'
import type { Article, Author, Issue } from '@/types'
import { apa, bibtex, mla } from '@/lib/citation'
import { copyText } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import Modal from '@/components/ui/Modal'
import Tabs from '@/components/ui/Tabs'
import Button from '@/components/ui/Button'

type Fmt = 'apa' | 'mla' | 'bibtex'

/** Bouton « Citer » + fenêtre avec les formats APA, MLA et BibTeX. */
export default function CitationBlock({ article, authors, issue, variant = 'outline' }: { article: Article; authors: Author[]; issue?: Issue; variant?: 'outline' | 'ghost' }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [fmt, setFmt] = useState<Fmt>('apa')
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/articles/${article.slug}` : ''
  const text = useMemo(() => {
    const ctx = { article, authors, issue, url }
    return fmt === 'apa' ? apa(ctx) : fmt === 'mla' ? mla(ctx) : bibtex(ctx)
  }, [article, authors, issue, url, fmt])

  const copy = async () => {
    if (await copyText(text)) { setCopied(true); window.setTimeout(() => setCopied(false), 2200) }
  }
  return (
    <>
      <Button variant={variant} size="sm" icon={<Quote className="h-4 w-4" aria-hidden />} onClick={() => setOpen(true)} aria-haspopup="dialog">{t('article.cite')}</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={t('article.citeTitle')}>
        <Tabs<Fmt> idPrefix="cite" label={t('article.citeFormat')} value={fmt} onChange={(v) => { setFmt(v); setCopied(false) }} tabs={[{ id: 'apa', label: 'APA' }, { id: 'mla', label: 'MLA' }, { id: 'bibtex', label: 'BibTeX' }]} />
        <div id="cite-panel" role="tabpanel" aria-labelledby={`cite-tab-${fmt}`} className="border-t border-ink/15 pt-5" dir="ltr">
          <pre className="whitespace-pre-wrap break-words rounded bg-stone-50 p-4 font-mono text-[0.8125rem] leading-relaxed text-ink">{text}</pre>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-[0.8125rem] text-stone-500" role="status" aria-live="polite">{copied ? t('common.copied') : ''}</p>
          <Button size="md" onClick={copy} icon={copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}>{t('article.copyCitation')}</Button>
        </div>
      </Modal>
    </>
  )
}
