export type ValidationRule<T = string> = {
  validate: (value: T) => boolean
  message: string
}

export type ValidationResult = {
  isValid: boolean
  errors: string[]
}

export class Validator<T = string> {
  private rules: ValidationRule<T>[] = []

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule)
    return this
  }

  validate(value: T): ValidationResult {
    const errors: string[] = []

    for (const rule of this.rules) {
      if (!rule.validate(value)) {
        errors.push(rule.message)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Common validation rules
export const validators = {
  required: (message = 'This field is required'): ValidationRule<string> => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message: message || `Must be at most ${max} characters`,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true // Optional email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
  }),

  username: (message = 'Username must be 3-20 characters, alphanumeric and dashes only'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true
      const usernameRegex = /^[a-zA-Z0-9-]{3,20}$/
      return usernameRegex.test(value)
    },
    message,
  }),

  walletAddress: (message = 'Please enter a valid wallet address'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true
      // Basic EVM address validation (0x followed by 40 hex characters)
      return /^0x[a-fA-F0-9]{40}$/.test(value)
    },
    message,
  }),

  did: (message = 'Please enter a valid DID'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true
      // Basic DID validation (did:method:id)
      return /^did:[a-z0-9]+:.+/.test(value)
    },
    message,
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message,
  }),

  numeric: (message = 'Must be a number'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true
      return !isNaN(Number(value))
    },
    message,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true
      return regex.test(value)
    },
    message,
  }),

  custom: (fn: (value: string) => boolean, message: string): ValidationRule<string> => ({
    validate: fn,
    message,
  }),
}

// Convenience function to create a validator with common rules
export function createValidator(...rules: ValidationRule[]): Validator {
  const validator = new Validator()
  rules.forEach((rule) => validator.addRule(rule))
  return validator
}

// Pre-built validators
export const usernameValidator = createValidator(
  validators.required('Username is required'),
  validators.minLength(3, 'Username must be at least 3 characters'),
  validators.maxLength(20, 'Username must be at most 20 characters'),
  validators.username()
)

export const emailValidator = createValidator(
  validators.email(),
  validators.maxLength(255, 'Email is too long')
)

export const walletValidator = createValidator(
  validators.required('Wallet address is required'),
  validators.walletAddress()
)

