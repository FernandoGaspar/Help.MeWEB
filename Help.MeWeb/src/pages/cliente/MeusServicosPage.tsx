import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Clock,
  CheckCircle,
  Wrench,
  MapPin,
  Phone,
  ArrowRight,
  PlusCircle,
} from 'lucide-react'

interface ServiceCardProps {
  id: string
  oficina: string
  endereco: string
  telefone: string
  servico: string
  status: 'aguardando' | 'em_andamento' | 'concluido'
  dataAgendamento: string
  ultimaAtualizacao: string
}

function ServiceCard({
  oficina,
  endereco,
  telefone,
  servico,
  status,
  dataAgendamento,
  ultimaAtualizacao,
}: ServiceCardProps) {
  const statusConfig = {
    aguardando: {
      label: 'Aguardando Confirmacao',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: Clock,
      description: 'A oficina ainda nao confirmou o agendamento',
    },
    em_andamento: {
      label: 'Em Andamento',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Wrench,
      description: 'Seu veiculo esta sendo atendido',
    },
    concluido: {
      label: 'Concluido',
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: CheckCircle,
      description: 'Servico finalizado',
    },
  }

  const StatusIcon = statusConfig[status].icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      {/* Status Banner */}
      <div className={`px-4 py-2 ${statusConfig[status].color} border-b flex items-center gap-2`}>
        <StatusIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{statusConfig[status].label}</span>
      </div>

      <div className="p-6">
        {/* Service Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{servico}</h3>
          <p className="text-sm text-slate-500">{statusConfig[status].description}</p>
        </div>

        {/* Oficina Info */}
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <h4 className="font-medium text-slate-900 mb-2">{oficina}</h4>
          <div className="space-y-1">
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              {endereco}
            </p>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              {telefone}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Agendado: {dataAgendamento}</span>
          <span>Atualizado: {ultimaAtualizacao}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            Ver detalhes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function MeusServicosPage() {
  // Dados mockados - serao substituidos por dados da API
  const servicos: ServiceCardProps[] = [
    {
      id: '1',
      oficina: 'Auto Center Silva',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 99999-9999',
      servico: 'Troca de oleo e filtros',
      status: 'em_andamento',
      dataAgendamento: '17/01/2026, 14:00',
      ultimaAtualizacao: 'Hoje, 15:30',
    },
    {
      id: '2',
      oficina: 'Mecanica Santos',
      endereco: 'Av. Brasil, 456 - Jardim',
      telefone: '(11) 98888-8888',
      servico: 'Revisao dos freios',
      status: 'aguardando',
      dataAgendamento: '18/01/2026, 10:00',
      ultimaAtualizacao: 'Hoje, 12:00',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus Servicos</h1>
          <p className="text-slate-500 mt-1">
            Acompanhe seus servicos em andamento
          </p>
        </div>
        <Link
          to="/cliente/solicitar"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Servico
        </Link>
      </div>

      {/* Services List */}
      {servicos.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {servicos.map((servico, index) => (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard {...servico} />
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
            <Wrench className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 mb-2">Nenhum servico em andamento</h3>
          <p className="text-sm text-slate-500 mb-4">
            Voce nao tem servicos ativos no momento.
          </p>
          <Link
            to="/cliente/solicitar"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Solicitar Servico
          </Link>
        </motion.div>
      )}
    </div>
  )
}
