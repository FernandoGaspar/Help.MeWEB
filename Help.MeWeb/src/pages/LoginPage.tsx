import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, isAuthenticated, user } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    login: '',
    senha: '',
  })

  // Se já estiver autenticado, mostrar mensagem de sucesso
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Bem-vindo, {user.apelido || user.name}!
          </h2>
          <p className="text-slate-600 mb-6">
            Login realizado com sucesso.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => window.location.href = 'http://app.helpmebr.com.br'}
            >
              Acessar o App
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Voltar para o site
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.login.trim()) {
      setError('Por favor, digite seu usuário')
      return
    }

    if (!formData.senha.trim()) {
      setError('Por favor, digite sua senha')
      return
    }

    const result = await login({
      login: formData.login,
      senha: formData.senha,
    })

    if (!result.success) {
      setError(result.message || 'Erro ao fazer login')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </Link>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img
              src="/logo.jpg"
              alt="Help.Me Logo"
              className="w-12 h-12 rounded-xl shadow-lg"
            />
            <span className="text-3xl font-bold text-slate-900">
              Help<span className="text-primary-600">.Me</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bem-vindo de volta!
            </h1>
            <p className="text-slate-600">
              Entre com suas credenciais para acessar sua conta.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Usuário"
              type="text"
              placeholder="seu.usuario"
              icon={<User className="w-5 h-5" />}
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                icon={<Lock className="w-5 h-5" />}
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">Lembrar-me</span>
              </label>
              <Link
                to="/recuperar-senha"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-500">ou</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-slate-600 font-medium">Continuar com Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-slate-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-primary-600 hover:text-primary-700 font-semibold">
              Cadastre-se grátis
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="/logo_transparente.png"
              alt="Help.Me Logo"
              className="w-24 h-24 mx-auto mb-8"
            />
            <h2 className="text-4xl font-bold mb-4">
              Seu veículo em boas mãos
            </h2>
            <p className="text-white/80 text-lg">
              Acesse sua conta e gerencie suas manutenções, acompanhe reparos e muito mais.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
