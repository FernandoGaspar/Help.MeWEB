import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Motorista',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    content: 'Incrível! Consegui uma oficina para revisão do meu carro em menos de 30 minutos. O serviço foi impecável e o preço justo!',
    rating: 5,
  },
  {
    name: 'Carlos Oliveira',
    role: 'Dono de Oficina',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'O Help.Me mudou minha oficina. Agora tenho uma agenda sempre cheia e clientes que confiam no meu trabalho.',
    rating: 5,
  },
  {
    name: 'Ana Paula',
    role: 'Motorista',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'A facilidade de agendar manutenções e acompanhar o reparo pelo app é sensacional. Não preciso mais ficar ligando!',
    rating: 5,
  },
  {
    name: 'Roberto Lima',
    role: 'Mecânico',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    content: 'Plataforma séria e profissional. Os pagamentos são sempre em dia e o suporte é excelente quando preciso.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-primary-900 to-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            O que nossos usuários{' '}
            <span className="text-primary-400">dizem</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Milhares de motoristas já transformaram o cuidado com seus veículos usando o Help.Me
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-white/15 transition-colors duration-300">
                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-primary-400 mb-4" />

                {/* Content */}
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary-400"
                  />
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '10K+', label: 'Motoristas ativos' },
            { value: '500+', label: 'Oficinas parceiras' },
            { value: '25K+', label: 'Veículos atendidos' },
            { value: '4.9', label: 'Avaliação média' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
