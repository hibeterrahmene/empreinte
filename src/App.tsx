import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AuthLayout from '@/components/layout/AuthLayout'
import HomePage from '@/pages/HomePage'
import IssuesPage from '@/pages/IssuesPage'
import IssuePage from '@/pages/IssuePage'
import SearchPage from '@/pages/SearchPage'
import TopicsPage from '@/pages/TopicsPage'
import ArticlePage from '@/pages/ArticlePage'
import ContributePage from '@/pages/ContributePage'
import ProfilePage from '@/pages/ProfilePage'
import AboutPage from '@/pages/AboutPage'
import LegalPage from '@/pages/LegalPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { ForgotPasswordPage, LoginPage, RegisterPage } from '@/pages/AuthPages'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function App() {
  const { prefs } = useAuth()
  useEffect(() => { document.documentElement.dataset.reduceMotion = String(prefs.reduceMotion) }, [prefs.reduceMotion])
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="issues" element={<IssuesPage />} />
        <Route path="issues/:slug" element={<IssuePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="articles/:slug" element={<ArticlePage />} />
        <Route path="contribute" element={<ContributePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<Navigate to="/about#contact" replace />} />
        <Route path="legal/:slug" element={<LegalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  )
}
