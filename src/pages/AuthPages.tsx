import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Lock, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/lib/i18n'
import { email as vEmail, password as vPassword, required, run } from '@/lib/validation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import Button from '@/components/ui/Button'
import { CheckboxField, TextField } from '@/components/forms/fields'

const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" /><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" /><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" /><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" /></svg>
)

const Title = ({ children }: { children: React.ReactNode }) => <h1 className="t-h1 !text-[clamp(2.25rem,4.4vw,3.5rem)]">{children}</h1>

/* ------------------------------ Connexion ------------------------------ */
export function LoginPage() {
  const { t } = useI18n()
  useDocumentTitle(t('nav.login'))
  const { login } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') && params.get('next')!.startsWith('/') ? params.get('next')! : '/profile'
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState<{ email?: string; password?: string }>({})

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = { email: run(f.email, required(t('form.required')), vEmail(t('form.emailInvalid'))) ?? undefined, password: run(f.password, required(t('form.required'))) ?? undefined }
    setErr(n)
    if (n.email || n.password) return
    login(f.email.trim()); nav(next)
  }
  return (
    <>
      <Title>{t('auth.loginA')}<span className="text-mark">{t('auth.loginEm')}</span></Title>
      <p className="mt-4 text-[1rem] text-stone-700">{t('auth.loginSub')}</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <TextField label={t('form.email.label')} type="email" autoComplete="email" placeholder="e.g. name@email.com" icon={<Mail className="h-[18px] w-[18px]" />} value={f.email} error={err.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <div>
          <TextField label={t('form.password')} type="password" autoComplete="current-password" placeholder={t('auth.enterPassword')} icon={<Lock className="h-[18px] w-[18px]" />} value={f.password} error={err.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <div className="mt-2 text-end"><Link to="/forgot-password" className="link text-[0.8125rem] text-stone-700">{t('auth.forgot')}</Link></div>
        </div>
        <Button type="submit" size="lg" full className="!bg-mark-deep">{t('auth.continue')}</Button>
      </form>
      <div className="my-6 flex items-center gap-4 text-[0.75rem] font-semibold uppercase tracking-widest text-stone-500" role="separator"><span className="h-px flex-1 bg-ink/25" />{t('auth.or')}<span className="h-px flex-1 bg-ink/25" /></div>
      <Button variant="outline" size="lg" full className="!border-ink/40 !normal-case !tracking-normal !font-medium !text-ink hover:!bg-stone-50 hover:!text-ink" icon={<GoogleG />} onClick={() => { login('student@estin.dz', { firstName: 'Student', lastName: 'ESTIN' }); nav(next) }}>{t('auth.google')}</Button>
      <p className="mt-8 text-[0.9375rem] text-stone-700">{t('auth.noAccount')} <Link to="/register" className="link font-semibold text-ink">{t('auth.createOne')}</Link></p>
      <p className="mt-6 text-[0.75rem] text-stone-500">{t('auth.demoNote')}</p>
    </>
  )
}

/* ------------------------------ Inscription ------------------------------ */
export function RegisterPage() {
  const { t } = useI18n()
  useDocumentTitle(t('auth.register'))
  const { login } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', password: '', consent: false })
  const [err, setErr] = useState<Record<string, string | undefined>>({})
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [resent, setResent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const req = required(t('form.required'))
    const n = {
      firstName: run(f.firstName, req) ?? undefined,
      lastName: run(f.lastName, req) ?? undefined,
      email: run(f.email, req, vEmail(t('form.emailInvalid'))) ?? undefined,
      password: run(f.password, req, vPassword()) ?? undefined,
      consent: f.consent ? undefined : t('form.consentRequired'),
    }
    setErr(n)
    if (Object.values(n).some(Boolean)) return
    setStep('verify')
  }

  if (step === 'verify')
    return (
      <div role="status">
        <CheckCircle2 className="h-9 w-9 text-mark-deep" aria-hidden />
        <Title>{t('auth.verifyTitle')}</Title>
        <p className="mt-4 text-stone-700">{t('auth.verifyText', { email: f.email })}</p>
        <div className="mt-8 grid gap-3">
          <Button size="lg" full onClick={() => { login(f.email.trim(), { firstName: f.firstName.trim(), lastName: f.lastName.trim() }); nav('/profile') }}>{t('auth.verified')}</Button>
          <Button variant="ghost" full onClick={() => setResent(true)}>{t('auth.resend')}</Button>
        </div>
        <p className="mt-3 text-[0.8125rem] text-stone-500" aria-live="polite">{resent ? t('auth.resent') : ''}</p>
        <p className="mt-6 text-[0.75rem] text-stone-500">{t('auth.demoNote')}</p>
      </div>
    )

  return (
    <>
      <Title>{t('auth.registerTitle')}</Title>
      <p className="mt-4 text-stone-700">{t('auth.registerSub')}</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label={t('form.firstName')} autoComplete="given-name" value={f.firstName} error={err.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} />
          <TextField label={t('form.lastName')} autoComplete="family-name" value={f.lastName} error={err.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} />
        </div>
        <TextField label={t('form.email.label')} type="email" autoComplete="email" hint={t('form.emailHint')} icon={<Mail className="h-[18px] w-[18px]" />} value={f.email} error={err.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <TextField label={t('form.password')} type="password" autoComplete="new-password" hint={t('auth.passwordHint')} icon={<Lock className="h-[18px] w-[18px]" />} value={f.password} error={err.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <CheckboxField checked={f.consent} error={err.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} label={<>{t('form.consentLabel')} <Link to="/legal/privacy" className="underline">{t('legal.privacy')}</Link>.</>} />
        <Button type="submit" size="lg" full>{t('auth.createAccount')}</Button>
      </form>
      <p className="mt-8 text-[0.9375rem] text-stone-700">{t('auth.haveAccount')} <Link to="/login" className="link font-semibold text-ink">{t('nav.login')}</Link></p>
    </>
  )
}

/* ------------------------------ Mot de passe oublié ------------------------------ */
export function ForgotPasswordPage() {
  const { t } = useI18n()
  useDocumentTitle(t('auth.forgotTitle'))
  const [email, setEmail] = useState('')
  const [err, setErr] = useState<string | undefined>()
  const [sent, setSent] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const m = run(email, required(t('form.required')), vEmail(t('form.emailInvalid'))) ?? undefined
    setErr(m)
    if (!m) setSent(true)
  }
  if (sent)
    return (
      <div role="status">
        <CheckCircle2 className="h-9 w-9 text-mark-deep" aria-hidden />
        <Title>{t('auth.resetSentTitle')}</Title>
        <p className="mt-4 text-stone-700">{t('auth.resetSentText', { email })}</p>
        <div className="mt-8"><Button to="/login" variant="dark" size="lg" full>{t('auth.backToLogin')}</Button></div>
      </div>
    )
  return (
    <>
      <Title>{t('auth.forgotTitle')}</Title>
      <p className="mt-4 text-stone-700">{t('auth.forgotSub')}</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <TextField label={t('form.email.label')} type="email" autoComplete="email" icon={<Mail className="h-[18px] w-[18px]" />} value={email} error={err} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" size="lg" full>{t('auth.sendLink')}</Button>
      </form>
      <p className="mt-8"><Link to="/login" className="link text-[0.9375rem] font-semibold">← {t('auth.backToLogin')}</Link></p>
    </>
  )
}
