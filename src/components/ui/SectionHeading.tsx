import { Link } from 'react-router-dom'
import { Arrow } from './Button'

interface Props { title: string; id?: string; to?: string; action?: string; children?: React.ReactNode }

/** Titre de section façon maquette : capitales Figtree + filet fin. */
export default function SectionHeading({ title, id, to, action, children }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-ink/20 pb-3 md:mb-10">
      <h2 id={id} className="font-sans text-[1.0625rem] font-bold uppercase tracking-[0.12em] text-stone-700 md:text-[1.25rem] rtl:tracking-normal">{title}</h2>
      <div className="flex items-center gap-6">
        {children}
        {to && action && (
          <Link to={to} className="group inline-flex items-center gap-1.5 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink rtl:tracking-normal">
            <span className="link">{action}</span>
            <Arrow />
          </Link>
        )}
      </div>
    </div>
  )
}
