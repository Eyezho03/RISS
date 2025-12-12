import { useState, useCallback, useEffect } from 'react'
import { Validator, ValidationResult } from '@/utils/validation'

export interface UseFormValidationOptions {
  validator: Validator
  validateOnChange?: boolean
  validateOnBlur?: boolean
  debounceMs?: number
}

export function useFormValidation<T extends string = string>(
  initialValue: T,
  options: UseFormValidationOptions
) {
  const { validator, validateOnChange = true, validateOnBlur = true, debounceMs = 300 } = options

  const [value, setValue] = useState<T>(initialValue)
  const [touched, setTouched] = useState(false)
  const [result, setResult] = useState<ValidationResult>(() => validator.validate(initialValue))

  // Debounced validation
  useEffect(() => {
    if (!validateOnChange || !touched) return

    const timer = setTimeout(() => {
      const validationResult = validator.validate(value)
      setResult(validationResult)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, validator, touched, validateOnChange, debounceMs])

  const handleChange = useCallback(
    (newValue: T) => {
      setValue(newValue)
      if (validateOnChange && touched) {
        const validationResult = validator.validate(newValue)
        setResult(validationResult)
      }
    },
    [validator, validateOnChange, touched]
  )

  const handleBlur = useCallback(() => {
    setTouched(true)
    if (validateOnBlur) {
      const validationResult = validator.validate(value)
      setResult(validationResult)
    }
  }, [validator, value, validateOnBlur])

  const validate = useCallback(() => {
    setTouched(true)
    const validationResult = validator.validate(value)
    setResult(validationResult)
    return validationResult.isValid
  }, [validator, value])

  const reset = useCallback(
    (newValue?: T) => {
      const resetValue = newValue ?? initialValue
      setValue(resetValue)
      setTouched(false)
      setResult(validator.validate(resetValue))
    },
    [validator, initialValue]
  )

  return {
    value,
    setValue: handleChange,
    touched,
    error: result.errors[0] || undefined,
    errors: result.errors,
    isValid: result.isValid,
    validate,
    reset,
    handleBlur,
    inputProps: {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value as T),
      onBlur: handleBlur,
      'aria-invalid': !result.isValid && touched,
      'aria-describedby': !result.isValid && touched ? 'error-message' : undefined,
    },
  }
}

