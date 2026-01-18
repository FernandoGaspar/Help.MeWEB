import { motion } from 'framer-motion'
import { CheckCircle, Calendar, MapPin, Star, Search } from 'lucide-react'

interface HistoryItemProps {
  id: string
  oficina: string
  endereco: string
  servico: string
  data: string
  valor: string
  avaliacao?: number
}

function HistoryItem({ oficina, endereco, servico, data, valor, avaliacao }: HistoryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{servico}</h3>
            <p className="text-sm text-slate-500">{oficina}</p>
          </div>
        </div>
        <span className="font-semibold text-slate-900">{valor}</span>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {data}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {endereco}
        </span>
      </div>

      {avaliacao !== undefined ? (
        <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
          <span className="text-sm text-slate-600">Sua avaliacao:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= avaliacao ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium pt-4 border-t border-slate-200 w-full text-left">
          Avaliar este servico
        </button>
      )}
    </motion.div>
  )
}

export function HistoricoPage() {
  // Dados mockados - serao substituidos por dados da API
  const historico: HistoryItemProps[] = [
    {
      id: '1',
      oficina: 'Oficina Rapida',
      endereco: 'Centro',
      servico: 'Alinhamento e Balanceamento',
      data: '15/01/2026',
      valor: 'R$ 120,00',
      avaliacao: 5,
    },
    {
      id: '2',
      oficina: 'Auto Center Silva',
      endereco: 'Jardim Paulista',
      servico: 'Troca de oleo',
      data: '10/01/2026',
      valor: 'R$ 180,00',
      avaliacao: 4,
    },
    {
      id: '3',
      oficina: 'Mecanica Santos',
      endereco: 'Vila Mariana',
      servico: 'Revisao completa',
      data: '05/01/2026',
      valor: 'R$ 450,00',
    },
    {
      id: '4',
      oficina: 'Auto Center Silva',
      endereco: 'Jardim Paulista',
      servico: 'Troca de pastilhas de freio',
      data: '28/12/2025',
      valor: 'R$ 320,00',
      avaliacao: 5,
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Historico</h1>
        <p className="text-slate-500 mt-1">
          Seus servicos anteriores
        </p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por servico ou oficina..."
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* History List */}
      {historico.length > 0 ? (
        <div className="space-y-4">
          {historico.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <HistoryItem {...item} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 text-center border border-slate-200"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 mb-2">Nenhum historico</h3>
          <p className="text-sm text-slate-500">
            Voce ainda nao tem servicos concluidos.
          </p>
        </motion.div>
      )}
    </div>
  )
}
