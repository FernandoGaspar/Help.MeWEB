import { motion } from 'framer-motion'
import { MapPin, Phone, Star, Clock, Navigation, AlertCircle } from 'lucide-react'

interface OficinaCardProps {
  id: string
  nome: string
  endereco: string
  telefone: string
  avaliacao: number
  totalAvaliacoes: number
  distancia: string
  horario: string
  servicos: string[]
}

function OficinaCard({
  nome,
  endereco,
  telefone,
  avaliacao,
  totalAvaliacoes,
  distancia,
  horario,
  servicos,
}: OficinaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">{nome}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-slate-700">{avaliacao.toFixed(1)}</span>
              </div>
              <span className="text-sm text-slate-500">({totalAvaliacoes} avaliacoes)</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
            <Navigation className="w-3 h-3" />
            {distancia}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {endereco}
          </p>
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {telefone}
          </p>
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {horario}
          </p>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {servicos.slice(0, 4).map((servico) => (
            <span
              key={servico}
              className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs"
            >
              {servico}
            </span>
          ))}
          {servicos.length > 4 && (
            <span className="px-2 py-1 text-slate-500 text-xs">
              +{servicos.length - 4} mais
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
            Agendar
          </button>
          <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            Ver mais
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function OficinasPage() {
  // Dados mockados - serao substituidos por dados da API
  const oficinas: OficinaCardProps[] = [
    {
      id: '1',
      nome: 'Auto Center Silva',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 99999-9999',
      avaliacao: 4.8,
      totalAvaliacoes: 156,
      distancia: '1.2 km',
      horario: 'Seg-Sex: 8h-18h | Sab: 8h-12h',
      servicos: ['Troca de oleo', 'Freios', 'Suspensao', 'Alinhamento', 'Balanceamento'],
    },
    {
      id: '2',
      nome: 'Mecanica Santos',
      endereco: 'Av. Brasil, 456 - Jardim',
      telefone: '(11) 98888-8888',
      avaliacao: 4.5,
      totalAvaliacoes: 89,
      distancia: '2.5 km',
      horario: 'Seg-Sex: 7h-19h | Sab: 8h-14h',
      servicos: ['Revisao completa', 'Motor', 'Cambio', 'Ar condicionado'],
    },
    {
      id: '3',
      nome: 'Oficina Rapida',
      endereco: 'Rua Sao Paulo, 789 - Vila Nova',
      telefone: '(11) 97777-7777',
      avaliacao: 4.2,
      totalAvaliacoes: 45,
      distancia: '3.8 km',
      horario: 'Seg-Sab: 8h-20h',
      servicos: ['Troca de oleo', 'Alinhamento', 'Balanceamento', 'Pneus'],
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Encontrar Oficinas</h1>
        <p className="text-slate-500 mt-1">
          Oficinas proximas a voce
        </p>
      </div>

      {/* Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-6"
      >
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800">
            <strong>Dados de exemplo.</strong> A integracao com localizacao e oficinas reais esta em desenvolvimento.
          </p>
        </div>
      </motion.div>

      {/* Oficinas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {oficinas.map((oficina, index) => (
          <motion.div
            key={oficina.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <OficinaCard {...oficina} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
