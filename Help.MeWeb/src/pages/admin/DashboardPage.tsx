import { motion } from 'framer-motion'
import {
  ClipboardList,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
  color: 'blue' | 'green' | 'amber' | 'purple'
}

function StatCard({ icon, label, value, trend, trendUp, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

interface RecentOrderProps {
  id: string
  cliente: string
  servico: string
  status: 'aguardando' | 'em_andamento' | 'concluido'
  data: string
}

function RecentOrderCard({ cliente, servico, status, data }: RecentOrderProps) {
  const statusConfig = {
    aguardando: { label: 'Aguardando', color: 'bg-amber-100 text-amber-700' },
    em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-700' },
    concluido: { label: 'Concluido', color: 'bg-green-100 text-green-700' },
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-slate-900">{cliente}</p>
        <p className="text-sm text-slate-500">{servico}</p>
      </div>
      <div className="text-right">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </span>
        <p className="text-xs text-slate-400 mt-1">{data}</p>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()

  // Dados mockados - serao substituidos por dados da API
  const stats = {
    totalPedidos: 156,
    pedidosHoje: 12,
    emAndamento: 8,
    concluidos: 134,
  }

  const recentOrders: RecentOrderProps[] = [
    { id: '1', cliente: 'Joao Silva', servico: 'Troca de oleo', status: 'em_andamento', data: 'Hoje, 14:30' },
    { id: '2', cliente: 'Maria Santos', servico: 'Revisao completa', status: 'aguardando', data: 'Hoje, 13:00' },
    { id: '3', cliente: 'Carlos Oliveira', servico: 'Alinhamento', status: 'concluido', data: 'Hoje, 11:20' },
    { id: '4', cliente: 'Ana Pereira', servico: 'Balanceamento', status: 'em_andamento', data: 'Hoje, 10:45' },
    { id: '5', cliente: 'Pedro Costa', servico: 'Freios', status: 'aguardando', data: 'Ontem, 16:30' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          Ola, {user?.name || user?.apelido || 'Administrador'}!
        </motion.h1>
        <p className="text-slate-500 mt-1">
          Aqui esta o resumo da sua oficina hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<ClipboardList className="w-6 h-6" />}
          label="Total de Pedidos"
          value={stats.totalPedidos}
          trend="+12% este mes"
          trendUp={true}
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Pedidos Hoje"
          value={stats.pedidosHoje}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Em Andamento"
          value={stats.emAndamento}
          color="amber"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Concluidos"
          value={stats.concluidos}
          trend="86% taxa de conclusao"
          trendUp={true}
          color="green"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Pedidos Recentes</h2>
            <a href="/admin/pedidos" className="text-sm text-primary-600 hover:text-primary-700">
              Ver todos
            </a>
          </div>
          <div>
            {recentOrders.map((order) => (
              <RecentOrderCard key={order.id} {...order} />
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Alertas</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">3 pedidos aguardando</p>
                <p className="text-xs text-amber-600">Ha mais de 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">2 novos clientes</p>
                <p className="text-xs text-blue-600">Cadastrados hoje</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
