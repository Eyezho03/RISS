import { http, HttpResponse } from 'msw'

/**
 * MSW Mock Handlers
 * Simulates transaction submission and returns fake tx hash and DID
 */
export const handlers = [
  // Mock verification API endpoint
  http.post('/api/verify', async ({ request }) => {
    const body = await request.json() as {
      documentHash: string
      documentType: string
      timestamp: number
    }

    // Generate fake transaction hash
    const txHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`

    // Generate fake DID
    const did = `did:riss:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    // Create verifiable credential
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
      ],
      type: ['VerifiableCredential', 'IdentityVerificationCredential'],
      issuer: 'did:riss:issuer',
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: did,
        documentHash: body.documentHash,
        documentType: body.documentType,
        verified: true,
      },
    }

    return HttpResponse.json({
      txHash,
      credential,
      did,
    })
  }),

  // Mock credential sharing endpoint
  http.post('/api/share-credential', async ({ request }) => {
    const body = await request.json() as { did: string; credentialId: string }

    const shareableUrl = `https://riss.app/credential/${body.credentialId}?did=${encodeURIComponent(body.did)}`

    return HttpResponse.json({
      url: shareableUrl,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
  }),
]

