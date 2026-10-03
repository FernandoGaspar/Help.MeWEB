export const LOGISTICA_ENABLED = import.meta.env.VITE_LOGISTICA_ENABLED === 'true'
const base = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4011' : 'https://api.helpmebr.com')).replace(/\/$/, '') + '/logistica/v1'

export type Tipo = 'entrega_informada' | 'entrega_parcial' | 'nao_entregue'
export interface Ocorrencia {
  id: string
  entrega_id: string
  tipo: Tipo
  recebedor?: string
  observacao?: string
  comprovante_sha256?: string
  registrado_em: string
}
export interface Entrega {
  id: string
  referencia_nexus: string
  destinatario: string
  endereco: string
  itens: { codigo: string; quantidade: number }[]
}
export interface Romaneio {
  empresa_id: number
  id: string
  entregas: Entrega[]
  eventos: Ocorrencia[]
}
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.status = status }
}
async function request(token: string, path: string, options: RequestInit = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)
  try {
    const response = await fetch(base + path, {
      ...options, signal: controller.signal, headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new ApiError(response.status === 401 ? 'Sessão expirada. Entre novamente.' :
        data.erro || data.mensagem || 'Não foi possível concluir a operação.', response.status)
    }
    return response
  } finally { clearTimeout(timeout) }
}
const part = encodeURIComponent
export async function listarRomaneios(token: string): Promise<Romaneio[]> {
  return (await (await request(token, '/motorista/romaneios')).json()).romaneios
}
export async function registrar(token: string, r: Romaneio, entrega: Entrega, id: string,
  dados: { tipo: Tipo; recebedor: string; observacao: string }, foto: File | null) {
  const body = new FormData()
  body.append('dados', JSON.stringify(dados))
  if (foto) body.append('foto', foto)
  await request(token, `/motorista/empresas/${r.empresa_id}/romaneios/${part(r.id)}/entregas/${part(entrega.id)}/eventos/${part(id)}`,
    { method: 'PUT', body })
}
export async function baixarComprovante(token: string, empresa: number, evento: string) {
  const response = await request(token, `/motorista/empresas/${empresa}/eventos/${part(evento)}/comprovante`)
  const url = URL.createObjectURL(await response.blob())
  const a = document.createElement('a')
  a.href = url; a.download = 'comprovante.jpg'; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
