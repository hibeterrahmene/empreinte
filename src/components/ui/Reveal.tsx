import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cx } from '@/lib/utils'

/** Apparition progressive discrète. `delay` en ms pour échelonner une grille. */
export default function Reveal({ as: Tag = 'div', delay = 0, className, children }: { as?: ElementType; delay?: number; className?: string; children: ReactNode }) {
  const ref = useReveal<HTMLElement>()
  return <Tag ref={ref} className={cx('reveal', className)} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>{children}</Tag>
}
