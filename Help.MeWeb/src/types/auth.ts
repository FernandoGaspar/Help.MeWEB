// Perfis de usuario conforme API
export const UserProfile = {
  ADMINISTRATIVO: 1,
  OPERADOR: 2,
  MASTER: 3,
  CLIENTE_FINAL: 4,
} as const

export type UserProfileType = typeof UserProfile[keyof typeof UserProfile]

// Mapear perfil para role string
export const PROFILE_TO_ROLE: Record<number, string> = {
  1: 'administrativo',
  2: 'operador',
  3: 'master',
  4: 'cliente',
}

// Perfis permitidos na versao web
export const WEB_ALLOWED_PROFILES = [UserProfile.ADMINISTRATIVO, UserProfile.CLIENTE_FINAL]

// Contexto do usuario (dados especificos por perfil)
export interface UserContext {
  idCliente?: number | null
  idFornecedor?: number | null
  idFilial?: number | null
  isMatriz?: boolean | null
}

export interface User {
  id: string
  name: string
  email: string
  token: string
  login?: string
  apelido?: string
  companhia?: string
  // Campos de perfil
  idPerfilUsuario: number
  role: string
  contexto: UserContext
  primeiroAcesso?: boolean
}

export interface AuthResult {
  success: boolean
  message?: string
  user?: User
}

export interface LoginCredentials {
  login: string
  senha: string
}

export interface RegisterData {
  nome: string
  email: string
  login: string
  senha: string
  companhia: string
  idPerfilUsuario?: number // 1=Oficina, 4=Cliente
}
