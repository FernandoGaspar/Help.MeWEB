import { Routes, Route } from 'react-router-dom'
import { LandingPage, LoginPage, RegisterPage, PrivacyPage, TermsPage } from '@/pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/privacidade" element={<PrivacyPage />} />
      <Route path="/termos" element={<TermsPage />} />
    </Routes>
  )
}

export default App
