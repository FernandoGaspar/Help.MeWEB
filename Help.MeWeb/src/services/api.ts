import type { User, AuthResult, LoginCredentials, RegisterData } from '../types/auth';

const BASE_URL = 'http://fernandogasparjr.ddns.net:8090';
const REQUEST_TIMEOUT = 10000;

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.status === 200) {
        const bodyString = await response.text();
        const firstDecode = JSON.parse(bodyString);
        const data = JSON.parse(firstDecode);

        if (Array.isArray(data) && data.length > 0) {
          const usuario = data[0];

          if (usuario.Token === '0' || !usuario.idUsuario) {
            return { success: false, message: 'Usuário ou senha inválidos.' };
          }

          const user: User = {
            id: usuario.idUsuario?.toString() || '',
            name: usuario.Nome || usuario.Apelido || '',
            email: usuario.Email || '',
            token: usuario.Token || '',
            companhia: usuario.Companhia || '',
            login: usuario.Login || '',
            apelido: usuario.Apelido || '',
            roles: usuario.Roles ? [usuario.Roles] : ['operador'],
          };

          return { success: true, user };
        }

        return { success: false, message: 'Usuário ou senha inválidos.' };
      }

      return { success: false, message: `Erro no servidor (${response.status})` };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisição excedido' };
      }
      return { success: false, message: `Erro de conexão: ${error}` };
    }
  },

  async cadastrar(data: RegisterData): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/cadastroUsuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const result = await response.json();

        if (result.status === 'sucesso') {
          return { success: true, message: 'Cadastro realizado com sucesso.' };
        }

        return { success: false, message: result.mensagem || 'Erro no cadastro.' };
      }

      return { success: false, message: `Erro no servidor (${response.status})` };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisição excedido' };
      }
      return { success: false, message: `Erro de conexão: ${error}` };
    }
  },

  async resetDeSenha(login: string): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/resetDeSenha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login }),
      });

      if (response.status === 200) {
        return { success: true, message: 'Código enviado com sucesso' };
      }

      return { success: false, message: `Erro no servidor (${response.status})` };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisição excedido' };
      }
      return { success: false, message: `Erro de conexão: ${error}` };
    }
  },

  async validarTokenReset(login: string, token: string): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/validaTokenResetDeSenha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, token }),
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data.TokenValido === 1) {
          return { success: true, message: 'Token validado com sucesso' };
        }

        return { success: false, message: 'Token inválido ou expirado.' };
      }

      return { success: false, message: `Erro no servidor (${response.status})` };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisição excedido' };
      }
      return { success: false, message: `Erro de conexão: ${error}` };
    }
  },

  async alterarSenha(login: string, senha: string, token: string): Promise<AuthResult> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/alteraSenha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha, token }),
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data.Status === 'Senha Alterada') {
          return { success: true, message: 'Senha alterada com sucesso' };
        }

        return { success: false, message: data.Status || 'Erro ao alterar senha.' };
      }

      return { success: false, message: `Erro no servidor (${response.status})` };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, message: 'Tempo de requisição excedido' };
      }
      return { success: false, message: `Erro de conexão: ${error}` };
    }
  },
};
