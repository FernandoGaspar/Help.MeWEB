import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/layout'
import { Shield } from 'lucide-react'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-lg text-slate-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-slate prose-lg">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2>1. Introdução</h2>
              <p>
                A Help.Me está comprometida com a proteção da sua privacidade. Esta Política de
                Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas
                informações pessoais quando você utiliza nossos serviços.
              </p>

              <h2>2. Informações que Coletamos</h2>
              <p>Coletamos os seguintes tipos de informações:</p>
              <ul>
                <li><strong>Informações de cadastro:</strong> nome, e-mail, telefone, endereço</li>
                <li><strong>Informações de uso:</strong> histórico de serviços automotivos, avaliações, preferências</li>
                <li><strong>Informações de veículo:</strong> modelo, ano, placa (quando fornecido)</li>
                <li><strong>Informações de dispositivo:</strong> tipo de dispositivo, sistema operacional, localização</li>
                <li><strong>Informações de pagamento:</strong> dados necessários para processar transações</li>
              </ul>

              <h2>3. Como Usamos suas Informações</h2>
              <p>Utilizamos suas informações para:</p>
              <ul>
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pedidos e pagamentos</li>
                <li>Enviar comunicações relevantes sobre seus serviços</li>
                <li>Garantir a segurança da plataforma</li>
                <li>Cumprir obrigações legais</li>
              </ul>

              <h2>4. Compartilhamento de Informações</h2>
              <p>
                Compartilhamos suas informações apenas com:
              </p>
              <ul>
                <li>Oficinas e mecânicos contratados por você</li>
                <li>Parceiros de pagamento para processar transações</li>
                <li>Autoridades quando exigido por lei</li>
              </ul>

              <h2>5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas técnicas e organizacionais apropriadas para proteger
                suas informações contra acesso não autorizado, alteração, divulgação ou
                destruição.
              </p>

              <h2>6. Seus Direitos</h2>
              <p>Você tem direito a:</p>
              <ul>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimentos</li>
                <li>Portabilidade dos dados</li>
              </ul>

              <h2>7. Cookies</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência,
                analisar o uso da plataforma e personalizar conteúdo.
              </p>

              <h2>8. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. Notificaremos você sobre
                alterações significativas através do app ou por e-mail.
              </p>

              <h2>9. Contato</h2>
              <p>
                Para dúvidas sobre esta política ou sobre seus dados pessoais, entre em
                contato conosco:
              </p>
              <ul>
                <li>E-mail: privacidade@helpme.com.br</li>
                <li>Telefone: (11) 99999-9999</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
