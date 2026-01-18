import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Plus,
  UserCheck,
  UserX,
  Mail,
  User,
  Lock,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import type { Operador } from '@/services/api'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'

export function OperadoresPage() {
  const { user } = useAuth()
  const [operadores, setOperadores] = useState<Operador[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAtivo, setFilterAtivo] = useState<'todos' | 'ativos' | 'inativos'>('todos')

  // Modal de cadastro
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalError, setModalError] = useState('')
  const [modalSuccess, setModalSuccess] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    login: '',
    senha: '',
  })

  const loadOperadores = async () => {
    if (!user?.token) return

    setIsLoading(true)
    setError('')

    const result = await api.listaOperadores(user.token)

    if (result.success) {
      setOperadores(result.operadores)
    } else {
      setError(result.message || 'Erro ao carregar operadores')
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadOperadores()
  }, [user?.token])

  const handleToggleStatus = async (operador: Operador) => {
    if (!user?.token) return

    const novoStatus = !operador.Ativo
    const result = await api.alterarStatusOperador(user.token, operador.idUsuario, novoStatus)

    if (result.success) {
      // Atualizar lista localmente
      setOperadores(prev =>
        prev.map(op =>
          op.idUsuario === operador.idUsuario
            ? { ...op, Ativo: novoStatus }
            : op
        )
      )
    } else {
      setError(result.message || 'Erro ao alterar status')
    }
  }

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.token) return

    setModalError('')
    setModalSuccess('')

    if (!formData.nome.trim() || !formData.email.trim() || !formData.login.trim() || !formData.senha.trim()) {
      setModalError('Preencha todos os campos')
      return
    }

    if (formData.senha.length < 6) {
      setModalError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsSubmitting(true)

    const result = await api.cadastrarOperador(user.token, formData)

    if (result.success) {
      setModalSuccess('Operador cadastrado com sucesso!')
      setFormData({ nome: '', email: '', login: '', senha: '' })
      // Recarregar lista
      loadOperadores()
      // Fechar modal apos 2 segundos
      setTimeout(() => {
        setShowModal(false)
        setModalSuccess('')
      }, 2000)
    } else {
      setModalError(result.message || 'Erro ao cadastrar operador')
    }

    setIsSubmitting(false)
  }

  // Filtrar operadores
  const operadoresFiltrados = operadores.filter(op => {
    const matchSearch =
      op.NomeUsuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.Login?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatus =
      filterAtivo === 'todos' ||
      (filterAtivo === 'ativos' && op.Ativo) ||
      (filterAtivo === 'inativos' && !op.Ativo)

    return matchSearch && matchStatus
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operadores</h1>
          <p className="text-slate-500 mt-1">Gerencie os operadores da sua oficina</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Operador
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou login..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['todos', 'ativos', 'inativos'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterAtivo(filter)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  filterAtivo === filter
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        /* Operadores Grid */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {operadoresFiltrados.length > 0 ? (
            operadoresFiltrados.map((operador) => (
              <div
                key={operador.idUsuario}
                className={cn(
                  'bg-white rounded-xl p-5 shadow-sm border transition-all',
                  operador.Ativo
                    ? 'border-slate-200 hover:shadow-md'
                    : 'border-slate-200 bg-slate-50 opacity-75'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      operador.Ativo ? 'bg-primary-100' : 'bg-slate-200'
                    )}>
                      <span className={cn(
                        'text-lg font-semibold',
                        operador.Ativo ? 'text-primary-700' : 'text-slate-500'
                      )}>
                        {operador.NomeUsuario?.charAt(0).toUpperCase() || 'O'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{operador.NomeUsuario}</h3>
                      <p className="text-sm text-slate-500">@{operador.Login}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    operador.Ativo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  )}>
                    {operador.Ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {operador.Email}
                </p>

                <button
                  onClick={() => handleToggleStatus(operador)}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors',
                    operador.Ativo
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  )}
                >
                  {operador.Ativo ? (
                    <>
                      <UserX className="w-4 h-4" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Ativar
                    </>
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Nenhum operador encontrado</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Novo Operador</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setModalError('')
                  setModalSuccess('')
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleCadastrar} className="space-y-4">
              <Input
                label="Nome completo"
                type="text"
                placeholder="Nome do operador"
                icon={<User className="w-5 h-5" />}
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />

              <Input
                label="E-mail"
                type="email"
                placeholder="email@exemplo.com"
                icon={<Mail className="w-5 h-5" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Login"
                type="text"
                placeholder="nome.operador"
                icon={<User className="w-5 h-5" />}
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                required
              />

              <Input
                label="Senha"
                type="password"
                placeholder="Minimo 6 caracteres"
                icon={<Lock className="w-5 h-5" />}
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowModal(false)
                    setModalError('')
                    setModalSuccess('')
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={isSubmitting}
                >
                  Cadastrar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
