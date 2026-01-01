import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowLeft, Search, MessageCircle, Car, Wrench, CreditCard, Shield, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  icon: React.ReactNode
  items: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    id: 'geral',
    title: 'Geral',
    icon: <HelpCircle className="w-5 h-5" />,
    items: [
      {
        question: 'O que é a Help.Me?',
        answer: 'A Help.Me é uma plataforma que conecta motoristas a oficinas mecânicas de confiança. Facilitamos o agendamento de serviços, acompanhamento de manutenções e avaliação de oficinas, tudo em um só lugar.',
      },
      {
        question: 'A Help.Me é gratuita?',
        answer: 'Sim! O uso da plataforma é totalmente gratuito para motoristas. As oficinas parceiras pagam uma pequena taxa para utilizar nossos serviços de gestão.',
      },
      {
        question: 'Como faço para criar uma conta?',
        answer: 'Clique em "Cadastre-se" no menu superior, preencha seus dados básicos e pronto! Você também pode se cadastrar usando sua conta Google para mais praticidade.',
      },
      {
        question: 'Posso usar a Help.Me em qualquer cidade?',
        answer: 'Estamos expandindo constantemente. Atualmente, operamos nas principais cidades do Brasil. Verifique a disponibilidade na sua região ao criar sua conta.',
      },
    ],
  },
  {
    id: 'clientes',
    title: 'Para Motoristas',
    icon: <Car className="w-5 h-5" />,
    items: [
      {
        question: 'Como encontro uma oficina próxima?',
        answer: 'Ao acessar o app, você verá uma lista de oficinas próximas à sua localização. Pode filtrar por tipo de serviço, avaliações e distância para encontrar a melhor opção.',
      },
      {
        question: 'Como agendar um serviço?',
        answer: 'Escolha a oficina desejada, selecione o tipo de serviço, escolha uma data e horário disponível e confirme o agendamento. Você receberá uma confirmação por e-mail e notificação no app.',
      },
      {
        question: 'Posso cancelar um agendamento?',
        answer: 'Sim, você pode cancelar um agendamento até 24 horas antes do horário marcado sem nenhuma penalidade. Cancelamentos em cima da hora podem afetar sua reputação na plataforma.',
      },
      {
        question: 'Como acompanho o status do meu veículo?',
        answer: 'Após deixar seu veículo na oficina, você pode acompanhar o progresso do serviço em tempo real pelo app. A oficina atualiza cada etapa do processo.',
      },
      {
        question: 'Como avalio uma oficina?',
        answer: 'Após a conclusão do serviço, você receberá uma notificação para avaliar a oficina. Suas avaliações ajudam outros motoristas a escolherem os melhores profissionais.',
      },
    ],
  },
  {
    id: 'oficinas',
    title: 'Para Oficinas',
    icon: <Wrench className="w-5 h-5" />,
    items: [
      {
        question: 'Como cadastro minha oficina?',
        answer: 'Acesse nosso site, clique em "Cadastre-se" e selecione "Sou Oficina". Preencha os dados da sua empresa, documentação necessária e aguarde a aprovação da nossa equipe.',
      },
      {
        question: 'Quanto custa para oficinas utilizarem a plataforma?',
        answer: 'Oferecemos diferentes planos para oficinas, desde um plano básico gratuito com funcionalidades limitadas até planos premium com recursos avançados de gestão. Entre em contato para mais detalhes.',
      },
      {
        question: 'Como gerencio minha agenda?',
        answer: 'O painel da oficina oferece uma visão completa da sua agenda. Você pode definir horários disponíveis, bloquear períodos e gerenciar todos os agendamentos em um só lugar.',
      },
      {
        question: 'Como recebo pelos serviços?',
        answer: 'O pagamento é feito diretamente entre o cliente e a oficina. A Help.Me não intermedia pagamentos, apenas facilita a conexão e agendamento.',
      },
    ],
  },
  {
    id: 'pagamentos',
    title: 'Pagamentos',
    icon: <CreditCard className="w-5 h-5" />,
    items: [
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'As formas de pagamento dependem de cada oficina. A maioria aceita dinheiro, cartões de crédito/débito e PIX. Consulte as opções disponíveis na página da oficina.',
      },
      {
        question: 'A Help.Me guarda meus dados de pagamento?',
        answer: 'Não armazenamos dados de cartão de crédito. Todos os pagamentos são processados diretamente pela oficina escolhida.',
      },
      {
        question: 'Posso parcelar serviços?',
        answer: 'O parcelamento depende das condições oferecidas por cada oficina. Verifique diretamente com a oficina escolhida as opções de pagamento disponíveis.',
      },
    ],
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        question: 'Como a Help.Me verifica as oficinas?',
        answer: 'Todas as oficinas passam por um processo de verificação que inclui análise de documentação, visita técnica e avaliação de histórico. Apenas oficinas aprovadas aparecem na plataforma.',
      },
      {
        question: 'Meus dados estão seguros?',
        answer: 'Sim! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança da informação. Seus dados são tratados de acordo com a LGPD.',
      },
      {
        question: 'O que faço se tiver um problema com uma oficina?',
        answer: 'Entre em contato conosco pelo suporte no app ou pelo e-mail suporte@helpmebr.com.br. Nossa equipe analisará o caso e tomará as medidas necessárias.',
      },
      {
        question: 'As oficinas têm garantia dos serviços?',
        answer: 'Incentivamos todas as oficinas parceiras a oferecerem garantia em seus serviços. A garantia específica varia de acordo com cada oficina e tipo de serviço realizado.',
      },
    ],
  },
]

function FAQAccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-4 flex items-center justify-between text-left hover:text-primary-600 transition-colors"
      >
        <span className="font-medium text-slate-900 pr-4">{item.question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180 text-primary-600'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-slate-600 leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('geral')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (question: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(question)) {
        newSet.delete(question)
      } else {
        newSet.add(question)
      }
      return newSet
    })
  }

  // Filtrar FAQs por busca
  const filteredData = searchQuery
    ? faqData.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.items.length > 0)
    : faqData

  const currentCategory = searchQuery
    ? filteredData
    : filteredData.filter((cat) => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Dúvidas Frequentes</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Encontre respostas para as perguntas mais comuns sobre a Help.Me.
            Não encontrou o que procurava? Entre em contato conosco!
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar pergunta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          {!searchQuery && (
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="bg-white rounded-xl p-2 shadow-sm sticky top-4">
                {faqData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all',
                      activeCategory === category.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {category.icon}
                    {category.title}
                  </button>
                ))}
              </nav>
            </aside>
          )}

          {/* FAQ Items */}
          <div className="flex-1">
            {searchQuery && filteredData.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-slate-600">
                  Tente buscar com outras palavras ou{' '}
                  <Link to="/contato" className="text-primary-600 hover:underline">
                    entre em contato conosco
                  </Link>
                </p>
              </div>
            ) : (
              currentCategory.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm mb-6"
                >
                  {searchQuery && (
                    <div className="flex items-center gap-2 px-6 pt-4 text-slate-500 text-sm">
                      {category.icon}
                      {category.title}
                    </div>
                  )}
                  <div className="p-6">
                    {category.items.map((item) => (
                      <FAQAccordionItem
                        key={item.question}
                        item={item}
                        isOpen={openItems.has(item.question)}
                        onClick={() => toggleItem(item.question)}
                      />
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Ainda tem dúvidas?</h2>
          <p className="text-white/80 mb-6">
            Nossa equipe está pronta para ajudar você!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:suporte@helpmebr.com.br"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Fale Conosco
            </a>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
            >
              Acessar minha conta
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <Link to="/" className="hover:text-primary-600">
            Help.Me
          </Link>{' '}
          &copy; {new Date().getFullYear()} - Todos os direitos reservados
        </div>
      </footer>
    </div>
  )
}
