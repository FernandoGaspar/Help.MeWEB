import { useCallback, useEffect, useState } from 'react'
import {
  atualizarMotorista, atualizarPerfil, atualizarTransportadora, atualizarVeiculo, cadastrarVeiculo, convidarMotorista,
  obterTransportadora, reenviarConvite, tornarMeMotorista,
} from '@/services/logistica'
import type { MotoristaTransportadora, Transportadora } from '@/services/logistica'

export const field = 'block w-full rounded-lg border border-slate-300 p-3 mt-1 bg-white disabled:bg-slate-100'
export const button = 'rounded-lg bg-blue-700 px-4 py-3 text-white font-medium disabled:opacity-50'
const card = 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4'
const link = 'text-blue-700 underline py-2 disabled:opacity-50'

function message(err: unknown) {
  return err instanceof Error ? err.message : 'Não foi possível concluir a operação.'
}

function MotoristaLinha({ motorista, busy, onSave, onResend }: {
  motorista: MotoristaTransportadora; busy: boolean
  onSave: (dados: { telefone: string | null; documento: string | null; ativo: boolean }) => void
  onResend: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [telefone, setTelefone] = useState(motorista.telefone || '')
  const [documento, setDocumento] = useState(motorista.documento || '')
  const dados = { telefone: motorista.telefone, documento: motorista.documento }
  return <li className="border-t border-slate-200 pt-3 space-y-2">
    <div className="flex flex-wrap justify-between gap-2">
      <div>
        <p className="font-medium">{motorista.nome}{motorista.eu && ' (você)'}</p>
        <p className="text-sm text-slate-500">{[motorista.email, motorista.telefone, motorista.documento && `RG ${motorista.documento}`].filter(Boolean).join(' · ')}</p>
        {!motorista.ativo && <p className="text-sm text-amber-700">Desativado: não recebe romaneios</p>}
        {motorista.ativo && motorista.convite_pendente && <p className="text-sm text-amber-700">Aguardando ativação da conta</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        {motorista.convite_pendente && motorista.ativo && <button className={link} disabled={busy} onClick={onResend}>Reenviar convite</button>}
        <button className={link} disabled={busy} onClick={() => setEditing(e => !e)}>{editing ? 'Fechar' : 'Editar'}</button>
        <button className={link} disabled={busy} onClick={() => onSave({ ...dados, ativo: !motorista.ativo })}>
          {motorista.ativo ? 'Desativar' : 'Reativar'}</button>
      </div>
    </div>
    {editing && <form className="grid sm:grid-cols-3 gap-3 items-end" onSubmit={e => {
      e.preventDefault()
      onSave({ telefone, documento: documento.trim() || null, ativo: motorista.ativo })
      setEditing(false)
    }}>
      <label className="block">Celular<input className={field} required value={telefone} onChange={e => setTelefone(e.target.value)} /></label>
      <label className="block">RG<input className={field} maxLength={20} value={documento} onChange={e => setDocumento(e.target.value)} /></label>
      <button className={button} disabled={busy}>Salvar</button>
    </form>}
  </li>
}

export function TransportadoraPanel({ token, onChanged }: { token: string; onChanged: () => void }) {
  const [data, setData] = useState<Transportadora | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [dados, setDados] = useState({ nome: '', documento: '', telefone: '' })
  const [convite, setConvite] = useState({ nome: '', email: '', telefone: '', documento: '' })
  const [veiculo, setVeiculo] = useState({ placa: '', descricao: '' })
  const apply = useCallback((t: Transportadora) => {
    setData(t)
    setDados({ nome: t.nome, documento: t.documento || '', telefone: t.telefone || '' })
  }, [])
  useEffect(() => {
    obterTransportadora(token).then(apply).catch(err => setError(message(err)))
  }, [token, apply])
  async function run(action: () => Promise<Transportadora | null>, success: string) {
    setBusy(true); setError(''); setNotice('')
    try {
      const result = await action()
      apply(result ?? await obterTransportadora(token))
      setNotice(success)
      return true
    } catch (err) {
      setError(message(err))
      return false
    } finally { setBusy(false) }
  }
  if (!data) return error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</p> : <p role="status">Carregando transportadora…</p>
  const souMotorista = data.motoristas.some(m => m.eu && m.ativo)
  return <div className="space-y-6">
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-lg bg-green-50 p-4 text-green-800">{notice}</p>}

    <section className={card}>
      <h2 className="text-lg font-semibold">Dados da transportadora</h2>
      <form className="grid sm:grid-cols-3 gap-3 items-end" onSubmit={e => {
        e.preventDefault()
        void run(() => atualizarTransportadora(token, dados), 'Dados da transportadora salvos.')
      }}>
        <label className="block">Nome<input className={field} required maxLength={150} value={dados.nome} onChange={e => setDados({ ...dados, nome: e.target.value })} /></label>
        <label className="block">CNPJ ou CPF<input className={field} inputMode="numeric" value={dados.documento} onChange={e => setDados({ ...dados, documento: e.target.value })} /></label>
        <label className="block">Celular<input className={field} required value={dados.telefone} onChange={e => setDados({ ...dados, telefone: e.target.value })} /></label>
        <button className={button} disabled={busy}>Salvar dados</button>
      </form>
    </section>

    <section className={card}>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg font-semibold">Motoristas</h2>
        {!souMotorista && <button className={link} disabled={busy} onClick={() => void run(async () => {
          const t = await tornarMeMotorista(token); onChanged(); return t
        }, 'Você agora também faz entregas.')}>Eu também faço entregas</button>}
      </div>
      {data.motoristas.length === 0 && <p className="text-slate-500">Nenhum motorista cadastrado.</p>}
      <ul className="space-y-3">{data.motoristas.map(m => <MotoristaLinha key={m.id} motorista={m} busy={busy}
        onSave={d => void run(async () => { const t = await atualizarMotorista(token, m.id, d); if (m.eu) onChanged(); return t }, 'Motorista atualizado.')}
        onResend={() => void run(async () => { await reenviarConvite(token, m.id); return null }, `Convite reenviado para ${m.email}.`)} />)}</ul>
      <form className="grid sm:grid-cols-2 gap-3 items-end border-t border-slate-200 pt-4" onSubmit={async e => {
        e.preventDefault()
        const ok = await run(async () => { await convidarMotorista(token, convite); return null },
          `Convite enviado para ${convite.email}. O motorista define a senha pelo link recebido.`)
        if (ok) setConvite({ nome: '', email: '', telefone: '', documento: '' })
      }}>
        <h3 className="sm:col-span-2 font-medium">Cadastrar motorista</h3>
        <label className="block">Nome completo<input className={field} required maxLength={150} value={convite.nome} onChange={e => setConvite({ ...convite, nome: e.target.value })} /></label>
        <label className="block">E-mail<input className={field} type="email" required value={convite.email} onChange={e => setConvite({ ...convite, email: e.target.value })} /></label>
        <label className="block">Celular com DDD<input className={field} type="tel" required value={convite.telefone} onChange={e => setConvite({ ...convite, telefone: e.target.value })} /></label>
        <label className="block">RG<input className={field} maxLength={20} value={convite.documento} onChange={e => setConvite({ ...convite, documento: e.target.value })} /></label>
        <p className="text-sm text-slate-500 sm:col-span-2">O motorista recebe um e-mail para ativar a conta e definir a senha.</p>
        <button className={button} disabled={busy}>Enviar convite</button>
      </form>
    </section>

    <section className={card}>
      <h2 className="text-lg font-semibold">Veículos</h2>
      {data.veiculos.length === 0 && <p className="text-slate-500">Nenhum veículo cadastrado.</p>}
      <ul className="space-y-2">{data.veiculos.map(v => <li key={v.id} className="flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-2">
        <span><strong>{v.placa}</strong>{v.descricao && ` · ${v.descricao}`}{!v.ativo && <span className="text-amber-700"> · desativado</span>}</span>
        <button className={link} disabled={busy} onClick={() => void run(() => atualizarVeiculo(token, v.id, { descricao: v.descricao, ativo: !v.ativo }),
          v.ativo ? 'Veículo desativado.' : 'Veículo reativado.')}>{v.ativo ? 'Desativar' : 'Reativar'}</button>
      </li>)}</ul>
      <form className="grid sm:grid-cols-3 gap-3 items-end border-t border-slate-200 pt-4" onSubmit={async e => {
        e.preventDefault()
        const ok = await run(() => cadastrarVeiculo(token, veiculo), 'Veículo cadastrado.')
        if (ok) setVeiculo({ placa: '', descricao: '' })
      }}>
        <label className="block">Placa<input className={field} required maxLength={8} placeholder="ABC1D23" value={veiculo.placa}
          onChange={e => setVeiculo({ ...veiculo, placa: e.target.value.toUpperCase() })} /></label>
        <label className="block">Descrição (opcional)<input className={field} maxLength={60} placeholder="Fiorino branca" value={veiculo.descricao}
          onChange={e => setVeiculo({ ...veiculo, descricao: e.target.value })} /></label>
        <button className={button} disabled={busy}>Cadastrar veículo</button>
      </form>
    </section>
  </div>
}

export function MeusDados({ token, inicial, onSaved }: {
  token: string; inicial: { telefone: string | null; documento: string | null }; onSaved: () => void
}) {
  const [telefone, setTelefone] = useState(inicial.telefone || '')
  const [documento, setDocumento] = useState(inicial.documento || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  return <section className={card}>
    <h2 className="text-lg font-semibold">Meus dados de motorista</h2>
    <p className="text-sm text-slate-500">Esses dados aparecem no romaneio da empresa contratante.</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {saved && <p role="status" className="text-green-800">Dados salvos.</p>}
    <form className="grid sm:grid-cols-3 gap-3 items-end" onSubmit={async e => {
      e.preventDefault()
      setBusy(true); setError(''); setSaved(false)
      try {
        await atualizarPerfil(token, { telefone, documento })
        setSaved(true); onSaved()
      } catch (err) { setError(message(err)) } finally { setBusy(false) }
    }}>
      <label className="block">Celular<input className={field} type="tel" required value={telefone} onChange={e => setTelefone(e.target.value)} /></label>
      <label className="block">RG<input className={field} maxLength={20} value={documento} onChange={e => setDocumento(e.target.value)} /></label>
      <button className={button} disabled={busy}>Salvar</button>
    </form>
  </section>
}
