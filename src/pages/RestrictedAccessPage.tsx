import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Smartphone, ArrowLeft, LogOut } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

export function RestrictedAccessPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md w-full"
      >
        {/* Icon */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Smartphone className="w-10 h-10 text-amber-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Acesso Restrito
        </h1>

        {/* User info */}
        {user && (
          <p className="text-sm text-slate-500 mb-4">
            Ola, {user.name || user.apelido || 'Usuario'}
          </p>
        )}

        {/* Message */}
        <p className="text-slate-600 mb-6 leading-relaxed">
          Esta versao web e exclusiva para <strong>Administradores</strong> e <strong>Clientes</strong>.
        </p>

        <p className="text-slate-600 mb-8 leading-relaxed">
          Como <strong>{user?.role === 'operador' ? 'Operador' : 'Master'}</strong>, voce deve utilizar o
          <strong className="text-primary-600"> aplicativo movel Help.Me</strong> para acessar todas as funcionalidades.
        </p>

        {/* App Download Info */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-700 mb-2">
            Baixe o aplicativo:
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Google Play
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              App Store
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </Button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-primary-600 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a pagina inicial
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
