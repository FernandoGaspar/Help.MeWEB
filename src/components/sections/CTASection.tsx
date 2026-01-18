import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Smartphone, Apple, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui'

export function CTASection() {
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-[3rem] p-12 lg:p-20 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Pronto para começar?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Baixe o app agora e experimente a forma mais fácil de cuidar do seu veículo.
                Disponível para iOS e Android.
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="#"
                  className="flex items-center gap-3 bg-black hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  <Apple className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-xs text-white/70">Baixe na</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 bg-black hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  <PlayCircle className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-xs text-white/70">Disponível no</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </a>
              </div>

              {/* Or Register */}
              <div className="flex items-center gap-4">
                <span className="text-white/60">ou</span>
                <Link to="/cadastro">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary-700"
                  >
                    Cadastre-se pelo site
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                {/* Phone */}
                <div className="relative z-10 bg-slate-800 rounded-[3rem] p-3 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="w-64 h-[500px] bg-gradient-to-b from-white to-slate-100 rounded-[2.5rem] flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <Smartphone className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Help.Me</h3>
                      <p className="text-sm text-slate-600">Seu veículo em boas mãos</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Ficou com alguma dúvida?
          </h3>
          <p className="text-slate-600 mb-6">
            Entre em contato conosco. Estamos aqui para ajudar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contato@helpme.com.br"
              className="inline-flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              contato@helpme.com.br
            </a>
            <span className="hidden sm:inline text-slate-300">|</span>
            <a
              href="tel:+5511999999999"
              className="inline-flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              (11) 99999-9999
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
