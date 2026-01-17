import { motion } from 'framer-motion'
import { Search, Filter, MoreVertical } from 'lucide-react'

export function PedidosPage() {
  // Dados mockados - serao substituidos por dados da API
  const pedidos = [
    { id: '001', cliente: 'Joao Silva', servico: 'Troca de oleo', status: 'em_andamento', data: '17/01/2026', valor: 'R$ 250,00' },
    { id: '002', cliente: 'Maria Santos', servico: 'Revisao completa', status: 'aguardando', data: '17/01/2026', valor: 'R$ 850,00' },
    { id: '003', cliente: 'Carlos Oliveira', servico: 'Alinhamento', status: 'concluido', data: '16/01/2026', valor: 'R$ 120,00' },
    { id: '004', cliente: 'Ana Pereira', servico: 'Balanceamento', status: 'em_andamento', data: '16/01/2026', valor: 'R$ 80,00' },
    { id: '005', cliente: 'Pedro Costa', servico: 'Freios', status: 'aguardando', data: '15/01/2026', valor: 'R$ 450,00' },
  ]

  const statusConfig: Record<string, { label: string; color: string }> = {
    aguardando: { label: 'Aguardando', color: 'bg-amber-100 text-amber-700' },
    em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-700' },
    concluido: { label: 'Concluido', color: 'bg-green-100 text-green-700' },
  }

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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, servico..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </motion.div>

      {/* Table */}
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
                  Servico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acoes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    #{pedido.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {pedido.cliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {pedido.servico}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig[pedido.status].color}`}>
                      {statusConfig[pedido.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {pedido.data}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {pedido.valor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando 1-5 de 156 pedidos
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
              Proximo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
