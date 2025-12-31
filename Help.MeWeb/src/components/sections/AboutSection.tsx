import { motion } from 'framer-motion'
import { Target, Eye, Heart, Users, Award, Zap } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Compromisso',
    description: 'Nos dedicamos a entregar a melhor experiência para motoristas e oficinas.',
  },
  {
    icon: Users,
    title: 'Comunidade',
    description: 'Construímos uma comunidade forte entre motoristas e profissionais automotivos.',
  },
  {
    icon: Award,
    title: 'Qualidade',
    description: 'Garantimos que todas as oficinas são verificadas e qualificadas.',
  },
  {
    icon: Zap,
    title: 'Inovação',
    description: 'Sempre buscando novas formas de facilitar o cuidado com seu veículo.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-4">
            Sobre Nós
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Quem somos e no que{' '}
            <span className="text-gradient">acreditamos</span>
          </h2>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left - Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Nossa História
            </h3>
            <div className="space-y-4 text-slate-600">
              <p>
                O Help.Me nasceu da frustração de não encontrar oficinas mecânicas de confiança
                de forma rápida e segura. Em 2024, decidimos criar uma solução que conectasse
                motoristas a profissionais automotivos qualificados.
              </p>
              <p>
                Hoje, somos uma plataforma em crescimento que já ajudou milhares de motoristas
                a cuidarem de seus veículos, enquanto proporcionamos oportunidades
                para oficinas e mecânicos expandirem seus negócios.
              </p>
              <p>
                Nossa missão é simplificar o cuidado com seu veículo, oferecendo uma plataforma
                confiável, transparente e fácil de usar.
              </p>
            </div>
          </motion.div>

          {/* Right - Mission & Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Nossa Missão</h4>
                  <p className="text-slate-600">
                    Conectar motoristas a oficinas de qualidade, promovendo confiança,
                    praticidade e oportunidades para todos.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Nossa Visão</h4>
                  <p className="text-slate-600">
                    Ser a plataforma líder em serviços automotivos no Brasil,
                    reconhecida pela excelência e inovação.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Nossos Valores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  {value.title}
                </h4>
                <p className="text-slate-600 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
