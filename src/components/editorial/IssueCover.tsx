import type { CSSProperties } from 'react'
import type { Issue } from '@/types'
import { cx, formatDate } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import empreinteLight from '@/assets/logos/empreinte-light.png'
import empreinteDark from '@/assets/logos/empreinte-dark.png'
import estinLight from '@/assets/logos/estin-light.png'
import estinInk from '@/assets/logos/estin-ink.png'

const ratio = 'aspect-[330/428]'

/** Lignes concentriques discrètes : écho typographique de l'empreinte digitale de la couverture n°1. */
function Whorl() {
  const rings = Array.from({ length: 16 }, (_, i) => i + 1)
  return (
    <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-x-[8%] bottom-[8%] top-[46%] h-auto w-[84%] text-white/30" fill="none" stroke="currentColor" strokeWidth=".6" preserveAspectRatio="xMidYMid meet">
      {rings.map((r) => (
        <ellipse key={r} cx="100" cy="112" rx={r * 6} ry={r * 4.4} strokeDasharray={r % 3 === 0 ? '90 6' : r % 3 === 1 ? '140 4 12 4' : undefined} transform={`rotate(${r * 4} 100 112)`} />
      ))}
    </svg>
  )
}

/**
 * Couverture d'un numéro.
 * - `cover.image` : couverture réelle (prioritaire).
 * - sinon : couverture générée avec les logos officiels (jamais recréés en texte).
 */
export default function IssueCover({ issue, className, priority }: { issue: Issue; className?: string; priority?: boolean }) {
  const { t, lang } = useI18n()
  const alt = `${t('common.coverOf')} ${t('common.issueN', { n: issue.number })} — ${issue.title}`

  if (issue.cover.image)
    return <img src={issue.cover.image} alt={alt} width={990} height={1284} loading={priority ? 'eager' : 'lazy'} decoding="async" className={cx(ratio, 'w-full bg-night object-cover', className)} />

  const light = issue.cover.variant === 'night' || !issue.cover.variant
  const label = `${t('common.issueN', { n: issue.number }).toUpperCase()}, ${formatDate(issue.date, lang).toUpperCase()}`
  const style = { containerType: 'inline-size' } as CSSProperties
  return (
    <div role="img" aria-label={alt} style={style} className={cx('relative overflow-hidden', ratio, light ? 'bg-night text-white' : 'bg-cream text-ink', className)}>
      <img src={light ? estinLight : estinInk} alt="" className="absolute start-[10%] top-[6%] w-[12%]" />
      <img src={light ? empreinteLight : empreinteDark} alt="" className="absolute inset-x-0 top-[18%] mx-auto w-[66%]" />
      <p className="absolute inset-x-[8%] top-[30%] text-center font-sans font-medium uppercase" style={{ fontSize: '2.4cqw', letterSpacing: '0.22em' }}>{issue.subtitle ?? issue.title}</p>
      {light ? <Whorl /> : issue.cover.art && <img src={issue.cover.art} alt="" className="absolute inset-x-0 bottom-0 h-[62%] w-full object-cover object-[50%_24%]" />}
      <p className={cx('absolute bottom-[3.2%] end-[7%] font-sans font-medium', light ? 'text-white/85' : 'text-ink/85')} style={{ fontSize: '2.4cqw', letterSpacing: '0.14em' }}>{label}</p>
    </div>
  )
}
