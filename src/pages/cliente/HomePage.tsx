import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PlusCircle,
  MapPin,
  ClipboardList,
  History,
  Clock,
  CheckCircle,
  Wrench,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  description: string
  path: string
  color: 'primary' | 'green' | 'amber' | 'purple'
}

function QuickAction({ icon, label, description, path, color }: QuickActionProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
  }

  return (
    <Link
      to={path}
      className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{label}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </Link>
  )
}

interface ServiceCardProps {
  id: string
  oficina: string
  servico: string
  status: 'aguardando' | 'em_andamento' | 'concluido'
  data: string
}

function ServiceCard({ oficina, servico, status, data }: ServiceCardProps) {
  const statusConfig = {
    aguardando: { label: 'Aguardando', color: 'bg-amber-100 text-amber-700', icon: Clock },
    em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-700', icon: Wrench },
    concluido: { label: 'Concluido', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  }

  const StatusIcon = statusConfig[status].icon

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-slate-900">{servico}</h4>
          <p className="text-sm text-slate-500">{oficina}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig[status].label}
        </span>
      </div>
      <p className="text-xs text-slate-400">{data}</p>
    </div>
  )
}

export function HomePage() {
  const { user } = useAuth()

  // Dados mockados - serao substituidos por dados da API
  const recentServices: ServiceCardProps[] = [
    { id: '1', oficina: 'Auto Center Silva', servico: 'Troca de oleo', status: 'em_andamento', data: 'Hoje, 14:30' },
    { id: '2', oficina: 'Mecanica Santos', servico: 'Revisao dos freios', status: 'aguardando', data: 'Agendado para amanha' },
    { id: '3', oficina: 'Oficina Rapida', servico: 'Alinhamento', status: 'concluido', data: '15/01/2026' },
  ]

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Ola, {user?.name || user?.apelido || 'Cliente'}!
        </h1>
        <p className="text-slate-500 mt-1">
          O que voce precisa hoje?
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <QuickAction
          icon={<PlusCircle className="w-6 h-6" />}
          label="Solicitar Servico"
          description="Agende uma manutencao"
          path="/cliente/solicitar"
          color="primary"
        />
        <QuickAction
          icon={<MapPin className="w-6 h-6" />}
          label="Encontrar Oficinas"
          description="Oficinas proximas a voce"
          path="/cliente/oficinas"
          color="green"
        />
        <QuickAction
          icon={<ClipboardList className="w-6 h-6" />}
          label="Meus Servicos"
          description="Acompanhe seus servicos"
          path="/cliente/servicos"
          color="amber"
        />
        <QuickAction
          icon={<History className="w-6 h-6" />}
          label="Historico"
          description="Servicos anteriores"
          path="/cliente/historico"
          color="purple"
        />
      </motion.div>

      {/* Recent Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Servicos Recentes</h2>
          <Link to="/cliente/servicos" className="text-sm text-primary-600 hover:text-primary-700">
            Ver todos
          </Link>
        </div>

        {recentServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">Nenhum servico ainda</h3>
            <p className="text-sm text-slate-500 mb-4">
              Voce ainda nao solicitou nenhum servico.
            </p>
            <Link
              to="/cliente/solicitar"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Solicitar Servico
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
