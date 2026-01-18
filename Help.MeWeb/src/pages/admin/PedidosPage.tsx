import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Loader2, AlertCircle, Calendar, Car, Phone, Mail, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import type { Pedido } from '@/services/api'
import { cn } from '@/lib/utils'

// Status dos pedidos conforme banco de dados
const STATUS_OPTIONS = [
  { id: 0, label: 'Todos', color: 'bg-slate-100 text-slate-700' },
  { id: 1, label: 'Aberto', color: 'bg-blue-100 text-blue-700' },
  { id: 2, label: 'Em Andamento', color: 'bg-amber-100 text-amber-700' },
  { id: 3, label: 'Concluido', color: 'bg-green-100 text-green-700' },
  { id: 4, label: 'Cancelado', color: 'bg-red-100 text-red-700' },
]

function getStatusConfig(idStatus: number) {
  return STATUS_OPTIONS.find(s => s.id === idStatus) || STATUS_OPTIONS[0]
}

function formatDate(dateString?: string) {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

export function PedidosPage() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(0) // 0 = Todos
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)

  const loadPedidos = async () => {
    if (!user?.token) return

    setIsLoading(true)
    setError('')

    const result = await api.listaPedidos(user.token, statusFilter)

    if (result.success) {
      setPedidos(result.pedidos)
    } else {
      setError(result.message || 'Erro ao carregar pedidos')
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadPedidos()
  }, [user?.token, statusFilter])

  // Filtrar pedidos por busca
  const pedidosFiltrados = pedidos.filter(p => {
    const searchLower = searchTerm.toLowerCase()
    return (
      p.NomeCliente?.toLowerCase().includes(searchLower) ||
      p.Placa?.toLowerCase().includes(searchLower) ||
      p.DescricaoServico?.toLowerCase().includes(searchLower) ||
      p.NumeroPedido?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
          <p className="text-slate-500 mt-1">Gerencie os pedidos da sua oficina</p>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, placa, servico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status.id}
                onClick={() => setStatusFilter(status.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  statusFilter === status.id
                    ? status.color
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {status.label}
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
        /* Table */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Veiculo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Servico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pedidosFiltrados.length > 0 ? (
                  pedidosFiltrados.map((pedido) => {
                    const statusConfig = getStatusConfig(pedido.idStatusPedido)
                    return (
                      <tr key={pedido.idPedido} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          #{pedido.NumeroPedido || pedido.idPedido}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {pedido.NomeCliente || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <div>
                            <span className="font-medium">{pedido.Placa || '-'}</span>
                            {pedido.Modelo && (
                              <span className="text-slate-400 ml-1">({pedido.Modelo})</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {pedido.DescricaoServico || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                            statusConfig.color
                          )}>
                            {pedido.StatusPedido || statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {formatDate(pedido.DataPedido)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => setSelectedPedido(pedido)}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      Nenhum pedido encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Mostrando {pedidosFiltrados.length} pedido{pedidosFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      )}

      {/* Modal de Detalhes */}
      {selectedPedido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Pedido #{selectedPedido.NumeroPedido || selectedPedido.idPedido}
              </h2>
              <button
                onClick={() => setSelectedPedido(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status */}
            <div className="mb-6">
              <span className={cn(
                'inline-flex px-3 py-1 text-sm font-medium rounded-full',
                getStatusConfig(selectedPedido.idStatusPedido).color
              )}>
                {selectedPedido.StatusPedido || getStatusConfig(selectedPedido.idStatusPedido).label}
              </span>
            </div>

            {/* Cliente */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="font-medium text-slate-900 mb-3">Cliente</h3>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="font-medium">{selectedPedido.NomeCliente || '-'}</span>
                </p>
                {selectedPedido.EmailCliente && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {selectedPedido.EmailCliente}
                  </p>
                )}
                {selectedPedido.TelefoneCliente && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {selectedPedido.TelefoneCliente}
                  </p>
                )}
              </div>
            </div>

            {/* Veiculo */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="font-medium text-slate-900 mb-3">Veiculo</h3>
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">{selectedPedido.Placa || '-'}</p>
                  {selectedPedido.Modelo && (
                    <p className="text-sm text-slate-500">{selectedPedido.Modelo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Servico */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="font-medium text-slate-900 mb-3">Servico</h3>
              <p className="text-sm text-slate-600">
                {selectedPedido.DescricaoServico || 'Sem descricao'}
              </p>
              {selectedPedido.Observacoes && (
                <p className="text-sm text-slate-500 mt-2 italic">
                  Obs: {selectedPedido.Observacoes}
                </p>
              )}
            </div>

            {/* Datas */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="font-medium text-slate-900 mb-3">Datas</h3>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Criado: {formatDate(selectedPedido.DataPedido)}</span>
                </p>
                {selectedPedido.DataAtualizacao && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Atualizado: {formatDate(selectedPedido.DataAtualizacao)}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Valor */}
            {selectedPedido.ValorTotal !== undefined && selectedPedido.ValorTotal > 0 && (
              <div className="bg-primary-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Valor Total</span>
                  <span className="text-xl font-bold text-primary-700">
                    R$ {selectedPedido.ValorTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedPedido(null)}
              className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Fechar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
