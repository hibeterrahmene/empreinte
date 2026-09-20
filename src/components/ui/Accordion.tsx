import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { cx } from '@/lib/utils'

export interface AccordionItem { q: string; a: string }

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <div className="border-t border-ink">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q} className="border-b border-ink/15">
            <h3>
              <button type="button" id={`${base}-b${i}`} aria-expanded={isOpen} aria-controls={`${base}-p${i}`} onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-6 py-5 text-start">
                <span className="t-h4 md:text-[1.1875rem]">{it.q}</span>
                <Plus aria-hidden className={cx('h-5 w-5 shrink-0 transition-transform duration-300 ease-editorial', isOpen && 'rotate-45')} />
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} className={cx('grid transition-[grid-template-rows] duration-300 ease-editorial', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <p className="max-w-read pb-6 text-[1rem] leading-relaxed text-stone-700">{it.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
