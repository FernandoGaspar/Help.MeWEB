import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ApiError, baixarComprovante, listarRomaneios, obterPerfil, registrar } from '@/services/logistica'
import type { Entrega, Perfil, Romaneio, Tipo } from '@/services/logistica'
import { MeusDados, TransportadoraPanel, button, field } from './logistica/TransportadoraPanel'

const labels = { entrega_informada: 'Entrega informada', entrega_parcial: 'Entrega parcial', nao_entregue: 'Não entregue' }

function EntregaCard({ romaneio, entrega, token, onSaved }: {
  romaneio: Romaneio; entrega: Entrega; token: string; onSaved: () => void
}) {
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState<Tipo>('entrega_informada')
  const [recebedor, setRecebedor] = useState('')
  const [observacao, setObservacao] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uncertain, setUncertain] = useState(false)
  const attempt = useRef<{ id: string; tipo: Tipo; recebedor: string; observacao: string; foto: File | null } | null>(null)
  const events = romaneio.eventos.filter(e => e.entrega_id === entrega.id)
  const delivered = (success && tipo === 'entrega_informada') || events.some(e => e.tipo === 'entrega_informada')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    try {
      if (!attempt.current) {
        if (foto && foto.size > 5 * 1024 * 1024) throw new Error('A foto deve ter no máximo 5 MB.')
        attempt.current = { id: crypto.randomUUID(), tipo, recebedor: recebedor.trim(), observacao: observacao.trim(), foto }
      }
      const value = attempt.current
      await registrar(token, romaneio, entrega, value.id, value, value.foto)
      attempt.current = null
      setUncertain(false); setSuccess(true); setOpen(false); setFoto(null)
      onSaved()
    } catch (err) {
      // Quando a resposta se perde, preservar ID e conteudo ao tentar novamente.
      const retry = attempt.current !== null && (!(err instanceof ApiError) || err.status >= 500)
      setUncertain(retry)
      if (!retry) attempt.current = null
      setError(err instanceof Error ? err.message : 'Falha ao enviar. Tente novamente.')
    } finally { setBusy(false) }
  }

  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
    <div><h3 className="font-semibold text-lg">{entrega.destinatario}</h3>
      <p className="text-sm text-slate-500">Referência: {entrega.referencia_nexus}</p>
      <p className="mt-2">{entrega.endereco}</p></div>
    <ul className="rounded-lg bg-slate-50 p-3 space-y-1">
      {entrega.itens.map((item, i) => <li key={i} className="flex justify-between gap-4"><span>{item.codigo}</span><strong>{item.quantidade} un.</strong></li>)}
    </ul>
    {events.length > 0 && <div className="space-y-3" aria-label="Histórico da entrega">
      {events.map(event => <div key={event.id} className="border-l-4 border-blue-300 pl-3 text-sm">
        <p className="font-semibold">{labels[event.tipo]}</p>
        <p>{new Date(event.registrado_em).toLocaleString('pt-BR')}</p>
        {event.recebedor && <p>Recebedor: {event.recebedor}</p>}
        {event.observacao && <p>{event.observacao}</p>}
        <p className="text-slate-500">Pendente de conferência interna</p>
        {event.comprovante_sha256 && <button type="button" className="text-blue-700 underline py-2"
          onClick={() => baixarComprovante(token, romaneio.empresa_id, event.id).catch(err => setError(err.message))}>Baixar comprovante</button>}
      </div>)}
    </div>}
    {success && <p role="status" className="text-green-800">Ocorrência registrada. A equipe fará a conferência.</p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!open && !delivered && <button className={button} onClick={() => setOpen(true)}>Registrar ocorrência</button>}
    {open && <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={busy || uncertain} className="space-y-4">
        <label className="block">Resultado<select className={field} value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>
          <option value="entrega_informada">Entregue</option><option value="entrega_parcial">Entrega parcial</option><option value="nao_entregue">Não entregue</option>
        </select></label>
        {tipo !== 'nao_entregue' && <label className="block">Nome de quem recebeu<input className={field} required maxLength={200} value={recebedor} onChange={e => setRecebedor(e.target.value)} /></label>}
        {tipo !== 'entrega_informada' && <label className="block">{tipo === 'entrega_parcial' ? 'Informe o que foi entregue e o que ficou pendente' : 'Motivo'}<textarea className={field} required maxLength={1000} value={observacao} onChange={e => setObservacao(e.target.value)} /></label>}
        <label className="block">Foto do comprovante {tipo === 'nao_entregue' ? '(opcional)' : '(obrigatória)'}
          <input type="file" className={field} accept="image/jpeg,image/png,image/webp" capture="environment"
            required={tipo !== 'nao_entregue'} onChange={e => setFoto(e.target.files?.[0] || null)} />
          <span className="text-sm text-slate-500">JPEG, PNG ou WebP, até 5 MB e 16 megapixels.</span>
        </label>
      </fieldset>
      {uncertain && <p role="status" className="text-amber-800">Não recebemos a confirmação do servidor. Mantenha esta tela aberta e tente novamente; o mesmo registro será reenviado.</p>}
      <div className="flex gap-3"><button disabled={busy} className={button}>{busy ? 'Enviando…' : uncertain ? 'Tentar novamente' : 'Enviar ocorrência'}</button>
        {!uncertain && <button type="button" disabled={busy} className="px-4 py-3" onClick={() => setOpen(false)}>Cancelar</button>}</div>
    </form>}
  </article>
}

function Entregas({ token, userId }: { token: string; userId?: number | string }) {
  const [romaneios, setRomaneios] = useState<Romaneio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const generation = useRef(0)
  const load = useCallback(async () => {
    const current = ++generation.current
    setLoading(true); setError('')
    try {
      const data = await listarRomaneios(token)
      if (current === generation.current) setRomaneios(data)
    } catch (err) {
      if (current === generation.current) setError(err instanceof Error ? err.message : 'Não foi possível carregar suas entregas.')
    } finally { if (current === generation.current) setLoading(false) }
  }, [token])
  const invalidate = useCallback(() => { generation.current++ }, [])
  useEffect(() => { void load(); return invalidate }, [load, invalidate])
  return <div className="space-y-6">
      <div className="flex justify-end"><button disabled={loading} onClick={() => void load()} className="border rounded-lg px-4 py-3 disabled:opacity-50">Atualizar entregas</button></div>
      {loading && <p role="status">Carregando entregas…</p>}
      {error && <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error} Use Atualizar para tentar novamente.</div>}
      {!loading && !error && romaneios.length === 0 && <p className="bg-white p-6 rounded-xl">Nenhuma entrega atribuída a você.</p>}
      {romaneios.map(r => <section key={`${r.empresa_id}-${r.id}`} className="space-y-4">
        <h2 className="text-lg font-semibold">Romaneio {r.id}</h2>
        {r.entregas.map(e => <EntregaCard key={`${userId}-${e.id}`} romaneio={r} entrega={e} token={token} onSaved={() => void load()} />)}
      </section>)}
  </div>
}

type Aba = 'entregas' | 'dados' | 'transportadora'

export function MotoristaPage() {
  const { user, logout } = useAuth()
  const token = user?.token || ''
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [error, setError] = useState('')
  const [aba, setAba] = useState<Aba | null>(null)
  const carregarPerfil = useCallback(() => {
    obterPerfil(token).then(p => {
      setPerfil(p)
      setAba(atual => atual ?? (p.motorista ? 'entregas' : 'transportadora'))
    }).catch(err => setError(err instanceof ApiError && err.status === 404
      ? 'Sua conta não está ativa como motorista ou responsável por transportadora.'
      : err instanceof Error ? err.message : 'Não foi possível carregar sua conta.'))
  }, [token])
  useEffect(() => { carregarPerfil() }, [carregarPerfil])
  const abas: { id: Aba; label: string }[] = perfil ? [
    ...(perfil.motorista ? [{ id: 'entregas' as Aba, label: 'Minhas entregas' }, { id: 'dados' as Aba, label: 'Meus dados' }] : []),
    ...(perfil.transportadora.responsavel ? [{ id: 'transportadora' as Aba, label: 'Transportadora' }] : []),
  ] : []
  return <main className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8">
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="font-bold text-blue-700">Help.Me</p>
          <h1 className="text-2xl font-bold">{perfil?.transportadora.nome || 'Entregas'}</h1><p>{user?.name}</p></div>
        <button onClick={logout} className="px-4 py-3">Sair</button>
      </header>
      {error && <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div>}
      {!perfil && !error && <p role="status">Carregando…</p>}
      {abas.length > 1 && <nav className="flex gap-2 overflow-x-auto" aria-label="Seções">
        {abas.map(a => <button key={a.id} onClick={() => setAba(a.id)} aria-current={aba === a.id ? 'page' : undefined}
          className={`rounded-lg px-4 py-2 font-medium whitespace-nowrap ${aba === a.id ? 'bg-blue-700 text-white' : 'bg-white border'}`}>{a.label}</button>)}
      </nav>}
      {perfil && aba === 'entregas' && perfil.motorista && <Entregas token={token} userId={user?.id} />}
      {perfil && aba === 'dados' && perfil.motorista && <MeusDados token={token} inicial={perfil.motorista} onSaved={carregarPerfil} />}
      {perfil && aba === 'transportadora' && perfil.transportadora.responsavel && <TransportadoraPanel token={token} onChanged={carregarPerfil} />}
    </div>
  </main>
}
