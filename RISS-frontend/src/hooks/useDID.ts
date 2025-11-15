import { useState, useCallback } from 'react'

/**
 * W3C DID Document structure
 */
export interface DIDDocument {
  '@context': string[]
  id: string
  verificationMethod?: Array<{
    id: string
    type: string
    controller: string
    publicKeyMultibase?: string
  }>
  authentication?: string[]
  service?: Array<{
    id: string
    type: string
    serviceEndpoint: string
  }>
}

/**
 * useDID Hook
 * W3C DID pattern support
 * Creates and manages Decentralized Identifiers
 */
export function useDID() {
  const [did, setDid] = useState<string | null>(null)
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Generate a new DID
   * Format: did:riss:method-specific-id
   */
  const createDID = useCallback(async (address?: string): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      // Generate method-specific identifier
      const methodSpecificId = address
        ? address.slice(2, 10) // Use first 8 chars of address
        : Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15)

      const newDID = `did:riss:${methodSpecificId}`

      // Create minimal DID Document
      const document: DIDDocument = {
        '@context': ['https://www.w3.org/ns/did/v1'],
        id: newDID,
        verificationMethod: address
          ? [
              {
                id: `${newDID}#keys-1`,
                type: 'EcdsaSecp256k1VerificationKey2019',
                controller: newDID,
                publicKeyMultibase: address,
              },
            ]
          : [],
        authentication: address ? [`${newDID}#keys-1`] : [],
      }

      setDid(newDID)
      setDidDocument(document)
      setIsLoading(false)

      return newDID
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create DID'
      setError(errorMessage)
      setIsLoading(false)
      throw new Error(errorMessage)
    }
  }, [])

  /**
   * Resolve a DID to its document
   */
  const resolveDID = useCallback(async (didToResolve: string): Promise<DIDDocument | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Mock resolution - in production, this would query a DID registry
      // For now, return null if not the current DID
      if (didToResolve === did && didDocument) {
        setIsLoading(false)
        return didDocument
      }

      setIsLoading(false)
      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resolve DID'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [did, didDocument])

  const clearDID = useCallback((): void => {
    setDid(null)
    setDidDocument(null)
    setError(null)
  }, [])

  return {
    did,
    didDocument,
    isLoading,
    error,
    createDID,
    resolveDID,
    clearDID,
  }
}

