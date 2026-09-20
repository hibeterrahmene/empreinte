import { useState } from 'react'
import { Check, Link2, Mail, Share2 } from 'lucide-react'
import { copyText } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

const btn = 'inline-flex h-10 items-center gap-2 rounded border border-ink/25 px-3.5 font-sans text-[0.8125rem] font-semibold text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white'

export default function ShareBar({ title, path }: { title: string; path: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}${path}`
  const enc = encodeURIComponent
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('article.share')}>
      <button type="button" className={btn} onClick={async () => { if (await copyText(url)) { setCopied(true); window.setTimeout(() => setCopied(false), 2200) } }}>
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
        {copied ? t('common.copied') : t('article.copyLink')}
      </button>
      <a className={btn} href={`mailto:?subject=${enc(title)}&body=${enc(url)}`}><Mail className="h-4 w-4" aria-hidden />Email</a>
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> ({t('common.newTab')})</span></a>
      <a className={btn} href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener noreferrer">X<span className="sr-only"> ({t('common.newTab')})</span></a>
      {canShare && (
        <button type="button" className={btn} onClick={() => navigator.share({ title, url }).catch(() => undefined)}><Share2 className="h-4 w-4" aria-hidden />{t('article.shareMore')}</button>
      )}
    </div>
  )
}
