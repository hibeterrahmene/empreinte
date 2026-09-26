import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { repo } from '@/data/repository'
import { siteConfig } from '@/data/siteConfig'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/lib/i18n'
import { email as vEmail, maxWords, minWords, required, run, wordCount } from '@/lib/validation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import Accordion from '@/components/ui/Accordion'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { CheckboxField, FileField, SelectField, TextArea, TextField } from '@/components/forms/fields'
import { img } from '@/data/images'

interface Values {
  firstName: string; lastName: string; email: string; studyLevel: string
  title: string; abstract: string; keywords: string; category: string; type: string; language: string
  comments: string; consent: boolean; originality: boolean
}
type Errors = Partial<Record<keyof Values | 'file' | 'coauthors', string>>
const empty: Values = { firstName: '', lastName: '', email: '', studyLevel: '', title: '', abstract: '', keywords: '', category: '', type: '', language: 'en', comments: '', consent: false, originality: false }
const STUDY_LEVELS = ['1CP', '2CP', '1CS', '2CS-CS', '2CS-AI', '3CS-CS', '3CS-AI']
const MAX_MB = 10
const ACCEPT = '.doc,.docx,.tex,.pdf,.odt'
const ORDER: (keyof Values | 'file' | 'coauthors')[] = ['firstName', 'lastName', 'email', 'studyLevel', 'title', 'type', 'category', 'language', 'abstract', 'keywords', 'coauthors', 'file', 'originality', 'consent']

export default function ContributePage() {
  const { t, cat } = useI18n()
  const { user, addSubmission } = useAuth()
  useDocumentTitle(t('nav.contribute'))
  const [v, setV] = useState<Values>({ ...empty, firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '' })
  const [file, setFile] = useState<File | null>(null)
  const [co, setCo] = useState<{ name: string; email: string }[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ id: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const summary = useRef<HTMLDivElement>(null)
  const sentRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((p) => ({ ...p, [k]: val }))

  const validate = (): Errors => {
    const e: Errors = {}
    const req = required(t('form.required'))
    e.firstName = run(v.firstName, req) ?? undefined
    e.lastName = run(v.lastName, req) ?? undefined
    e.email = run(v.email, req, vEmail(t('form.emailInvalid'))) ?? undefined
    e.studyLevel = run(v.studyLevel, required(t('form.chooseOne'))) ?? undefined
    e.title = run(v.title, req, (s) => (s.trim().length < 8 ? t('form.titleShort') : null)) ?? undefined
    e.type = run(v.type, required(t('form.chooseOne'))) ?? undefined
    e.category = run(v.category, required(t('form.chooseOne'))) ?? undefined
    e.abstract = run(v.abstract, req, minWords(40, t('form.abstractMin')), maxWords(170, t('form.abstractMax'))) ?? undefined
    const kws = v.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    e.keywords = kws.length !== 5 ? t('form.keywordsRange') : undefined
    if (!file) e.file = t('form.fileRequired')
    else if (!/\.(docx?|pdf|odt)$/i.test(file.name)) e.file = t('form.fileType')
    else if (file.size > MAX_MB * 1024 * 1024) e.file = t('form.fileSize', { n: MAX_MB })
    if (co.some((c) => !c.name.trim() || vEmail()(c.email))) e.coauthors = t('form.coauthorsInvalid')
    if (!v.originality) e.originality = t('form.originality')
    if (!v.consent) e.consent = t('form.consentRequired')
    Object.keys(e).forEach((k) => e[k as keyof Errors] === undefined && delete e[k as keyof Errors])
    return e
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) { window.setTimeout(() => summary.current?.focus(), 30); return }
    setBusy(true)
    window.setTimeout(() => {
      const s = addSubmission({ title: v.title.trim(), category: v.category })
      setSent({ id: s.id }); setBusy(false)
      window.setTimeout(() => sentRef.current?.focus(), 30)
    }, 700)
  }

  useEffect(() => { if (sent) sentRef.current?.scrollIntoView({ block: 'center' }) }, [sent])

  const blur = (k: keyof Values) => () => {
    const e = validate()
    setErrors((p) => { const n = { ...p }; if (e[k]) n[k] = e[k]; else delete n[k]; return n })
  }

  const steps = [
    { title: t('contribute.s1'), text: t('contribute.s1t'), time: t('contribute.s1d') },
    { title: t('contribute.s2'), text: t('contribute.s2t'), time: t('contribute.s2d') },
    { title: t('contribute.s3'), text: t('contribute.s3t'), time: t('contribute.s3d') },
    { title: t('contribute.s4'), text: t('contribute.s4t'), time: t('contribute.s4d') },
    { title: t('contribute.s5'), text: t('contribute.s5t'), time: t('contribute.s5d') },
  ]
  const types = [
    { id: 'essay', label: t('contribute.type.essay'), words: '500 – 2,000' },
    { id: 'technical', label: t('contribute.type.technical'), words: '500 – 2,000' },
    { id: 'interview', label: t('contribute.type.interview'), words: '500 – 2,000' },
    { id: 'opinion', label: t('contribute.type.opinion'), words: '500 – 2,000' },
    { id: 'research', label: t('contribute.type.research'), words: '500 – 2,000' },
  ]
  const faq = [1, 2, 3, 4, 5].map((n) => ({ q: t(`contribute.faq${n}q` as 'contribute.faq1q'), a: t(`contribute.faq${n}a` as 'contribute.faq1a') }))
  const errList = ORDER.filter((k) => errors[k])
  const idOf = (k: string) => document.querySelector<HTMLElement>(`[name="${k}"]`)

  return (
    <>
      <header className="page grid items-end gap-8 pt-12 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="t-display">{t('contribute.title')}</h1>
          <p className="t-lede mt-6 max-w-[42ch] text-stone-700">{t('contribute.intro')}</p>
          <blockquote className="mt-6 max-w-[42ch] border-s-2 border-mark ps-4">
            <p className="font-display text-[1.0625rem] italic leading-snug text-ink/85">{t('contribute.herzogQuote')}</p>
            <footer className="mt-1.5 font-sans text-[0.8125rem] text-stone-500">— Maurice Herzog</footer>
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-3"><Button href="#submit" size="lg" arrow>{t('contribute.cta')}</Button><Button href="#guidelines" variant="outline" size="lg" className="!border-ink !text-ink hover:!bg-ink hover:!text-white">{t('contribute.guidelinesLink')}</Button></div>
        </div>
        <div className="hidden overflow-hidden lg:col-span-5 lg:block"><img src={img.photoWindows} alt="" className="aspect-[4/3] w-full object-cover" /></div>
      </header>

      {/* Processus : une vraie séquence, donc numérotée */}
      <section aria-labelledby="process-h" className="page mt-20 md:mt-32">
        <h2 id="process-h" className="t-h2 border-t border-ink pt-8">{t('contribute.process')}</h2>
        <ol className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 70} className="relative border-t border-ink/25 pt-5">
              <span className="absolute -top-px start-0 h-[3px] w-10 bg-mark" aria-hidden />
              <p className="font-sans text-[0.8125rem] tabular-nums text-stone-500">{i + 1} / 5</p>
              <h3 className="t-h4 mt-2">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-snug text-stone-700">{s.text}</p>
              <p className="mt-3 font-sans text-[0.8125rem] font-semibold text-mark-deep">{s.time}</p>
            </Reveal>
          ))}
        </ol>
        <p className="mt-6 text-[0.8125rem] text-stone-500">{t('contribute.timelineNote')}</p>
      </section>

      {/* Directives */}
      <section id="guidelines" aria-labelledby="guide-h" className="page mt-20 md:mt-32">
        <h2 id="guide-h" className="t-h2 border-t border-ink pt-8">{t('contribute.guidelines')}</h2>
        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h3 className="t-h3">{t('contribute.types')}</h3>
            <div className="mt-5 overflow-x-auto"><table className="tbl w-full min-w-[420px]"><thead><tr><th scope="col">{t('contribute.typeCol')}</th><th scope="col">{t('contribute.lengthCol')}</th></tr></thead><tbody>{types.map((r) => <tr key={r.id}><th scope="row" className="!border-b !border-ink/15 !py-3 !pe-4 !text-[0.9375rem] !font-semibold !normal-case !tracking-normal">{r.label}</th><td>{r.words} {t('contribute.words')}</td></tr>)}</tbody></table></div>
          </div>
          <div className="space-y-10 lg:col-span-5">
            <div><h3 className="t-h4">{t('contribute.format')}</h3><p className="mt-2 text-[0.9375rem] leading-relaxed text-stone-700">{t('contribute.formatText', { n: MAX_MB })}</p></div>
            <div><h3 className="t-h4">{t('contribute.citing')}</h3><p className="mt-2 text-[0.9375rem] leading-relaxed text-stone-700">{t('contribute.citingText')}</p></div>
            <div><h3 className="t-h4">{t('contribute.evaluation')}</h3><p className="mt-2 text-[0.9375rem] leading-relaxed text-stone-700">{t('contribute.evaluationText')}</p></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-h" className="page mt-20 md:mt-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 id="faq-h" className="t-h2 lg:col-span-4">{t('contribute.faq')}</h2>
          <div className="lg:col-span-8"><Accordion items={faq} /></div>
        </div>
      </section>

      {/* Formulaire */}
      <section id="submit" aria-labelledby="form-h" className="mt-24 bg-stone-50 py-16 md:mt-36 md:py-24">
        <div className="page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="form-h" className="t-h1 !text-[clamp(2rem,3.6vw,3rem)]">{t('contribute.formTitle')}</h2>
            <p className="mt-4 max-w-[36ch] text-stone-700">{t('contribute.formIntro')}</p>
            <p className="mt-6 text-[0.875rem] text-stone-700">{t('contribute.questions')} <a className="link font-medium text-ink" href={`mailto:${siteConfig.contact.submissions}`}>{siteConfig.contact.submissions}</a></p>
            {!user && <p className="mt-3 text-[0.875rem] text-stone-700"><Link className="link font-medium text-ink" to="/login?next=/contribute">{t('nav.login')}</Link> {t('contribute.loginHint')}</p>}
            <p className="mt-3 text-[0.875rem] text-stone-700">{t('contribute.googleFormHint')} <a className="link font-medium text-ink" href={siteConfig.googleFormUrl} target="_blank" rel="noopener noreferrer">Google Forms<span className="sr-only"> ({t('common.newTab')})</span></a></p>
          </div>

          <div className="lg:col-span-8">
            {sent ? (
              <div ref={sentRef} tabIndex={-1} role="status" className="border border-ink/15 bg-white p-8 outline-none md:p-12">
                <CheckCircle2 className="h-9 w-9 text-mark-deep" aria-hidden />
                <h3 className="t-h2 mt-5">{t('contribute.sentTitle')}</h3>
                <p className="mt-3 max-w-[52ch] text-stone-700">{t('contribute.sentText', { email: v.email })}</p>
                <p className="mt-5 font-sans text-[0.9375rem]">{t('contribute.reference')} <strong className="font-semibold tabular-nums">{sent.id}</strong></p>
                <div className="mt-8 flex flex-wrap gap-3"><Button to="/profile?tab=submissions" variant="dark">{t('contribute.viewSubmissions')}</Button><Button variant="outline" onClick={() => { setSent(null); setV({ ...empty, firstName: v.firstName, lastName: v.lastName, email: v.email }); setFile(null); setCo([]); setErrors({}) }}>{t('contribute.another')}</Button></div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-12 border border-ink/15 bg-white p-6 md:p-10">
                {errList.length > 0 && (
                  <div ref={summary} tabIndex={-1} role="alert" className="border-s-4 border-[#B3261E] bg-[#FDF1EF] p-5 outline-none">
                    <p className="font-semibold text-[#B3261E]">{t('form.fixErrors', { n: errList.length })}</p>
                    <ul className="mt-2 list-disc ps-5 text-[0.9375rem]">{errList.map((k) => <li key={k}><a href={`#${k}`} onClick={(e) => { e.preventDefault(); idOf(k)?.focus() }} className="underline">{errors[k]}</a></li>)}</ul>
                  </div>
                )}

                <fieldset className="space-y-6">
                  <legend className="t-h3 mb-6">{t('contribute.f.author')}</legend>
                  <div className="grid gap-6 md:grid-cols-2">
                    <TextField name="firstName" label={t('form.firstName')} required autoComplete="given-name" value={v.firstName} error={errors.firstName} onChange={(e) => set('firstName', e.target.value)} onBlur={blur('firstName')} />
                    <TextField name="lastName" label={t('form.lastName')} required autoComplete="family-name" value={v.lastName} error={errors.lastName} onChange={(e) => set('lastName', e.target.value)} onBlur={blur('lastName')} />
                  </div>
                  <TextField name="email" type="email" label={t('form.email.label')} required autoComplete="email" hint={t('form.emailHint')} value={v.email} error={errors.email} onChange={(e) => set('email', e.target.value)} onBlur={blur('email')} />
                  <SelectField name="studyLevel" label={t('form.studyLevel')} required placeholder={t('form.choose')} hint={t('form.studyLevelHint')} value={v.studyLevel} error={errors.studyLevel} onChange={(e) => set('studyLevel', e.target.value)} options={STUDY_LEVELS.map((lv) => ({ value: lv, label: lv }))} />

                  <div>
                    <p className="mb-2 font-sans text-[0.9375rem] font-medium">{t('contribute.coauthors')} <span className="ms-1 text-[0.8125rem] font-normal text-stone-500">{t('common.optional')}</span></p>
                    {co.map((c, i) => (
                      <div key={i} className="mb-3 grid grid-cols-[1fr_auto] items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
                        <TextField label={t('form.coauthorName')} value={c.name} onChange={(e) => setCo((p) => p.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                        <TextField label={t('form.email.label')} type="email" value={c.email} onChange={(e) => setCo((p) => p.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))} />
                        <button type="button" onClick={() => setCo((p) => p.filter((_, j) => j !== i))} aria-label={t('common.remove')} className="mb-1 flex h-11 w-11 items-center justify-center rounded border border-ink/25 hover:border-ink"><Trash2 className="h-4 w-4" aria-hidden /></button>
                      </div>
                    ))}
                    {errors.coauthors && <p role="alert" id="coauthors" className="mb-3 text-[0.8125rem] font-medium text-[#B3261E]">{errors.coauthors}</p>}
                    {co.length < 5 && <Button variant="ghost" size="sm" icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => setCo((p) => [...p, { name: '', email: '' }])} className="-ms-3">{t('contribute.addCoauthor')}</Button>}
                  </div>
                </fieldset>

                <fieldset className="space-y-6">
                  <legend className="t-h3 mb-6">{t('contribute.f.article')}</legend>
                  <TextField name="title" label={t('form.articleTitle')} required value={v.title} error={errors.title} onChange={(e) => set('title', e.target.value)} onBlur={blur('title')} />
                  <div className="grid gap-6 md:grid-cols-3">
                    <SelectField name="type" label={t('contribute.typeCol')} required placeholder={t('form.choose')} value={v.type} error={errors.type} onChange={(e) => set('type', e.target.value)} options={types.map((x) => ({ value: x.id, label: x.label }))} />
                    <SelectField name="category" label={t('form.category')} required placeholder={t('form.choose')} value={v.category} error={errors.category} onChange={(e) => set('category', e.target.value)} options={repo.categories().map((c) => ({ value: c.slug, label: cat(c.slug) }))} />
                    <SelectField name="language" label={t('form.language')} required value={v.language} onChange={(e) => set('language', e.target.value)} options={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }, { value: 'ar', label: 'العربية' }, { value: 'tzm', label: 'Tamazight' }]} />
                  </div>
                  <TextArea name="abstract" label={t('form.abstract')} required rows={7} hint={t('form.abstractHint')} counter={t('form.abstractCounter', { n: wordCount(v.abstract) })} value={v.abstract} error={errors.abstract} onChange={(e) => set('abstract', e.target.value)} onBlur={blur('abstract')} />
                  <TextField name="keywords" label={t('form.keywords')} required hint={t('form.keywordsHint')} value={v.keywords} error={errors.keywords} onChange={(e) => set('keywords', e.target.value)} onBlur={blur('keywords')} />
                  <FileField label={t('form.file')} required accept={ACCEPT} hint={t('form.fileHint', { n: MAX_MB })} file={file} error={errors.file} onChange={(f) => { setFile(f); if (f) setErrors((p) => { const n = { ...p }; delete n.file; return n }) }} />
                  <TextArea name="comments" label={t('form.comments')} optional rows={4} value={v.comments} onChange={(e) => set('comments', e.target.value)} />
                </fieldset>

                <fieldset className="space-y-5">
                  <legend className="t-h3 mb-6">{t('contribute.f.consent')}</legend>
                  <CheckboxField name="originality" checked={v.originality} error={errors.originality} onChange={(e) => set('originality', e.target.checked)} label={t('form.originalityLabel')} />
                  <CheckboxField name="consent" checked={v.consent} error={errors.consent} onChange={(e) => set('consent', e.target.checked)} label={<>{t('form.consentLabel')} <Link to="/legal/privacy" className="underline">{t('legal.privacy')}</Link>.</>} />
                </fieldset>

                <div className="flex flex-wrap items-center gap-4 border-t border-ink/15 pt-8">
                  <Button type="submit" size="lg" disabled={busy}>{busy ? t('form.sending') : t('contribute.submit')}</Button>
                  <p className="text-[0.8125rem] text-stone-500">{t('form.requiredNote')}</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
