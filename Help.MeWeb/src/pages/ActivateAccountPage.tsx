import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, AlertCircle, CheckCircle, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { api } from '@/services/api'

type Step = 'validating' | 'setPassword' | 'success' | 'error'

interface TokenData {
  idUsuario: number
  nomeUsuario: string
  email: string
}

export function ActivateAccountPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [step, setStep] = useState<Step>('validating')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validar token ao carregar a pagina
  useEffect(() => {
    if (!token) {
      setError('Token de ativacao nao encontrado na URL')
      setStep('error')
      return
    }

    validateToken()
  }, [token])

  const validateToken = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await api.validarTokenAtivacao(token)

      if (result.valido) {
        setTokenData({
          idUsuario: result.idUsuario,
          nomeUsuario: result.nomeUsuario,
          email: result.email,
        })
        setStep('setPassword')
      } else {
        setError(result.mensagem || 'Token invalido ou expirado')
        setStep('error')
      }
    } catch {
      setError('Erro ao validar token. Tente novamente.')
      setStep('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas nao coincidem')
      return
    }

    setIsLoading(true)

    try {
      const result = await api.ativarConta(token, newPassword)

      if (result.status === 'sucesso') {
        setStep('success')
      } else {
        setError(result.mensagem || 'Erro ao ativar conta')
      }
    } catch {
      setError('Erro ao ativar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!tokenData?.email) return

    setIsLoading(true)
    setError('')

    try {
      const result = await api.reenviarEmailAtivacao(tokenData.email)

      if (result.status === 'sucesso') {
        setError('')
        alert('Um novo e-mail de ativacao foi enviado!')
      } else {
        setError(result.mensagem || 'Erro ao reenviar e-mail')
      }
    } catch {
      setError('Erro ao reenviar e-mail')
    } finally {
      setIsLoading(false)
    }
  }

  // Tela de sucesso
  if (step === 'success') {
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
            Conta ativada!
          </h2>
          <p className="text-slate-600 mb-6">
            Sua conta foi ativada com sucesso. Agora voce pode fazer login com seu e-mail e a senha que acabou de criar.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Ir para o Login
          </Button>
        </motion.div>
      </div>
    )
  }

  // Tela de erro (token invalido)
  if (step === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Link invalido
          </h2>
          <p className="text-slate-600 mb-6">
            {error || 'O link de ativacao e invalido ou expirado.'}
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Ir para o Login
            </Button>
            <p className="text-sm text-slate-500">
              Se voce ja tem uma conta, faca login normalmente. Caso contrario, entre em contato com o suporte.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Tela de carregamento (validando token)
  if (step === 'validating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4"
        >
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Validando...
          </h2>
          <p className="text-slate-600">
            Aguarde enquanto verificamos seu link de ativacao.
          </p>
        </motion.div>
      </div>
    )
  }

  // Tela principal - Definir senha
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
            to="/login"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bem-vindo, {tokenData?.nomeUsuario}!
            </h1>
            <p className="text-slate-600">
              Crie uma senha para ativar sua conta.
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
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleActivateAccount}
            className="space-y-6"
          >
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <strong>E-mail:</strong> {tokenData?.email}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Voce usara este e-mail para fazer login.
              </p>
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                label="Nova senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimo 6 caracteres"
                icon={<Lock className="w-5 h-5" />}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirmar senha"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repita a nova senha"
                icon={<Lock className="w-5 h-5" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Ativar minha conta
            </Button>
          </motion.form>
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
              Ative sua conta
            </h2>
            <p className="text-white/80 text-lg">
              Defina sua senha para comecar a usar o Help.Me e acompanhar seus servicos.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
