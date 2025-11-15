import { renderHook, waitFor } from '@testing-library/react'
import { useDID } from '../useDID'

describe('useDID', () => {
  it('initializes with no DID', () => {
    const { result } = renderHook(() => useDID())
    expect(result.current.did).toBeNull()
    expect(result.current.didDocument).toBeNull()
  })

  it('creates a DID successfully', async () => {
    const { result } = renderHook(() => useDID())

    await waitFor(async () => {
      const did = await result.current.createDID()
      expect(did).toMatch(/^did:riss:/)
    })

    expect(result.current.did).toMatch(/^did:riss:/)
    expect(result.current.didDocument).toBeDefined()
    expect(result.current.didDocument?.id).toBe(result.current.did)
  })

  it('creates DID with wallet address', async () => {
    const { result } = renderHook(() => useDID())
    const address = '0x1234567890123456789012345678901234567890'

    await waitFor(async () => {
      const did = await result.current.createDID(address)
      expect(did).toMatch(/^did:riss:/)
    })

    expect(result.current.didDocument?.verificationMethod).toBeDefined()
    expect(result.current.didDocument?.verificationMethod?.length).toBeGreaterThan(0)
  })

  it('resolves existing DID', async () => {
    const { result } = renderHook(() => useDID())

    await waitFor(async () => {
      await result.current.createDID()
    })

    const did = result.current.did!
    const document = await result.current.resolveDID(did)

    expect(document).toBeDefined()
    expect(document?.id).toBe(did)
  })

  it('clears DID when clearDID is called', async () => {
    const { result } = renderHook(() => useDID())

    await waitFor(async () => {
      await result.current.createDID()
    })

    expect(result.current.did).not.toBeNull()
    result.current.clearDID()
    expect(result.current.did).toBeNull()
    expect(result.current.didDocument).toBeNull()
  })
})

