import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, AuthResult, LoginCredentials, RegisterData } from '../types/auth'
import { UserProfile, WEB_ALLOWED_PROFILES } from '../types/auth'
import { api } from '../services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResult>
  register: (data: RegisterData) => Promise<AuthResult>
  logout: () => void
  resetPassword: (login: string) => Promise<AuthResult>
  // Helpers de perfil
  isAdmin: boolean
  isCliente: boolean
  isWebAllowed: boolean
  hasProfile: (profileId: number) => boolean
  getRedirectPath: () => string
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'helpme_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar usuario do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const result = await api.login(credentials)

      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user))
      }

      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const result = await api.cadastrar(data)
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const resetPassword = useCallback(async (login: string): Promise<AuthResult> => {
    return api.resetDeSenha(login)
  }, [])

  // Helper para verificar se usuario tem determinado perfil
  const hasProfile = useCallback((profileId: number): boolean => {
    return user?.idPerfilUsuario === profileId
  }, [user])

  // Verificacoes de perfil
  const isAdmin = user?.idPerfilUsuario === UserProfile.ADMINISTRATIVO
  const isCliente = user?.idPerfilUsuario === UserProfile.CLIENTE_FINAL
  const isWebAllowed = user ? (WEB_ALLOWED_PROFILES as readonly number[]).includes(user.idPerfilUsuario) : false

  // Retorna o path de redirecionamento baseado no perfil
  const getRedirectPath = useCallback((): string => {
    if (!user) return '/login'

    switch (user.idPerfilUsuario) {
      case UserProfile.ADMINISTRATIVO:
        return '/admin'
      case UserProfile.CLIENTE_FINAL:
        return '/cliente'
      case UserProfile.OPERADOR:
      case UserProfile.MASTER:
        return '/acesso-restrito'
      default:
        return '/login'
    }
  }, [user])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!user.token,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    // Helpers de perfil
    isAdmin,
    isCliente,
    isWebAllowed,
    hasProfile,
    getRedirectPath,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
