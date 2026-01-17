import { motion } from 'framer-motion'
import { ArrowLeft, Car, Wrench, MapPin, Calendar, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@/components/ui'

export function SolicitarServicoPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cliente"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Solicitar Servico</h1>
        <p className="text-slate-500 mt-1">
          Preencha os dados para solicitar um servico
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Em breve!</strong> Esta funcionalidade esta sendo desenvolvida.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Por enquanto, entre em contato diretamente com a oficina.
              </p>
            </div>
          </div>

          {/* Vehicle Section */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-slate-400" />
              Dados do Veiculo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Placa"
                placeholder="ABC-1234"
                disabled
              />
              <Input
                label="Modelo"
                placeholder="Ex: Civic 2020"
                disabled
              />
            </div>
          </div>

          {/* Service Section */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-slate-400" />
              Tipo de Servico
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Troca de Oleo', 'Freios', 'Revisao', 'Alinhamento', 'Suspensao', 'Outros'].map((service) => (
                <button
                  key={service}
                  disabled
                  className="p-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-400" />
              Localizacao
            </h3>
            <Input
              label="Endereco"
              placeholder="Seu endereco ou oficina preferida"
              disabled
            />
          </div>

          {/* Schedule Section */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Agendamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Data preferida"
                type="date"
                disabled
              />
              <Input
                label="Horario"
                type="time"
                disabled
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descricao do problema (opcional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50"
              rows={4}
              placeholder="Descreva o problema ou servico necessario..."
              disabled
            />
          </div>

          {/* Submit */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled
          >
            Solicitar Servico
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
