import { http, HttpResponse } from 'msw'

/**
 * MSW Mock Handlers
 * Simulates transaction submission and returns fake tx hash and DID
 */
export const handlers = [
  // KRNL state & tasks
  http.get('/api/krnl/state', () => {
    const state = {
      profile: {
        did: 'did:riss:0x1234...5678',
        wallets: ['0x1234...5678', '0xabcd...efgh'],
        identityStrength: 85,
        badges: ['Verified Identity', 'KRNL Contributor', 'Trust Builder'],
      },
      reputation: {
        score: 78,
        identity: 25,
        contribution: 28,
        trust: 15,
        social: 7,
        engagement: 3,
      },
      tasks: [
        {
          id: 'task-1',
          title: 'Audit KRNL Smart Contract Module',
          description: 'Review and audit the latest KRNL coordination module for security and gas efficiency.',
          status: 'assigned',
          weight: 5,
          points: 25,
          createdAt: '2025-11-01',
          dueAt: '2025-11-20',
          verifier: 'KRNL Core Team',
        },
        {
          id: 'task-2',
          title: 'Implement RISS Reputation Adapter',
          description: 'Build a KRNL adapter that syncs task completions into RISS reputation events.',
          status: 'in_progress',
          weight: 4,
          points: 18,
          createdAt: '2025-11-03',
          verifier: 'RISS Protocol',
        },
        {
          id: 'task-3',
          title: 'DAO Governance Proposal Draft',
          description: 'Draft and submit a governance proposal for integrating RISS into core DAO voting flows.',
          status: 'submitted',
          weight: 3,
          points: 12,
          createdAt: '2025-11-05',
          verifier: 'RISS Governance',
        },
        {
          id: 'task-4',
          title: 'Bug Bounty: Identity Edge Cases',
          description: 'Investigate and reproduce edge cases around DID merging and wallet rotation.',
          status: 'verified',
          weight: 2,
          points: 8,
          createdAt: '2025-11-02',
          verifier: 'Security Council',
        },
      ],
    }

    return HttpResponse.json(state)
  }),

  http.get('/api/krnl/tasks', () => {
    return HttpResponse.json([
      {
        id: 'task-1',
        title: 'Audit KRNL Smart Contract Module',
        description: 'Review and audit the latest KRNL coordination module for security and gas efficiency.',
        status: 'assigned',
        weight: 5,
        points: 25,
        createdAt: '2025-11-01',
        dueAt: '2025-11-20',
        verifier: 'KRNL Core Team',
      },
      {
        id: 'task-2',
        title: 'Implement RISS Reputation Adapter',
        description: 'Build a KRNL adapter that syncs task completions into RISS reputation events.',
        status: 'in_progress',
        weight: 4,
        points: 18,
        createdAt: '2025-11-03',
        verifier: 'RISS Protocol',
      },
      {
        id: 'task-3',
        title: 'DAO Governance Proposal Draft',
        description: 'Draft and submit a governance proposal for integrating RISS into core DAO voting flows.',
        status: 'submitted',
        weight: 3,
        points: 12,
        createdAt: '2025-11-05',
        verifier: 'RISS Governance',
      },
      {
        id: 'task-4',
        title: 'Bug Bounty: Identity Edge Cases',
        description: 'Investigate and reproduce edge cases around DID merging and wallet rotation.',
        status: 'verified',
        weight: 2,
        points: 8,
        createdAt: '2025-11-02',
        verifier: 'Security Council',
      },
    ])
  }),

  http.post('/api/krnl/tasks/:id/status', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as { status: string }

    // In a real backend, this would update persistent state. For MSW we just echo back a stub.
    const updatedTask = {
      id,
      title: 'Updated Task',
      description: 'Updated via mock KRNL endpoint',
      status: body.status,
      weight: 3,
      points: 10,
      createdAt: '2025-11-01',
      verifier: 'Mock Verifier',
    }

    return HttpResponse.json(updatedTask)
  }),

  // Existing mock verification API endpoint
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

