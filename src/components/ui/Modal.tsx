import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cx } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** 'top' : panneau ancré en haut (recherche) — 'center' : boîte de dialogue */
  variant?: 'center' | 'top'
  hideTitle?: boolean
  className?: string
}

export default function Modal({ open, onClose, title, children, variant = 'center', hideTitle, className }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFirst = () => {
      const el = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE)
      el?.focus()
    }
    const id = window.setTimeout(focusFirst, 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      if (e.key === 'Tab' && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null)
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(id)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className={cx('fixed inset-0 z-[100] flex', variant === 'top' ? 'items-start justify-center pt-0' : 'items-center justify-center p-4')}>
      <div className="scrim-in absolute inset-0 bg-night/60" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx('sheet-in relative w-full bg-white', variant === 'top' ? 'max-h-[100dvh] overflow-y-auto border-b border-ink/15' : 'max-h-[90dvh] max-w-xl overflow-y-auto rounded-lg p-6 md:p-8', className)}
      >
        {(!hideTitle || variant === 'center') && (
          <div className="mb-5 flex items-start justify-between gap-6">
            <h2 className={cx('t-h3', hideTitle && 'sr-only')}>{title}</h2>
            <button type="button" onClick={onClose} aria-label={t('common.close')} className="-m-2 rounded p-2 text-ink transition-colors hover:bg-ink/5">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
