import { Routes, Route } from 'react-router-dom'
import { LandingPage, LoginPage, RegisterPage, ForgotPasswordPage, FAQPage, PrivacyPage, TermsPage, ActivateAccountPage, RestrictedAccessPage } from '@/pages'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth'
import { UserProfile } from '@/types/auth'

// Admin pages
import { AdminLayout, DashboardPage as AdminDashboard, PedidosPage, OperadoresPage } from '@/pages/admin'

// Cliente pages
import { ClienteLayout, HomePage as ClienteHome, SolicitarServicoPage, MeusServicosPage, HistoricoPage, OficinasPage } from '@/pages/cliente'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas publicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/ativar-conta" element={<ActivateAccountPage />} />
        <Route path="/acesso-restrito" element={<RestrictedAccessPage />} />

        {/* Area Administrativa (perfil 1) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedProfiles={[UserProfile.ADMINISTRATIVO]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="pedidos" element={<PedidosPage />} />
          <Route path="operadores" element={<OperadoresPage />} />
          <Route path="configuracoes" element={<AdminDashboard />} />
        </Route>

        {/* Area do Cliente (perfil 4) */}
        <Route
          path="/cliente"
          element={
            <ProtectedRoute allowedProfiles={[UserProfile.CLIENTE_FINAL]}>
              <ClienteLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClienteHome />} />
          <Route path="solicitar" element={<SolicitarServicoPage />} />
          <Route path="oficinas" element={<OficinasPage />} />
          <Route path="servicos" element={<MeusServicosPage />} />
          <Route path="historico" element={<HistoricoPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
