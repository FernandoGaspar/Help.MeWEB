import { motion } from 'framer-motion'
import {
  Calendar,
  Shield,
  Clock,
  Star,
  MapPin,
  Bell,
  CreditCard,
  MessageSquare
} from 'lucide-react'
import { Card } from '@/components/ui'

const features = [
  {
    icon: Calendar,
    title: 'Agendamento Fácil',
    description: 'Agende manutenções e reparos em poucos cliques, escolhendo o melhor horário para você.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Oficinas Verificadas',
    description: 'Todas as oficinas passam por verificação rigorosa de qualidade e credenciais.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Clock,
    title: 'Acompanhamento em Tempo Real',
    description: 'Saiba exatamente o status do reparo do seu veículo em cada etapa.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Star,
    title: 'Avaliações Transparentes',
    description: 'Veja avaliações reais de outros motoristas antes de escolher uma oficina.',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: MapPin,
    title: 'Oficinas Próximas',
    description: 'Encontre as melhores oficinas e mecânicos na sua região rapidamente.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Bell,
    title: 'Lembretes de Manutenção',
    description: 'Receba lembretes sobre revisões, trocas de óleo e manutenções preventivas.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: CreditCard,
    title: 'Pagamento Seguro',
    description: 'Pague com segurança diretamente pelo app, parcelando se precisar.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: MessageSquare,
    title: 'Chat com a Oficina',
    description: 'Converse diretamente com o mecânico antes e durante o serviço.',
    color: 'from-pink-500 to-pink-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Tudo que você precisa em um{' '}
            <span className="text-gradient">só lugar</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Desenvolvemos cada funcionalidade pensando na sua experiência,
            para tornar o processo de contratação de serviços simples e eficiente.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card
                hover
                variant="gradient"
                className="h-full group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
