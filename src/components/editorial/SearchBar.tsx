import { forwardRef, useId } from 'react'
import { Search, X } from 'lucide-react'
import { cx } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
  placeholder?: string
  size?: 'md' | 'lg'
  autoFocus?: boolean
  label?: string
}

const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar({ value, onChange, onSubmit, placeholder, size = 'md', autoFocus, label }, ref) {
  const id = useId()
  const { t } = useI18n()
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); onSubmit?.() }} className="relative">
      <label htmlFor={id} className="sr-only">{label ?? t('search.label')}</label>
      <Search aria-hidden className={cx('pointer-events-none absolute start-0 top-1/2 -translate-y-1/2 text-stone-700', size === 'lg' ? 'h-6 w-6' : 'h-5 w-5')} />
      <input
        ref={ref}
        id={id}
        type="search"
        value={value}
        data-autofocus={autoFocus ? '' : undefined}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t('search.placeholder')}
        autoComplete="off"
        className={cx('w-full border-0 border-b border-ink bg-transparent ps-9 pe-20 font-display font-medium placeholder:text-stone-500/70 focus:border-mark-deep focus:outline-none focus:ring-0 [&::-webkit-search-cancel-button]:hidden', size === 'lg' ? 'h-16 text-[1.5rem] md:text-[2rem]' : 'h-12 text-[1.125rem]')}
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label={t('search.clear')} className="absolute end-0 top-1/2 -translate-y-1/2 rounded p-2 text-stone-700 hover:bg-ink/5"><X className="h-5 w-5" aria-hidden /></button>
      )}
    </form>
  )
})
export default SearchBar
