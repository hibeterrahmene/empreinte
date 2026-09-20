/**
 * Authentification SIMULÉE (localStorage). À remplacer par l'API :
 * inscription, connexion par e-mail institutionnel (@estin.dz), sessions, etc.
 */
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import type { Submission, UserPrefs, UserProfile } from '@/types'
import { useLocalStorage } from './useLocalStorage'

const seedSubmissions: Submission[] = [
  { id: 'SUB-2026-014', title: 'Edge inference on a microcontroller: a first attempt', category: 'iot', submittedAt: '2026-08-21', status: 'in_review', note: 'Assigned to two reviewers. A first decision is expected within three weeks.' },
  { id: 'SUB-2026-009', title: 'Why our timetable app needed a rewrite', category: 'technology', submittedAt: '2026-06-30', status: 'revisions', note: 'The reviewers ask for a clearer problem statement and two references for the performance claims.' },
  { id: 'SUB-2025-021', title: 'Notes on a first hackathon', category: 'startups', submittedAt: '2025-11-02', status: 'accepted', note: 'Accepted for the next issue. Copy-editing will start soon.' },
]

const defaultPrefs: UserPrefs = { language: 'en', digest: true, newIssue: true, submissionUpdates: true, comments: false, reduceMotion: false }

interface AuthState {
  user: UserProfile | null
  prefs: UserPrefs
  submissions: Submission[]
  login: (email: string, name?: { firstName: string; lastName: string }) => void
  logout: () => void
  updateUser: (u: Partial<UserProfile>) => void
  updatePrefs: (p: Partial<UserPrefs>) => void
  addSubmission: (s: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => Submission
}

const Ctx = createContext<AuthState | null>(null)

const nameFromEmail = (email: string) => {
  const local = email.split('@')[0] ?? 'reader'
  const parts = local.split(/[._-]+/).filter(Boolean)
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  return { firstName: cap(parts[0] ?? 'Reader'), lastName: cap(parts[1] ?? '') }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<UserProfile | null>('lempreinte.user', null)
  const [prefs, setPrefs] = useLocalStorage<UserPrefs>('lempreinte.prefs', defaultPrefs)
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>('lempreinte.submissions', seedSubmissions)

  const login = useCallback((email: string, name?: { firstName: string; lastName: string }) => {
    const n = name ?? nameFromEmail(email)
    setUser((prev) => prev && prev.email === email ? prev : { ...n, email, affiliation: email.endsWith('@estin.dz') ? 'ESTIN' : '', bio: '' })
  }, [setUser])
  const logout = useCallback(() => setUser(null), [setUser])
  const updateUser = useCallback((u: Partial<UserProfile>) => setUser((p) => (p ? { ...p, ...u } : p)), [setUser])
  const updatePrefs = useCallback((p: Partial<UserPrefs>) => setPrefs((prev) => ({ ...prev, ...p })), [setPrefs])
  const addSubmission = useCallback((s: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => {
    const sub: Submission = { ...s, id: `SUB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`, submittedAt: new Date().toISOString().slice(0, 10), status: 'received', note: 'We have received your submission and will confirm by email.' }
    setSubmissions((prev) => [sub, ...prev])
    return sub
  }, [setSubmissions])

  const value = useMemo(() => ({ user, prefs, submissions, login, logout, updateUser, updatePrefs, addSubmission }), [user, prefs, submissions, login, logout, updateUser, updatePrefs, addSubmission])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth must be used inside <AuthProvider>')
  return c
}
