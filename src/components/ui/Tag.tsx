import { Link } from 'react-router-dom'
import { cx } from '@/lib/utils'

const base = 'inline-block bg-sun px-2.5 py-1 font-sans text-[0.6875rem] font-bold uppercase leading-none tracking-[0.08em] text-ink rtl:tracking-normal'

export default function Tag({ children, to, className }: { children: React.ReactNode; to?: string; className?: string }) {
  if (to) return <Link to={to} className={cx(base, 'transition-colors hover:bg-ink hover:text-sun', className)}>{children}</Link>
  return <span className={cx(base, className)}>{children}</span>
}

export function Chip({ children, active, onClick, className }: { children: React.ReactNode; active?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cx('rounded border px-3 py-1.5 font-sans text-[0.8125rem] font-medium transition-colors duration-200', active ? 'border-ink bg-ink text-white' : 'border-ink/25 bg-transparent text-ink hover:border-ink', className)}>
      {children}
    </button>
  )
}
