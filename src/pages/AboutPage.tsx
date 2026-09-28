import { useState } from 'react'
import { CheckCircle2, Mail, MapPin } from 'lucide-react'
import { editorialTeam, missionGoals, siteConfig } from '@/data/siteConfig'
import { img } from '@/data/images'
import { useI18n } from '@/lib/i18n'
import { email as vEmail, minLength, required, run } from '@/lib/validation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { SelectField, TextArea, TextField } from '@/components/forms/fields'
import estinColor from '@/assets/logos/estin-color.png'

export default function AboutPage() {
  const { t } = useI18n()
  useDocumentTitle(t('nav.about'))
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' })
  const [err, setErr] = useState<Record<string, string | undefined>>({})
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const req = required(t('form.required'))
    const n = { name: run(f.name, req) ?? undefined, email: run(f.email, req, vEmail(t('form.emailInvalid'))) ?? undefined, subject: run(f.subject, required(t('form.chooseOne'))) ?? undefined, message: run(f.message, req, minLength(20, t('about.messageShort'))) ?? undefined }
    setErr(n)
    if (!Object.values(n).some(Boolean)) setSent(true)
  }


  return (
    <>
      <header className="page pt-12 md:pt-20">
        <div className="grid gap-8 border-b border-ink pb-10 lg:grid-cols-12 md:pb-14">
          <h1 className="t-display lg:col-span-7">{t('about.title')}</h1>
          <p className="t-lede max-w-[38ch] self-end text-stone-700 lg:col-span-5">{t('about.lede')}</p>
        </div>
        <div className="mt-10 overflow-hidden"><img src={img.photoWindows} alt={t('about.heroAlt')} width={1070} height={410} className="aspect-[16/9] w-full object-cover md:aspect-[5/2]" /></div>
      </header>

      <section aria-labelledby="mission-h" className="page mt-20 grid gap-8 md:mt-28 lg:grid-cols-12 lg:gap-16">
        <h2 id="mission-h" className="t-h3 lg:col-span-4">{t('about.mission')}</h2>
        <div className="space-y-5 lg:col-span-7">
          <p className="t-lede">{t('about.missionA')}</p>
          <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink/85">{t('about.missionB')}</p>
          <ol className="mt-2 space-y-3">
            {missionGoals.map((g, i) => (
              <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink/85">
                <span aria-hidden className="mt-0.5 shrink-0 font-display font-semibold text-mark-deep">{i + 1}.</span>
                <span className="max-w-[58ch]">{g}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="name-h" className="page mt-20 grid gap-8 border-t border-ink/15 pt-10 md:mt-28 lg:grid-cols-12 lg:gap-16">
        <h2 id="name-h" className="t-h3 lg:col-span-4">{t('about.name')}</h2>
        <div className="space-y-4 lg:col-span-7">
          <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink/85">{t('about.nameText')}</p>
        </div>
      </section>

      <section aria-labelledby="estin-h" className="mt-24 bg-cream py-16 md:mt-32 md:py-24">
        <div className="page grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <img src={estinColor} alt="ESTIN" width={703} height={254} loading="lazy" className="h-12 w-auto md:h-14" />
            <h2 id="estin-h" className="t-h2 mt-8">{siteConfig.university.fullName}</h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-ink/80">{t('about.estinText')}</p>
            <p className="mt-6 flex items-center gap-2 font-sans text-[0.875rem] text-stone-700"><MapPin className="h-4 w-4" aria-hidden />{siteConfig.university.city}, {siteConfig.university.country}</p>
            <div className="mt-6"><Button href={siteConfig.university.url} external variant="dark" arrow>{t('about.estinLink')}<span className="sr-only"> ({t('common.newTab')})</span></Button></div>
          </div>
          <div className="lg:col-span-7"><img src={img.campusReal} alt={t('home.uniAlt')} width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full object-cover" /></div>
        </div>
      </section>

      <section id="team" aria-labelledby="team-h" className="page mt-24 md:mt-32">
        <h2 id="team-h" className="t-h2 border-t border-ink pt-8">{t('about.team')}</h2>
        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h3 className="t-label mb-2 text-stone-700">{t('about.chiefEditors')}</h3>
            <ul className="divide-y divide-ink/15 border-y border-ink/15">
              {editorialTeam.chiefEditors.map((name) => <li key={name} className="py-4 t-h4">{name}</li>)}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <h3 className="t-label mb-2 text-stone-700">{t('about.reviewCommittee')}</h3>
            <ul className="grid grid-cols-1 divide-y divide-ink/15 border-y border-ink/15 sm:grid-cols-2 sm:divide-y-0">
              {editorialTeam.reviewCommittee.map((name) => <li key={name} className="border-b border-ink/15 py-2.5 text-[0.9375rem] sm:border-b-0 sm:py-1.5">{name}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-h" className="page mt-24 md:mt-32">
        <div className="grid gap-12 border-t border-ink pt-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="contact-h" className="t-h2">{t('about.contact')}</h2>
            <p className="mt-4 max-w-[34ch] text-stone-700">{t('about.contactText')}</p>
            <ul className="mt-8 space-y-4 text-[0.9375rem]">
              <li className="flex items-start gap-3"><Mail className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden /><a className="link" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden /><address className="not-italic">{siteConfig.contact.address.map((l) => <span key={l} className="block">{l}</span>)}</address></li>
            </ul>
          </div>
          <div className="lg:col-span-8">
            {sent ? (
              <div role="status" className="border border-ink/15 p-8 md:p-12"><CheckCircle2 className="h-9 w-9 text-mark-deep" aria-hidden /><h3 className="t-h2 mt-5">{t('about.sentTitle')}</h3><p className="mt-3 max-w-[50ch] text-stone-700">{t('about.sentText', { email: f.email })}</p><div className="mt-6"><Button variant="outline" onClick={() => { setSent(false); setF({ name: '', email: '', subject: '', message: '' }) }}>{t('about.another')}</Button></div></div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <TextField label={t('about.yourName')} required autoComplete="name" value={f.name} error={err.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                  <TextField label={t('form.email.label')} type="email" required autoComplete="email" value={f.email} error={err.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
                </div>
                <SelectField label={t('about.subject')} required placeholder={t('form.choose')} value={f.subject} error={err.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} options={[{ value: 'general', label: t('about.subj.general') }, { value: 'submission', label: t('about.subj.submission') }, { value: 'press', label: t('about.subj.press') }, { value: 'tech', label: t('about.subj.tech') }]} />
                <TextArea label={t('about.message')} required rows={6} value={f.message} error={err.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
                <Button type="submit" size="lg">{t('about.send')}</Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
