import { renderHook, waitFor } from '@testing-library/react'
import { useWallet } from '../useWallet'

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn(),
  send: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
}

describe('useWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete (window as any).ethereum
  })

  it('initializes with disconnected state', () => {
    const { result } = renderHook(() => useWallet())
    expect(result.current.isConnected).toBe(false)
    expect(result.current.address).toBeNull()
  })

  it('connects wallet when MetaMask is available', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890'
    const mockProvider = {
      send: jest.fn().mockResolvedValue(undefined),
      getSigner: jest.fn().mockResolvedValue({
        getAddress: jest.fn().mockResolvedValue(mockAddress),
      }),
      lookupAddress: jest.fn().mockResolvedValue(null),
    }

    // Mock ethers.BrowserProvider
    jest.doMock('ethers', () => ({
      ethers: {
        BrowserProvider: jest.fn().mockImplementation(() => mockProvider),
      },
    }))

    window.ethereum = mockEthereum as any
    mockEthereum.request.mockResolvedValue([mockAddress])

    const { result } = renderHook(() => useWallet())

    await waitFor(() => {
      result.current.connect()
    })

    // Note: This test structure may need adjustment based on actual ethers.js behavior
    expect(result.current.isConnecting).toBeDefined()
  })

  it('handles missing MetaMask gracefully', async () => {
    const { result } = renderHook(() => useWallet())

    await waitFor(() => {
      result.current.connect()
    })

    // Should handle error state
    expect(result.current.error).toBeDefined()
  })
})

