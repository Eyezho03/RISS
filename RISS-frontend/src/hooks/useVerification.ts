import { useState, useCallback } from 'react'

export interface VerificationRequest {
  documentHash: string
  documentType: string
  timestamp: number
}

export interface VerificationResult {
  txHash: string
  credential: {
    '@context': string[]
    type: string[]
    issuer: string
    issuanceDate: string
    credentialSubject: {
      id: string
      documentHash: string
      verified: boolean
    }
  }
  did: string
}

/**
 * useVerification Hook
 * Handles document verification flow
 * Uses mock API for transaction submission
 */
export function useVerification() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const verifyDocument = useCallback(
    async (request: VerificationRequest): Promise<VerificationResult> => {
      setIsVerifying(true)
      setError(null)

      try {
        // Call mock verification API
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })

        if (!response.ok) {
          throw new Error('Verification failed')
        }

        const data: VerificationResult = await response.json()
        setResult(data)
        setIsVerifying(false)

        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Verification failed'
        setError(errorMessage)
        setIsVerifying(false)
        throw new Error(errorMessage)
      }
    },
    []
  )

  const reset = useCallback((): void => {
    setResult(null)
    setError(null)
    setIsVerifying(false)
  }, [])

  return {
    isVerifying,
    result,
    error,
    verifyDocument,
    reset,
  }
}

