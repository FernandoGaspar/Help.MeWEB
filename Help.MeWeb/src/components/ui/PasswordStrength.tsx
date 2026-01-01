import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' }

    let score = 0
    const checks = {
      length: password.length >= 6,
      lengthGood: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    }

    if (checks.length) score++
    if (checks.lengthGood) score++
    if (checks.lowercase && checks.uppercase) score++
    if (checks.number) score++
    if (checks.special) score++

    const levels = [
      { label: 'Muito fraca', color: 'bg-red-500' },
      { label: 'Fraca', color: 'bg-orange-500' },
      { label: 'Média', color: 'bg-yellow-500' },
      { label: 'Forte', color: 'bg-lime-500' },
      { label: 'Muito forte', color: 'bg-green-500' },
    ]

    const normalizedScore = Math.min(score, 4)

    return {
      score: normalizedScore,
      ...levels[normalizedScore],
    }
  }, [password])

  if (!password) return null

  return (
    <div className={cn('mt-2', className)}>
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              index <= strength.score ? strength.color : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      <p className={cn(
        'text-xs font-medium transition-colors',
        strength.score <= 1 ? 'text-red-600' :
        strength.score === 2 ? 'text-yellow-600' :
        'text-green-600'
      )}>
        Força: {strength.label}
      </p>
    </div>
  )
}
