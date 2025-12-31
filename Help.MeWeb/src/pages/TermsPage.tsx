import { motion } from 'framer-motion'
import { Header, Footer } from '@/components/layout'
import { FileText } from 'lucide-react'

export function TermsPage() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Termos de Uso
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
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma Help.Me, você concorda com estes Termos de Uso.
                Se você não concordar com qualquer parte destes termos, não poderá usar nossos
                serviços.
              </p>

              <h2>2. Descrição do Serviço</h2>
              <p>
                O Help.Me é uma plataforma que conecta motoristas a oficinas e profissionais
                do ramo automotivo. Atuamos como intermediários, facilitando o agendamento
                de manutenções e reparos veiculares.
              </p>

              <h2>3. Cadastro de Usuário</h2>
              <p>
                Para utilizar nossos serviços, você deve:
              </p>
              <ul>
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter a confidencialidade de sua senha</li>
                <li>Notificar-nos sobre qualquer uso não autorizado de sua conta</li>
              </ul>

              <h2>4. Responsabilidades dos Usuários</h2>
              <h3>4.1 Motoristas</h3>
              <ul>
                <li>Fornecer informações precisas sobre o veículo e serviço desejado</li>
                <li>Realizar o pagamento conforme acordado</li>
                <li>Avaliar as oficinas de forma justa e honesta</li>
              </ul>

              <h3>4.2 Oficinas e Mecânicos</h3>
              <ul>
                <li>Possuir as qualificações necessárias para os serviços oferecidos</li>
                <li>Cumprir os horários e compromissos agendados</li>
                <li>Executar os serviços com qualidade e profissionalismo</li>
                <li>Manter documentação e licenças atualizadas</li>
              </ul>

              <h2>5. Pagamentos</h2>
              <p>
                Os pagamentos são processados através de nossa plataforma. As taxas e
                condições de pagamento são informadas antes da confirmação do serviço.
              </p>

              <h2>6. Cancelamentos e Reembolsos</h2>
              <p>
                Cancelamentos podem ser realizados de acordo com as políticas específicas
                de cada serviço. Reembolsos serão analisados caso a caso.
              </p>

              <h2>7. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da plataforma, incluindo textos, imagens, logos e software,
                é de propriedade da Help.Me ou de seus licenciadores e está protegido por
                leis de propriedade intelectual.
              </p>

              <h2>8. Limitação de Responsabilidade</h2>
              <p>
                A Help.Me não é responsável pela qualidade dos serviços prestados pelas
                oficinas cadastradas. Atuamos apenas como plataforma de conexão entre
                motoristas e profissionais do ramo automotivo.
              </p>

              <h2>9. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento.
                As alterações entrarão em vigor após publicação na plataforma.
              </p>

              <h2>10. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será
                resolvida nos tribunais da comarca de São Paulo, SP.
              </p>

              <h2>11. Contato</h2>
              <p>
                Para dúvidas sobre estes termos, entre em contato:
              </p>
              <ul>
                <li>E-mail: juridico@helpme.com.br</li>
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
