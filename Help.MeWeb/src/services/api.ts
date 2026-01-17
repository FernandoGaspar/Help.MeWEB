import type { User, AuthResult, LoginCredentials, RegisterData } from '../types/auth'

const BASE_URL = import.meta.env.DEV ? 'http://localhost:4011' : 'http://fernandogasparjr.ddns.net:4011'
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
        const bodyString = await response.text()
        const firstDecode = JSON.parse(bodyString)
        const data = JSON.parse(firstDecode)

        if (Array.isArray(data) && data.length > 0) {
          const usuario = data[0]

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

        return { success: false, message: 'Usuario ou senha invalidos.' }
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
}
