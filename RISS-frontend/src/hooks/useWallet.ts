import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

interface WalletState {
  address: string | null
  ensName: string | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

/**
 * useWallet Hook
 * MetaMask + WalletConnect stub integration
 * Uses ethers.js for wallet connection
 */
export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    ensName: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async (): Promise<void> => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            const address = await accounts[0].getAddress()
            const ensName = await provider.lookupAddress(address)
            setState({
              address,
              ensName: ensName || null,
              isConnected: true,
              isConnecting: false,
              error: null,
            })
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error)
        }
      }
    }

    checkConnection()
  }, [])

  const connect = useCallback(async (): Promise<void> => {
    if (typeof window.ethereum === 'undefined') {
      setState((prev) => ({
        ...prev,
        error: 'MetaMask is not installed',
        isConnecting: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      // Try to resolve ENS name
      let ensName: string | null = null
      try {
        ensName = await provider.lookupAddress(address)
      } catch {
        // ENS lookup failed, continue without it
      }

      setState({
        address,
        ensName,
        isConnected: true,
        isConnecting: false,
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
        isConnecting: false,
      }))
    }
  }, [])

  const disconnect = useCallback((): void => {
    setState({
      address: null,
      ensName: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    connect,
    disconnect,
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      send: (method: string, params?: unknown[]) => Promise<unknown>
      on: (event: string, callback: () => void) => void
      removeListener: (event: string, callback: () => void) => void
    }
  }
}

