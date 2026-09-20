import { cx } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props { caption?: string; credit?: string; children: ReactNode; wide?: boolean; className?: string }

export default function Figure({ caption, credit, children, wide, className }: Props) {
  return (
    <figure className={cx('my-10 md:my-12', wide && 'lg:relative lg:left-1/2 lg:w-[min(1040px,calc(100vw-6rem))] lg:-translate-x-1/2', className)}>
      {children}
      {(caption || credit) && (
        <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-ink/15 pt-3 font-sans text-[0.8125rem] leading-snug text-stone-700">
          <span className="max-w-[62ch]">{caption}</span>
          {credit && <span className="text-stone-500">{credit}</span>}
        </figcaption>
      )}
    </figure>
  )
}

/** Schéma IEEE 754 (simple précision) — figure d'exemple pour l'article sur l'inverse racine carrée. */
export function Ieee754Diagram({ label }: { label: string }) {
  const W = 22
  const cell = (i: number) => (i === 0 ? '#D2622D' : i <= 8 ? '#548EC1' : '#0B1629')
  return (
    <div className="overflow-x-auto bg-cream p-5 md:p-8" role="img" aria-label={label}>
      <svg viewBox="0 0 720 150" className="mx-auto block min-w-[600px]" fontFamily="Figtree, sans-serif">
        {Array.from({ length: 32 }, (_, i) => (
          <g key={i}>
            <rect x={8 + i * W} y={56} width={W - 2} height={40} fill={cell(i)} />
            <text x={8 + i * W + (W - 2) / 2} y={81} textAnchor="middle" fontSize="11" fill="#fff">{i === 0 ? 's' : i <= 8 ? 'e' : 'm'}</text>
          </g>
        ))}
        <text x={8 + (W - 2) / 2} y={42} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0A0A0B">sign</text>
        <text x={8 + W + 4 * W} y={42} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0A0A0B">exponent (8 bits)</text>
        <text x={8 + 9 * W + 11.5 * W} y={42} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0A0A0B">mantissa (23 bits)</text>
        <g fontSize="11" fill="#4A4741" textAnchor="middle">
          <text x={8 + (W - 2) / 2} y={118}>31</text>
          <text x={8 + W + 4 * W} y={118}>30 … 23</text>
          <text x={8 + 9 * W + 11.5 * W} y={118}>22 … 0</text>
        </g>
        <text x="360" y="142" textAnchor="middle" fontSize="12.5" fill="#0A0A0B">value = (−1)ˢ × 1.m × 2^(e − 127)</text>
      </svg>
    </div>
  )
}
