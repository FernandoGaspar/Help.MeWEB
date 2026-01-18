import type { User, AuthResult, LoginCredentials, RegisterData } from '../types/auth'

const BASE_URL = import.meta.env.DEV ? 'http://localhost:4011' : 'https://api.helpmebr.com'
const REQUEST_TIMEOUT = 10000

// Mapear perfil para role string (duplicado aqui para evitar import circular)
const profileToRole: Record<number, string> = {
  1: 'administrativo',
  2: 'operador',
  3: 'master',
  4: 'cliente',
}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

export const api = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (response.status === 200) {
        const usuario = await response.json()

        // Verificar se é erro da API
        if (usuario.status === 'erro') {
          return { success: false, message: usuario.mensagem || 'Usuario ou senha invalidos.' }
        }

        // Verificar token invalido
        if (usuario.Token === '0' || !usuario.idUsuario) {
          return { success: false, message: 'Usuario ou senha invalidos.' }
        }

        // Mapear perfil para role
        const idPerfilUsuario = usuario.idPerfilUsuario || 4
        const role = profileToRole[idPerfilUsuario] || 'cliente'

        const user: User = {
          id: usuario.idUsuario?.toString() || '',
          name: usuario.NomeUsuario || usuario.Nome || usuario.Apelido || '',
          email: usuario.Email || '',
          token: usuario.Token || '',
          companhia: usuario.Companhia || '',
          login: usuario.Login || '',
          apelido: usuario.Apelido || '',
          // Novos campos de perfil
          idPerfilUsuario,
          role,
          contexto: {
            idCliente: usuario.idCliente || null,
            idFornecedor: usuario.idFornecedor || null,
            idFilial: usuario.idFilial || null,
            isMatriz: usuario.isMatriz || null,
          },
          primeiroAcesso: usuario.primeiroAcesso === true || usuario.PrimeiroAcesso === 1,
        }

        return { success: true, user }
      }

      if (response.status === 401) {
        return { success: false, message: 'Usuario ou senha invalidos.' }
      }

      return { success: false, message: `Erro no servidor (${response.status})` }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisicao excedido' }
      }
      return { success: false, message: `Erro de conexao: ${error}` }
    }
  },

  async cadastrar(data: RegisterData): Promise<AuthResult> {
    try {
      // Garantir que idPerfilUsuario seja enviado (default: 4 = Cliente)
      const payload = {
        nome: data.nome,
        email: data.email,
        login: data.login,
        senha: data.senha,
        companhia: data.companhia,
        idPerfilUsuario: data.idPerfilUsuario || 4,
      }

      const response = await fetchWithTimeout(`${BASE_URL}/cadastroUsuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.status === 200) {
        const result = await response.json()

        if (result.status === 'sucesso' || result.success) {
          return { success: true, message: 'Cadastro realizado com sucesso.' }
        }

        return { success: false, message: result.mensagem || result.message || 'Erro no cadastro.' }
      }

      const errorData = await response.json().catch(() => null)
      return {
        success: false,
        message: errorData?.mensagem || errorData?.message || `Erro no servidor (${response.status})`
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisicao excedido' }
      }
      return { success: false, message: `Erro de conexao: ${error}` }
    }
  },

  async resetDeSenha(login: string): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/resetDeSenha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login }),
      })

      if (response.status === 200) {
        return { success: true, message: 'Codigo enviado com sucesso' }
      }

      return { success: false, message: `Erro no servidor (${response.status})` }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisicao excedido' }
      }
      return { success: false, message: `Erro de conexao: ${error}` }
    }
  },

  async validarTokenReset(login: string, token: string): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/validaTokenResetDeSenha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, token }),
      })

      if (response.status === 200) {
        const data = await response.json()

        if (data.TokenValido === 1) {
          return { success: true, message: 'Token validado com sucesso' }
        }

        return { success: false, message: 'Token invalido ou expirado.' }
      }

      return { success: false, message: `Erro no servidor (${response.status})` }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisicao excedido' }
      }
      return { success: false, message: `Erro de conexao: ${error}` }
    }
  },

  async alterarSenha(login: string, senha: string, token: string): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/alteraSenha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha, token }),
      })

      if (response.status === 200) {
        const data = await response.json()

        if (data.Status === 'Senha Alterada') {
          return { success: true, message: 'Senha alterada com sucesso' }
        }

        return { success: false, message: data.Status || 'Erro ao alterar senha.' }
      }

      return { success: false, message: `Erro no servidor (${response.status})` }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisicao excedido' }
      }
      return { success: false, message: `Erro de conexao: ${error}` }
    }
  },

  // Ativacao de conta
  async validarTokenAtivacao(token: string): Promise<{
    valido: boolean
    idUsuario?: number
    nomeUsuario?: string
    email?: string
    mensagem?: string
  }> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/validarTokenAtivacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.status === 200 && data.valido) {
        return {
          valido: true,
          idUsuario: data.idUsuario,
          nomeUsuario: data.nomeUsuario,
          email: data.email,
        }
      }

      return { valido: false, mensagem: data.mensagem || 'Token invalido ou expirado' }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { valido: false, mensagem: 'Tempo de requisicao excedido' }
      }
      return { valido: false, mensagem: `Erro de conexao: ${error}` }
    }
  },

  async ativarConta(token: string, novaSenha: string): Promise<{
    status: string
    mensagem?: string
    idUsuario?: number
    nomeUsuario?: string
    email?: string
  }> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/ativarConta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha }),
      })

      const data = await response.json()

      if (response.status === 200 && data.status === 'sucesso') {
        return {
          status: 'sucesso',
          mensagem: data.mensagem || 'Conta ativada com sucesso',
          idUsuario: data.idUsuario,
          nomeUsuario: data.nomeUsuario,
          email: data.email,
        }
      }

      return { status: 'erro', mensagem: data.mensagem || 'Erro ao ativar conta' }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { status: 'erro', mensagem: 'Tempo de requisicao excedido' }
      }
      return { status: 'erro', mensagem: `Erro de conexao: ${error}` }
    }
  },

  async reenviarEmailAtivacao(email: string): Promise<{
    status: string
    mensagem?: string
    email?: string
  }> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/reenviarEmailAtivacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.status === 200 && data.status === 'sucesso') {
        return {
          status: 'sucesso',
          mensagem: data.mensagem || 'E-mail de ativacao reenviado',
          email: data.email,
        }
      }

      return { status: 'erro', mensagem: data.mensagem || 'Erro ao reenviar e-mail' }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { status: 'erro', mensagem: 'Tempo de requisicao excedido' }
      }
      return { status: 'erro', mensagem: `Erro de conexao: ${error}` }
    }
  },

  // ==================== PEDIDOS ====================

  async listaPedidos(token: string, idStatus: number): Promise<{
    success: boolean
    pedidos: Pedido[]
    message?: string
  }> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/listaPedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ idStatus }),
      })

      if (response.status === 200) {
        const data = await response.json()
        // API retorna array direto ou objeto com status
        if (Array.isArray(data)) {
          return { success: true, pedidos: data }
        }
        if (data.status === 'erro') {
          return { success: false, pedidos: [], message: data.mensagem }
        }
        return { success: true, pedidos: data.pedidos || [] }
      }

      if (response.status === 401) {
        return { success: false, pedidos: [], message: 'Sessao expirada' }
      }

      return { success: false, pedidos: [], message: `Erro no servidor (${response.status})` }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, pedidos: [], message: 'Tempo de requisicao excedido' }
      }
      return { success: false, pedidos: [], message: `Erro de conexao: ${error}` }
    }
  },

  // ==================== OPERADORES ====================

  async listaOperadores(token: string): Promise<{
    success: boolean
    operadores: Operador[]
    message?: string
  }> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/listaOperadores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      if (response.status === 200) {
        const data = await response.json()
        if (data.status === 'sucesso') {
          return { success: true, operadores: data.operadores || [] }
        }
        return { success: false, operadores: [], message: data.mensagem }
      }

      if (response.status === 401) {
        return { success: false, operadores: [], message: 'Sessao expirada' }
      }

      return { success: false, operadores: [], message: `Erro no servidor (${response.status})` }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, operadores: [], message: 'Tempo de requisicao excedido' }
      }
      return { success: false, operadores: [], message: `Erro de conexao: ${error}` }
    }
  },

  async cadastrarOperador(token: string, data: {
    nome: string
    email: string
    login: string
    senha: string
  }): Promise<{
    success: boolean
    message?: string
    idUsuario?: number
  }> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/cadastroOperador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.status === 200 && result.status === 'sucesso') {
        return {
          success: true,
          message: result.mensagem || 'Operador cadastrado com sucesso',
          idUsuario: result.idUsuario,
        }
      }

      return { success: false, message: result.mensagem || 'Erro ao cadastrar operador' }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisicao excedido' }
      }
      return { success: false, message: `Erro de conexao: ${error}` }
    }
  },

  async alterarStatusOperador(token: string, idUsuario: number, ativo: boolean): Promise<{
    success: boolean
    message?: string
  }> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/alterarStatusOperador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ idUsuario, ativo }),
      })

      const result = await response.json()

      if (response.status === 200 && result.status === 'sucesso') {
        return { success: true, message: result.mensagem }
      }

      return { success: false, message: result.mensagem || 'Erro ao alterar status' }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisicao excedido' }
      }
      return { success: false, message: `Erro de conexao: ${error}` }
    }
  },
}

// ==================== TIPOS ====================

export interface Pedido {
  idPedido: number
  NumeroPedido?: string
  NomeCliente?: string
  EmailCliente?: string
  TelefoneCliente?: string
  Placa?: string
  Modelo?: string
  DescricaoServico?: string
  Observacoes?: string
  idStatusPedido: number
  StatusPedido?: string
  DataPedido?: string
  DataAtualizacao?: string
  ValorTotal?: number
}

export interface Operador {
  idUsuario: number
  NomeUsuario: string
  Email: string
  Login: string
  Ativo: boolean
  DataCadastro?: string
}
