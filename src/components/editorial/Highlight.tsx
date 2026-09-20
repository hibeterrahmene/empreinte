import { escapeRegExp, norm } from '@/lib/utils'

/** Surligne les termes de recherche (insensible aux accents et à la casse). */
export default function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens.length) return <>{text}</>
  // Compare sur la version sans accents en conservant la longueur d'origine (NFD retiré caractère par caractère).
  const plain = Array.from(text).map((c) => norm(c) || c).join('')
  const re = new RegExp(`(?<![a-z0-9])(${tokens.map(escapeRegExp).join('|')})`, 'gi')
  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(plain))) {
    if (m[0].length === 0) { re.lastIndex++; continue }
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(<mark key={m.index} className="rounded-[1px] bg-sun/70 px-0.5 text-ink">{text.slice(m.index, m.index + m[0].length)}</mark>)
    last = m.index + m[0].length
  }
  out.push(text.slice(last))
  return <>{out}</>
}
