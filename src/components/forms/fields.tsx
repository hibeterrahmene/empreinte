import { forwardRef, useId, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertCircle, Check, Eye, EyeOff, Upload, X } from 'lucide-react'
import { cx } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

/* ---------- Enveloppe : label + aide + erreur ---------- */
interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  hint?: string
  error?: string | null
  children: ReactNode
  counter?: ReactNode
}
export function FieldShell({ id, label, required, optional, hint, error, children, counter }: FieldShellProps) {
  const { t } = useI18n()
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-sans text-[0.9375rem] font-medium text-ink">
          {label}
          {required && <span aria-hidden className="ms-0.5 text-[#B3261E]">*</span>}
          {optional && <span className="ms-2 text-[0.8125rem] font-normal text-stone-500">{t('common.optional')}</span>}
        </label>
        {counter}
      </div>
      {hint && <p id={`${id}-hint`} className="-mt-0.5 mb-2 text-[0.8125rem] leading-snug text-stone-500">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] font-medium leading-snug text-[#B3261E]">
          <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}

const controlBase =
  'w-full rounded border bg-white px-3.5 font-sans text-[1rem] text-ink placeholder:text-stone-500/80 transition-[border-color,box-shadow] duration-150 focus:border-mark-deep focus:outline-none focus:ring-2 focus:ring-mark-deep/30 disabled:bg-stone-50 disabled:text-stone-500'
const ctl = (error?: string | null) => cx(controlBase, error ? 'border-[#B3261E]' : 'border-ink/40 hover:border-ink/70')
const describe = (id: string, hint?: string, error?: string | null) => [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined

/* ---------- Champ texte ---------- */
interface TextProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  hint?: string
  error?: string | null
  icon?: ReactNode
  optional?: boolean
}
export const TextField = forwardRef<HTMLInputElement, TextProps>(function TextField({ label, hint, error, icon, optional, required, type = 'text', ...rest }, ref) {
  const id = useId()
  const { t } = useI18n()
  const [show, setShow] = useState(false)
  const isPw = type === 'password'
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error}>
      <div className="relative">
        {icon && <span aria-hidden className="pointer-events-none absolute inset-y-0 start-3.5 flex items-center text-stone-500">{icon}</span>}
        <input
          ref={ref}
          id={id}
          type={isPw && show ? 'text' : type}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describe(id, hint, error)}
          className={cx(ctl(error), 'h-12', !!icon && 'ps-11', isPw && 'pe-12')}
          {...rest}
        />
        {isPw && (
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? t('common.hidePassword') : t('common.showPassword')} aria-pressed={show} className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-stone-700 hover:text-ink">
            {show ? <EyeOff className="h-[18px] w-[18px]" aria-hidden /> : <Eye className="h-[18px] w-[18px]" aria-hidden />}
          </button>
        )}
      </div>
    </FieldShell>
  )
})

/* ---------- Zone de texte ---------- */
interface AreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string
  hint?: string
  error?: string | null
  optional?: boolean
  counter?: string
}
export function TextArea({ label, hint, error, optional, required, counter, rows = 5, ...rest }: AreaProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error} counter={counter ? <span aria-live="off" className="text-[0.8125rem] tabular-nums text-stone-500">{counter}</span> : undefined}>
      <textarea id={id} rows={rows} required={required} aria-invalid={!!error} aria-describedby={describe(id, hint, error)} className={cx(ctl(error), 'resize-y py-3 leading-relaxed')} {...rest} />
    </FieldShell>
  )
}

/* ---------- Liste déroulante ---------- */
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string
  hint?: string
  error?: string | null
  optional?: boolean
  options: { value: string; label: string }[]
  placeholder?: string
}
export function SelectField({ label, hint, error, optional, required, options, placeholder, ...rest }: SelectProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error}>
      <div className="relative">
        <select id={id} required={required} aria-invalid={!!error} aria-describedby={describe(id, hint, error)} className={cx(ctl(error), 'h-12 appearance-none pe-10')} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute end-4 top-1/2 h-2 w-3 -translate-y-1/2 text-ink"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      </div>
    </FieldShell>
  )
}

/* ---------- Case à cocher ---------- */
interface CheckProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  label: ReactNode
  error?: string | null
}
export function CheckboxField({ label, error, ...rest }: CheckProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
          <input id={id} type="checkbox" aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[2px] border border-ink/50 bg-white transition-colors checked:border-mark-deep checked:bg-mark-deep group-hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark-deep" {...rest} />
          <Check aria-hidden strokeWidth={3} className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 scale-50 text-white opacity-0 transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100" />
        </span>
        <span className="text-[0.9375rem] leading-snug text-ink">{label}</span>
      </label>
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 ps-8 text-[0.8125rem] font-medium text-[#B3261E]"><AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden />{error}</p>}
    </div>
  )
}

/* ---------- Interrupteur ---------- */
export function ToggleField({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <label htmlFor={id} className="block cursor-pointer font-sans text-[0.9375rem] font-medium text-ink">{label}</label>
        {description && <p id={`${id}-d`} className="mt-0.5 text-[0.8125rem] leading-snug text-stone-500">{description}</p>}
      </div>
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={description ? `${id}-d` : undefined} onClick={() => onChange(!checked)} className={cx('relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-200', checked ? 'border-mark-deep bg-mark-deep' : 'border-ink/40 bg-stone-200')}>
        <span aria-hidden className={cx('absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all duration-200 ease-editorial', checked ? 'start-[22px]' : 'start-0.5')} />
      </button>
    </div>
  )
}

/* ---------- Dépôt de fichier ---------- */
interface FileProps {
  label: string
  hint?: string
  error?: string | null
  file: File | null
  onChange: (f: File | null) => void
  accept: string
  required?: boolean
}
export function FileField({ label, hint, error, file, onChange, accept, required }: FileProps) {
  const id = useId()
  const { t } = useI18n()
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const size = file ? (file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`) : ''
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onChange(f) }}
        className={cx('flex flex-col items-start gap-3 rounded border border-dashed px-5 py-5 transition-colors sm:flex-row sm:items-center sm:justify-between', drag ? 'border-mark-deep bg-mark-pale' : error ? 'border-[#B3261E]' : 'border-ink/40 bg-stone-50')}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Upload className="h-5 w-5 shrink-0 text-stone-700" aria-hidden />
          {file ? (
            <p className="min-w-0 truncate text-[0.9375rem] font-medium" aria-live="polite">{file.name} <span className="font-normal text-stone-500">· {size}</span></p>
          ) : (
            <p className="text-[0.9375rem] text-stone-700">{t('contribute.dropHere')}</p>
          )}
        </div>
        <div className="flex gap-2">
          {file && <button type="button" onClick={() => { onChange(null); if (input.current) input.current.value = '' }} className="inline-flex h-9 items-center gap-1.5 rounded border border-ink/30 px-3 text-[0.8125rem] font-semibold hover:border-ink"><X className="h-3.5 w-3.5" aria-hidden />{t('common.remove')}</button>}
          <button type="button" onClick={() => input.current?.click()} className="inline-flex h-9 items-center rounded border border-ink px-3.5 text-[0.8125rem] font-semibold transition-colors hover:bg-ink hover:text-white">{file ? t('common.replace') : t('common.browse')}</button>
        </div>
        <input ref={input} id={id} type="file" accept={accept} className="sr-only" aria-invalid={!!error} aria-describedby={describe(id, hint, error)} onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      </div>
    </FieldShell>
  )
}
