import { Routes, Route } from 'react-router-dom'
import { LandingPage, LoginPage, RegisterPage, ForgotPasswordPage, FAQPage, PrivacyPage, TermsPage, ActivateAccountPage } from '@/pages'
import { AuthProvider } from '@/contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/ativar-conta" element={<ActivateAccountPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
