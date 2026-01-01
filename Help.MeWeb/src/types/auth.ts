export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  companhia?: string;
  login?: string;
  apelido?: string;
  roles?: string[];
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

export interface LoginCredentials {
  login: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  login: string;
  senha: string;
  companhia: string;
}
