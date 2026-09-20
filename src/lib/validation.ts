export type Validator = (value: string) => string | null

export const required = (msg = 'This field is required.'): Validator => (v) => (v.trim() ? null : msg)
export const email = (msg = 'Enter a valid email address, for example name@estin.dz.'): Validator => (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : msg
export const minLength = (n: number, msg?: string): Validator => (v) =>
  v.trim().length >= n ? null : msg ?? `Use at least ${n} characters.`
export const maxWords = (n: number, msg?: string): Validator => (v) =>
  (v.trim() ? v.trim().split(/\s+/).length : 0) <= n ? null : msg ?? `Keep it under ${n} words.`
export const minWords = (n: number, msg?: string): Validator => (v) =>
  (v.trim() ? v.trim().split(/\s+/).length : 0) >= n ? null : msg ?? `Write at least ${n} words.`
export const password = (): Validator => (v) => {
  if (v.length < 8) return 'Use at least 8 characters.'
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Mix letters and at least one number.'
  return null
}

export function run(value: string, ...rules: Validator[]) {
  for (const r of rules) {
    const e = r(value)
    if (e) return e
  }
  return null
}

export const wordCount = (v: string) => (v.trim() ? v.trim().split(/\s+/).length : 0)
