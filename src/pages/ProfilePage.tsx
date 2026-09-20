import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Clock, FileCheck2, FileEdit, Inbox, LogOut, XCircle } from 'lucide-react'
import type { SubmissionStatus } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/lib/i18n'
import { formatDay, cx } from '@/lib/utils'
import { email as vEmail, password as vPassword, required, run } from '@/lib/validation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import Button from '@/components/ui/Button'
import { AuthorAvatar } from '@/components/editorial/Metadata'
import { SelectField, TextArea, TextField, ToggleField } from '@/components/forms/fields'

type TabId = 'profile' | 'submissions' | 'preferences' | 'security' | 'notifications'
const TABS: TabId[] = ['profile', 'submissions', 'preferences', 'security', 'notifications']

const statusMeta: Record<SubmissionStatus, { icon: typeof Clock; cls: string }> = {
  received: { icon: Inbox, cls: 'bg-stone-200 text-ink' },
  in_review: { icon: Clock, cls: 'bg-mark-pale text-[#1F4F7A]' },
  revisions: { icon: FileEdit, cls: 'bg-sun text-ink' },
  accepted: { icon: FileCheck2, cls: 'bg-[#DDF0E2] text-[#14532D]' },
  declined: { icon: XCircle, cls: 'bg-[#F7DCD8] text-[#8C1D14]' },
}

function Saved({ show }: { show: boolean }) {
  const { t } = useI18n()
  return <p role="status" aria-live="polite" className="flex items-center gap-1.5 text-[0.875rem] font-medium text-[#14532D]">{show && <><CheckCircle2 className="h-4 w-4" aria-hidden />{t('profile.saved')}</>}</p>
}

export default function ProfilePage() {
  const { t, setLang, cat } = useI18n()
  const { user, prefs, submissions, logout, updateUser, updatePrefs } = useAuth()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  useDocumentTitle(t('nav.profile'))
  const tab = (TABS.includes(params.get('tab') as TabId) ? params.get('tab') : 'profile') as TabId
  const [form, setForm] = useState(user ?? { firstName: '', lastName: '', email: '', affiliation: '', bio: '', orcid: '' })
  const [err, setErr] = useState<Record<string, string | undefined>>({})
  const [saved, setSaved] = useState<string | null>(null)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState<Record<string, string | undefined>>({})

  if (!user) return <Navigate to="/login?next=/profile" replace />

  const flash = (k: string) => { setSaved(k); window.setTimeout(() => setSaved(null), 3000) }
  const name = `${user.firstName} ${user.lastName}`.trim()

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const req = required(t('form.required'))
    const n = { firstName: run(form.firstName, req) ?? undefined, lastName: run(form.lastName, req) ?? undefined, email: run(form.email, req, vEmail(t('form.emailInvalid'))) ?? undefined }
    setErr(n)
    if (Object.values(n).some(Boolean)) return
    updateUser(form); flash('profile')
  }
  const savePw = (e: React.FormEvent) => {
    e.preventDefault()
    const req = required(t('form.required'))
    const n = { current: run(pw.current, req) ?? undefined, next: run(pw.next, req, vPassword()) ?? undefined, confirm: pw.confirm !== pw.next ? t('profile.pwMismatch') : undefined }
    setPwErr(n)
    if (Object.values(n).some(Boolean)) return
    setPw({ current: '', next: '', confirm: '' }); flash('pw')
  }

  return (
    <div className="page pt-12 md:pt-20">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-8">
        <div className="flex items-center gap-5">
          <AuthorAvatar name={name || user.email} size={72} className="!bg-mark-pale !text-mark-deep" />
          <div>
            <h1 className="t-h1 !text-[clamp(1.875rem,3.6vw,3rem)]">{t('profile.hello', { name: user.firstName || user.email })}</h1>
            <p className="mt-1 text-stone-700">{user.email}{user.affiliation ? ` · ${user.affiliation}` : ''}</p>
          </div>
        </div>
        <Button variant="outline" icon={<LogOut className="h-4 w-4" aria-hidden />} className="!border-ink !text-ink hover:!bg-ink hover:!text-white" onClick={() => { logout(); nav('/') }}>{t('profile.logout')}</Button>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
        <nav aria-label={t('profile.sections')} className="no-scrollbar -mx-[var(--page-gutter)] overflow-x-auto px-[var(--page-gutter)] lg:m-0 lg:overflow-visible lg:p-0">
          <ul className="flex gap-1 border-b border-ink/15 lg:flex-col lg:gap-0 lg:border-b-0">
            {TABS.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => setParams({ tab: id })} aria-current={tab === id ? 'page' : undefined} className={cx('w-full whitespace-nowrap border-b-[3px] px-1 py-3 text-start font-sans text-[0.9375rem] font-medium transition-colors lg:border-b-0 lg:border-s-[3px] lg:px-4', tab === id ? 'border-mark text-ink' : 'border-transparent text-stone-500 hover:text-ink lg:border-ink/10')}>{t(`profile.tab.${id}` as 'profile.tab.profile')}</button>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="panel-h" className="max-w-2xl min-w-0">
          <h2 id="panel-h" className="t-h2 mb-8">{t(`profile.tab.${tab}` as 'profile.tab.profile')}</h2>

          {tab === 'profile' && (
            <form onSubmit={saveProfile} noValidate className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField label={t('form.firstName')} value={form.firstName} error={err.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <TextField label={t('form.lastName')} value={form.lastName} error={err.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <TextField label={t('form.email.label')} type="email" value={form.email} error={err.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <TextField label={t('form.affiliation')} value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} />
              <TextField label="ORCID" optional placeholder="0000-0000-0000-0000" value={form.orcid ?? ''} onChange={(e) => setForm({ ...form, orcid: e.target.value })} />
              <TextArea label={t('profile.bio')} optional rows={4} hint={t('profile.bioHint')} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              <div className="flex items-center gap-5"><Button type="submit">{t('profile.save')}</Button><Saved show={saved === 'profile'} /></div>
            </form>
          )}

          {tab === 'submissions' && (
            <div>
              <div className="mb-6 flex items-center justify-between gap-4"><p className="text-stone-700">{t('profile.subCount', { n: submissions.length })}</p><Button to="/contribute#submit" size="sm">{t('profile.newSubmission')}</Button></div>
              {submissions.length === 0 ? (
                <div className="border border-dashed border-ink/30 p-10 text-center"><p className="t-h4">{t('profile.noSubmissions')}</p><p className="mt-2 text-stone-700">{t('profile.noSubmissionsText')}</p><div className="mt-5"><Button to="/contribute#submit">{t('contribute.cta')}</Button></div></div>
              ) : (
                <ul className="divide-y divide-ink/15 border-y border-ink/15">
                  {submissions.map((s) => {
                    const m = statusMeta[s.status]
                    return (
                      <li key={s.id} className="py-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="t-h4 max-w-[38ch] md:text-[1.1875rem]">{s.title}</h3>
                          <span className={cx('inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-sans text-[0.8125rem] font-semibold', m.cls)}><m.icon className="h-3.5 w-3.5" aria-hidden />{t(`status.${s.status}` as 'status.received')}</span>
                        </div>
                        <p className="mt-2 font-sans text-[0.8125rem] text-stone-500">{s.id} · {cat(s.category)} · {formatDay(s.submittedAt)}</p>
                        {s.note && <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-stone-700">{s.note}</p>}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}

          {tab === 'preferences' && (
            <div className="space-y-2">
              <SelectField label={t('nav.language')} value={prefs.language} onChange={(e) => { const l = e.target.value as 'en' | 'fr' | 'ar'; updatePrefs({ language: l }); setLang(l); flash('prefs') }} options={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }, { value: 'ar', label: 'العربية' }]} />
              <div className="divide-y divide-ink/15 border-y border-ink/15">
                <ToggleField label={t('profile.reduceMotion')} description={t('profile.reduceMotionText')} checked={prefs.reduceMotion} onChange={(v) => { updatePrefs({ reduceMotion: v }); document.documentElement.dataset.reduceMotion = String(v); flash('prefs') }} />
              </div>
              <div className="pt-3"><Saved show={saved === 'prefs'} /></div>
            </div>
          )}

          {tab === 'security' && (
            <form onSubmit={savePw} noValidate className="space-y-6">
              <TextField label={t('profile.pwCurrent')} type="password" autoComplete="current-password" value={pw.current} error={pwErr.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
              <TextField label={t('profile.pwNew')} type="password" autoComplete="new-password" hint={t('auth.passwordHint')} value={pw.next} error={pwErr.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
              <TextField label={t('profile.pwConfirm')} type="password" autoComplete="new-password" value={pw.confirm} error={pwErr.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
              <div className="flex items-center gap-5"><Button type="submit">{t('profile.pwSave')}</Button><Saved show={saved === 'pw'} /></div>
              <p className="flex items-start gap-2 text-[0.8125rem] text-stone-500"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{t('auth.demoNote')}</p>
            </form>
          )}

          {tab === 'notifications' && (
            <div>
              <div className="divide-y divide-ink/15 border-y border-ink/15">
                <ToggleField label={t('profile.n.newIssue')} description={t('profile.n.newIssueText')} checked={prefs.newIssue} onChange={(v) => { updatePrefs({ newIssue: v }); flash('n') }} />
                <ToggleField label={t('profile.n.submissions')} description={t('profile.n.submissionsText')} checked={prefs.submissionUpdates} onChange={(v) => { updatePrefs({ submissionUpdates: v }); flash('n') }} />
                <ToggleField label={t('profile.n.digest')} description={t('profile.n.digestText')} checked={prefs.digest} onChange={(v) => { updatePrefs({ digest: v }); flash('n') }} />
                <ToggleField label={t('profile.n.comments')} description={t('profile.n.commentsText')} checked={prefs.comments} onChange={(v) => { updatePrefs({ comments: v }); flash('n') }} />
              </div>
              <div className="pt-4"><Saved show={saved === 'n'} /></div>
            </div>
          )}
        </section>
      </div>
      <p className="mt-16 text-[0.8125rem] text-stone-500"><Link to="/" className="link">← {t('auth.backToSite')}</Link></p>
    </div>
  )
}
