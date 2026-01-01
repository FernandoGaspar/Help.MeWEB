import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Key, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { api } from '@/services/api'

type Step = 'email' | 'token' | 'newPassword' | 'success'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [login, setLogin] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!login.trim()) {
      setError('Por favor, digite seu usuário ou e-mail')
      return
    }

    setIsLoading(true)
    const result = await api.resetDeSenha(login)
    setIsLoading(false)

    if (result.success) {
      setStep('token')
    } else {
      setError(result.message || 'Erro ao enviar código')
    }
  }

  const handleValidateToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token.trim()) {
      setError('Por favor, digite o código recebido')
      return
    }

    setIsLoading(true)
    const result = await api.validarTokenReset(login, token)
    setIsLoading(false)

    if (result.success) {
      setStep('newPassword')
    } else {
      setError(result.message || 'Código inválido')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setIsLoading(true)
    const result = await api.alterarSenha(login, newPassword, token)
    setIsLoading(false)

    if (result.success) {
      setStep('success')
    } else {
      setError(result.message || 'Erro ao alterar senha')
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
            Senha alterada!
          </h2>
          <p className="text-slate-600 mb-6">
            Sua senha foi alterada com sucesso. Agora você pode fazer login com a nova senha.
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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {['email', 'token', 'newPassword'].map((s, index) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === s
                ? 'bg-primary-600 text-white'
                : ['email', 'token', 'newPassword'].indexOf(step) > index
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {['email', 'token', 'newPassword'].indexOf(step) > index ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < 2 && (
            <div
              className={`w-12 h-1 mx-1 ${
                ['email', 'token', 'newPassword'].indexOf(step) > index
                  ? 'bg-green-500'
                  : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

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
              Recuperar senha
            </h1>
            <p className="text-slate-600">
              {step === 'email' && 'Digite seu usuário para receber o código de recuperação.'}
              {step === 'token' && 'Digite o código enviado para seu e-mail.'}
              {step === 'newPassword' && 'Escolha sua nova senha.'}
            </p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

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

          {/* Step 1: Email/Login */}
          {step === 'email' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRequestCode}
              className="space-y-6"
            >
              <Input
                label="Usuário ou E-mail"
                type="text"
                placeholder="seu.usuario ou email@exemplo.com"
                icon={<Mail className="w-5 h-5" />}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Enviar código
              </Button>
            </motion.form>
          )}

          {/* Step 2: Token */}
          {step === 'token' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleValidateToken}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-700">
                  Enviamos um código de 6 dígitos para o e-mail cadastrado. Verifique também a caixa de spam.
                </p>
              </div>

              <Input
                label="Código de verificação"
                type="text"
                placeholder="Digite o código de 6 dígitos"
                icon={<Key className="w-5 h-5" />}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                maxLength={6}
                required
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep('email')}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  isLoading={isLoading}
                >
                  Validar código
                </Button>
              </div>

              <button
                type="button"
                onClick={handleRequestCode}
                disabled={isLoading}
                className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reenviando...
                  </span>
                ) : (
                  'Reenviar código'
                )}
              </button>
            </motion.form>
          )}

          {/* Step 3: New Password */}
          {step === 'newPassword' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleChangePassword}
              className="space-y-6"
            >
              <Input
                label="Nova senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                icon={<Lock className="w-5 h-5" />}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirmar nova senha"
                type="password"
                placeholder="Repita a nova senha"
                icon={<Lock className="w-5 h-5" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Alterar senha
              </Button>
            </motion.form>
          )}
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
              Recupere seu acesso
            </h2>
            <p className="text-white/80 text-lg">
              Em poucos passos você terá acesso à sua conta novamente.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
