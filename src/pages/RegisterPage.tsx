import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowLeft, AlertCircle, CheckCircle, Phone } from 'lucide-react'
import { Button, Input, PasswordStrength } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { UserProfile } from '@/types/auth'
import { LOGISTICA_ENABLED } from '@/services/logistica'

type UserType = 'cliente' | 'prestador' | 'transportadora'

const USER_TYPES: { value: UserType; label: string }[] = [
  { value: 'cliente', label: 'Sou Cliente' },
  { value: 'prestador', label: 'Sou Oficina' },
  ...(LOGISTICA_ENABLED ? [{ value: 'transportadora' as UserType, label: 'Sou Transportadora' }] : []),
]

const PERFIL_POR_TIPO: Record<UserType, number> = {
  cliente: UserProfile.CLIENTE_FINAL,
  prestador: UserProfile.ADMINISTRATIVO,
  transportadora: UserProfile.MOTORISTA,
}

// Validadores
const somenteDigitos = (value: string) => value.replace(/\D/g, '')
const isValidPhone = (phone: string) => { const n = somenteDigitos(phone).length; return n >= 10 && n <= 13 }
const isValidTaxId = (doc: string) => [11, 14].includes(somenteDigitos(doc).length)
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidUsername = (username: string) => /^[a-zA-Z0-9._]+$/.test(username) && username.length >= 3
const isValidFullName = (name: string) => {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2 && parts.every(part => part.length >= 2)
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<UserType>('cliente')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    login: '',
    password: '',
    confirmPassword: '',
    company: '',
    taxId: '',
    drives: true,
    phone: '',
    acceptTerms: false,
  })

  // Validações em tempo real
  const validations = useMemo(() => ({
    name: {
      isValid: isValidFullName(formData.name),
      error: formData.name.trim().length > 0 && !isValidFullName(formData.name)
        ? 'Digite seu nome completo (nome e sobrenome)' : '',
    },
    email: {
      isValid: isValidEmail(formData.email),
      error: formData.email.length > 0 && !isValidEmail(formData.email)
        ? 'Digite um e-mail válido' : '',
    },
    login: {
      isValid: isValidUsername(formData.login),
      error: formData.login.length > 0 && !isValidUsername(formData.login)
        ? 'Apenas letras, números e pontos (mín. 3 caracteres)' : '',
    },
    password: {
      isValid: formData.password.length >= 6,
      error: formData.password.length > 0 && formData.password.length < 6
        ? 'Mínimo 6 caracteres' : '',
    },
    confirmPassword: {
      isValid: formData.confirmPassword === formData.password && formData.confirmPassword.length > 0,
      error: formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password
        ? 'As senhas não coincidem' : '',
    },
    taxId: {
      isValid: isValidTaxId(formData.taxId),
      error: formData.taxId.length > 0 && !isValidTaxId(formData.taxId)
        ? 'Digite o CNPJ ou o CPF' : '',
    },
    phone: {
      isValid: isValidPhone(formData.phone),
      error: formData.phone.length > 0 && !isValidPhone(formData.phone)
        ? 'Digite o celular com DDD' : '',
    },
  }), [formData])

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Tela de sucesso após cadastro
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-600 via-secondary-700 to-primary-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Cadastro realizado!
          </h2>
          <p className="text-slate-600 mb-6">
            Sua conta foi criada com sucesso. Agora você pode fazer login.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validações
    if (!formData.name.trim()) {
      setError('Por favor, digite seu nome')
      return
    }

    if (!formData.email.trim()) {
      setError('Por favor, digite seu e-mail')
      return
    }

    if (!formData.login.trim()) {
      setError('Por favor, escolha um nome de usuário')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (userType === 'transportadora') {
      if (!formData.company.trim()) { setError('Informe o nome da transportadora'); return }
      if (!isValidTaxId(formData.taxId)) { setError('Informe o CNPJ ou o CPF da transportadora'); return }
      if (!isValidPhone(formData.phone)) { setError('Informe seu celular com DDD'); return }
    }

    if (!formData.acceptTerms) {
      setError('Você precisa aceitar os termos de uso')
      return
    }

    // Cliente = 4, Oficina (Administrativo) = 1, Motorista de entregas = 5
    const idPerfilUsuario = PERFIL_POR_TIPO[userType]

    const result = await register({
      nome: formData.name,
      email: formData.email,
      login: formData.login,
      senha: formData.password,
      companhia: (userType !== 'cliente' && formData.company.trim()) || formData.name,
      idPerfilUsuario,
      ...(userType === 'transportadora' ? {
        telefone: somenteDigitos(formData.phone), documento: somenteDigitos(formData.taxId), dirige: formData.drives,
      } : {}),
    })

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.message || 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8"
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
              Crie sua conta
            </h1>
            <p className="text-slate-600">
              Comece agora mesmo a usar a Help.Me
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="bg-slate-100 rounded-xl p-1 flex mb-8">
            {USER_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setUserType(value)}
                className={cn(
                  'flex-1 py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-200',
                  userType === value
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-primary-700">
              {userType === 'cliente' && (
                <>
                  <strong>Como cliente</strong>, você poderá agendar manutenções, acompanhar
                  reparos e avaliar oficinas.
                </>
              )}
              {userType === 'prestador' && (
                <>
                  <strong>Como oficina</strong>, você poderá oferecer seus serviços,
                  gerenciar sua agenda e aumentar sua clientela.
                </>
              )}
              {userType === 'transportadora' && (
                <>
                  <strong>Como transportadora</strong>, você cadastra seus motoristas e veículos. Os
                  motoristas recebem os romaneios e confirmam cada entrega com foto do comprovante.
                  Se você trabalha sozinho, marque que também faz as entregas.
                </>
              )}
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              icon={<User className="w-5 h-5" />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => handleBlur('name')}
              error={touched.name ? validations.name.error : undefined}
              isValid={touched.name && validations.name.isValid}
              required
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              error={touched.email ? validations.email.error : undefined}
              isValid={touched.email && validations.email.isValid}
              required
            />

            <Input
              label="Nome de usuário"
              type="text"
              placeholder="seu.usuario"
              icon={<User className="w-5 h-5" />}
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              onBlur={() => handleBlur('login')}
              error={touched.login ? validations.login.error : undefined}
              isValid={touched.login && validations.login.isValid}
              hint="Apenas letras, números e pontos"
              required
            />

            {userType === 'prestador' && (
              <Input
                label="Nome da oficina (opcional)"
                type="text"
                placeholder="Sua oficina"
                icon={<Building2 className="w-5 h-5" />}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            )}

            {userType === 'transportadora' && (<>
              <Input
                label="Nome da transportadora"
                type="text"
                placeholder="Transportes Silva ou seu nome, se trabalha sozinho"
                icon={<Building2 className="w-5 h-5" />}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                maxLength={150}
                required
              />
              <Input
                label="CNPJ ou CPF"
                type="text"
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                icon={<Building2 className="w-5 h-5" />}
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                onBlur={() => handleBlur('taxId')}
                error={touched.taxId ? validations.taxId.error : undefined}
                isValid={touched.taxId && validations.taxId.isValid}
                required
              />
              <Input
                label="Celular com DDD"
                type="tel"
                inputMode="tel"
                placeholder="(11) 99999-0000"
                icon={<Phone className="w-5 h-5" />}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onBlur={() => handleBlur('phone')}
                error={touched.phone ? validations.phone.error : undefined}
                isValid={touched.phone && validations.phone.isValid}
                hint="A empresa contratante usa este número para contato"
                required
              />
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-primary-600"
                  checked={formData.drives}
                  onChange={(e) => setFormData({ ...formData, drives: e.target.checked })}
                />
                Eu também faço as entregas
              </label>
            </>)}

            <div>
              <div className="relative">
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  icon={<Lock className="w-5 h-5" />}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => handleBlur('password')}
                  error={touched.password ? validations.password.error : undefined}
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
              <PasswordStrength password={formData.password} />
            </div>

            <Input
              label="Confirmar senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repita a senha"
              icon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword ? validations.confirmPassword.error : undefined}
              isValid={touched.confirmPassword && validations.confirmPassword.isValid}
              required
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required
              />
              <span className="text-sm text-slate-600">
                Li e concordo com os{' '}
                <Link to="/termos" className="text-primary-600 hover:underline">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link to="/privacidade" className="text-primary-600 hover:underline">
                  Política de Privacidade
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Criar conta
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-500">ou</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social Login */}
          <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-slate-600 font-medium">Cadastrar com Google</span>
          </button>

          {/* Login Link */}
          <p className="mt-8 text-center text-slate-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Faça login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center p-12 relative overflow-hidden sticky top-0 h-screen">
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
              {{ cliente: 'Seu veículo em boas mãos', prestador: 'Expanda sua oficina',
                transportadora: 'Suas entregas na palma da mão' }[userType]}
            </h2>
            <p className="text-white/80 text-lg">
              {{ cliente: 'Acesse sua conta e gerencie suas manutenções, acompanhe reparos e muito mais.',
                prestador: 'Alcance mais clientes, gerencie sua agenda e cresça com a gente.',
                transportadora: 'Gerencie motoristas e veículos e confirme cada entrega pelo celular.' }[userType]}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
