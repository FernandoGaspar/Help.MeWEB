import { motion } from 'framer-motion'
import { Search, Calendar, CheckCircle, Star } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Encontre a oficina',
    description: 'Busque pelo serviço automotivo que precisa e veja as oficinas disponíveis na sua região.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Agende o serviço',
    description: 'Escolha a oficina, selecione a data e horário que melhor se encaixam na sua rotina.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Veículo reparado',
    description: 'Acompanhe o andamento do reparo e receba notificações quando estiver pronto.',
    color: 'from-green-500 to-green-600',
  },
  {
    number: '04',
    icon: Star,
    title: 'Avalie a oficina',
    description: 'Compartilhe sua experiência e ajude outros motoristas a escolherem bem.',
    color: 'from-yellow-500 to-yellow-600',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">
            Como Funciona
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Simples assim, em{' '}
            <span className="text-gradient">4 passos</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Cuidar do seu veículo nunca foi tão fácil. Veja como funciona:
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-yellow-500" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300 relative z-10">
                  {/* Number Badge */}
                  <div className={`absolute -top-4 left-8 px-4 py-1 bg-gradient-to-r ${step.color} rounded-full text-white text-sm font-bold shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 mt-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow (Mobile/Tablet) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-400 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
