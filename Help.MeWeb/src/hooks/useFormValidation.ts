import { useState, useCallback, useMemo } from 'react'

export interface ValidationRule {
  test: (value: string) => boolean
  message: string
}

export interface FieldValidation {
  value: string
  touched: boolean
  errors: string[]
  isValid: boolean
}

export interface ValidationResult {
  isValid: boolean
  strength?: number // Para senhas
}

// Validadores comuns
export const validators = {
  required: (message = 'Este campo é obrigatório'): ValidationRule => ({
    test: (value) => value.trim().length > 0,
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => value.length >= min,
    message: message || `Mínimo ${min} caracteres`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => value.length <= max,
    message: message || `Máximo ${max} caracteres`,
  }),

  email: (message = 'E-mail inválido'): ValidationRule => ({
    test: (value) => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
  }),

  password: (message = 'A senha deve ter pelo menos 6 caracteres'): ValidationRule => ({
    test: (value) => value.length >= 6,
    message,
  }),

  match: (getValue: () => string, message = 'Os valores não coincidem'): ValidationRule => ({
    test: (value) => value === getValue(),
    message,
  }),

  noSpaces: (message = 'Não pode conter espaços'): ValidationRule => ({
    test: (value) => !value.includes(' '),
    message,
  }),

  alphanumeric: (message = 'Apenas letras e números'): ValidationRule => ({
    test: (value) => {
      if (!value) return true
      return /^[a-zA-Z0-9._]+$/.test(value)
    },
    message,
  }),
}

// Calcula força da senha
export function calculatePasswordStrength(password: string): {
  score: number // 0-4
  label: string
  color: string
} {
  let score = 0

  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  const labels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte']
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

  const normalizedScore = Math.min(score, 4)

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    color: colors[normalizedScore],
  }
}

// Hook principal
export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule[]>>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    )
  )

  const validateField = useCallback(
    (field: keyof T, value: string): string[] => {
      const rules = validationRules[field]
      if (!rules) return []

      return rules
        .filter((rule) => !rule.test(value))
        .map((rule) => rule.message)
    },
    [validationRules]
  )

  const errors = useMemo(() => {
    return Object.keys(values).reduce((acc, key) => {
      const fieldKey = key as keyof T
      const fieldErrors = validateField(fieldKey, values[fieldKey])
      return { ...acc, [key]: fieldErrors }
    }, {} as Record<keyof T, string[]>)
  }, [values, validateField])

  const isFieldValid = useCallback(
    (field: keyof T): boolean => {
      return errors[field]?.length === 0
    },
    [errors]
  )

  const isFormValid = useMemo(() => {
    return Object.values(errors).every((fieldErrors) => (fieldErrors as string[]).length === 0)
  }, [errors])

  const handleChange = useCallback(
    (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
    },
    []
  )

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const setValue = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }))
  }, [])

  const touchAll = useCallback(() => {
    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      )
    )
  }, [values])

  const reset = useCallback(() => {
    setValues(initialValues)
    setTouched(
      Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      )
    )
  }, [initialValues])

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: touched[field] && errors[field]?.length > 0 ? errors[field][0] : undefined,
      isValid: touched[field] && isFieldValid(field),
    }),
    [values, touched, errors, handleChange, handleBlur, isFieldValid]
  )

  return {
    values,
    errors,
    touched,
    isFormValid,
    handleChange,
    handleBlur,
    setValue,
    setFieldTouched,
    touchAll,
    reset,
    getFieldProps,
    isFieldValid,
    validateField,
  }
}
