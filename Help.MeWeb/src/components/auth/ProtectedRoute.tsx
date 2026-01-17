import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserProfile } from '@/types/auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedProfiles?: number[]
}

export function ProtectedRoute({ children, allowedProfiles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Exibir loading enquanto verifica autenticacao
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verificando autenticacao...</p>
        </div>
      </div>
    )
  }

  // Redirecionar para login se nao autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Bloquear perfis 2 (Operador) e 3 (Master) - devem usar apenas o app mobile
  if (user.idPerfilUsuario === UserProfile.OPERADOR || user.idPerfilUsuario === UserProfile.MASTER) {
    return <Navigate to="/acesso-restrito" replace />
  }

  // Verificar se o perfil do usuario esta na lista de perfis permitidos
  if (allowedProfiles && !allowedProfiles.includes(user.idPerfilUsuario)) {
    // Redirecionar para a area correta baseada no perfil
    if (user.idPerfilUsuario === UserProfile.ADMINISTRATIVO) {
      return <Navigate to="/admin" replace />
    }
    if (user.idPerfilUsuario === UserProfile.CLIENTE_FINAL) {
      return <Navigate to="/cliente" replace />
    }
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
