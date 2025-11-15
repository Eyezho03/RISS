import { useState } from 'react'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Code, Key, Copy, Check, Webhook, Plug, Book } from 'lucide-react'

export default function ApiIntegrations(): JSX.Element {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)

  const generateApiKey = (): void => {
    const newKey = `riss_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setApiKey(newKey)
    setIsKeyModalOpen(true)
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const codeExamples = {
    javascript: `// Get user reputation score
const response = await fetch('https://api.riss.app/v1/reputation', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    did: 'did:riss:user123'
  })
});

const data = await response.json();
console.log(data.score); // { total: 85, identity: 90, ... }`,
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.post(
    'https://api.riss.app/v1/reputation',
    headers=headers,
    json={'did': 'did:riss:user123'}
)

data = response.json()
print(data['score'])`,
    curl: `curl -X POST https://api.riss.app/v1/reputation \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"did": "did:riss:user123"}'`,
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Header */}
          <div>
            <h1 className="font-display text-4xl font-bold text-accent mb-2">API & Integrations</h1>
            <p className="font-body text-muted">
              Integrate RISS reputation scores into your application
            </p>
          </div>

          {/* API Key Management */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key size={24} className="text-accent" />
              <h2 className="font-display text-2xl font-bold text-accent">API Keys</h2>
            </div>
            <div className="space-y-4">
              {apiKey ? (
                <div className="bg-bg border-2 border-muted/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-body text-sm text-muted">Your API Key</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey)}
                      aria-label="Copy API key"
                    >
                      {copied ? (
                        <>
                          <Check size={16} className="mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="font-mono text-sm text-muted break-all">{apiKey}</p>
                  <p className="font-body text-xs text-muted mt-2">
                    Keep this key secure. Do not share it publicly.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="font-body text-muted mb-4">No API key generated yet</p>
                  <Button onClick={generateApiKey}>Generate API Key</Button>
                </div>
              )}
            </div>
          </div>

          {/* KRNL Plugin Integration */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Plug size={24} className="text-accent" />
              <h2 className="font-display text-2xl font-bold text-accent">KRNL Plugin</h2>
            </div>
            <div className="space-y-4">
              <p className="font-body text-muted">
                Integrate RISS reputation scoring directly into your KRNL Protocol tasks.
              </p>
              <div className="bg-bg border-2 border-muted/20 p-4">
                <h3 className="font-display font-bold text-accent mb-2">Installation</h3>
                <pre className="font-mono text-sm text-muted overflow-x-auto">
                  <code>{`npm install @riss/krnl-plugin`}</code>
                </pre>
              </div>
              <div className="bg-bg border-2 border-muted/20 p-4">
                <h3 className="font-display font-bold text-accent mb-2">Usage</h3>
                <pre className="font-mono text-sm text-muted overflow-x-auto">
                  <code>{`import { RissPlugin } from '@riss/krnl-plugin';

const plugin = new RissPlugin({
  apiKey: 'YOUR_API_KEY',
  did: 'did:riss:user123'
});

// Get reputation score
const score = await plugin.getReputation();

// Submit activity proof
await plugin.submitProof({
  type: 'krnl_task_completed',
  taskId: 'task_123',
  proof: 'github_commit_hash'
});`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* API Documentation */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Book size={24} className="text-accent" />
              <h2 className="font-display text-2xl font-bold text-accent">API Endpoints</h2>
            </div>
            <div className="space-y-6">
              {/* Get Reputation */}
              <div className="bg-bg border-2 border-muted/20 p-4">
                <h3 className="font-display font-bold text-accent mb-2">GET /v1/reputation</h3>
                <p className="font-body text-sm text-muted mb-4">
                  Retrieve reputation score for a DID
                </p>
                <div className="mb-4">
                  <div className="font-body text-sm text-muted mb-2">Parameters:</div>
                  <ul className="list-disc list-inside font-body text-sm text-muted space-y-1">
                    <li>did (string, required) - Decentralized Identifier</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <div className="font-body text-sm text-muted mb-2">Response:</div>
                  <pre className="font-mono text-xs text-muted bg-panel p-3 overflow-x-auto">
                    <code>{`{
  "score": {
    "total": 85,
    "identity": 90,
    "contribution": 80,
    "trust": 75,
    "social": 70,
    "engagement": 65
  },
  "activities": [...]
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Submit Proof */}
              <div className="bg-bg border-2 border-muted/20 p-4">
                <h3 className="font-display font-bold text-accent mb-2">POST /v1/proofs</h3>
                <p className="font-body text-sm text-muted mb-4">
                  Submit a new activity proof
                </p>
                <div className="mb-4">
                  <div className="font-body text-sm text-muted mb-2">Body:</div>
                  <pre className="font-mono text-xs text-muted bg-panel p-3 overflow-x-auto">
                    <code>{`{
  "type": "github_commit",
  "title": "Fixed bug in authentication",
  "description": "Resolved issue with token refresh",
  "source": "github",
  "metadata": {
    "commitHash": "abc123",
    "repository": "user/repo"
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Code size={24} className="text-accent" />
              <h2 className="font-display text-2xl font-bold text-accent">Code Examples</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(codeExamples).map(([lang, code]) => (
                <div key={lang} className="bg-bg border-2 border-muted/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-accent capitalize">{lang}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code)}
                      aria-label={`Copy ${lang} example`}
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="font-mono text-xs text-muted overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Webhook size={24} className="text-accent" />
              <h2 className="font-display text-2xl font-bold text-accent">Webhooks</h2>
            </div>
            <div className="space-y-4">
              <p className="font-body text-muted">
                Receive real-time notifications when reputation scores change or proofs are verified.
              </p>
              <div className="bg-bg border-2 border-muted/20 p-4">
                <Input
                  label="Webhook URL"
                  placeholder="https://your-app.com/webhook"
                  className="mb-4"
                />
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="score-change" className="accent-accent" />
                    <label htmlFor="score-change" className="font-body text-sm text-muted">
                      Score changes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="proof-verified" className="accent-accent" />
                    <label htmlFor="proof-verified" className="font-body text-sm text-muted">
                      Proof verified
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="task-completed" className="accent-accent" />
                    <label htmlFor="task-completed" className="font-body text-sm text-muted">
                      Task completed
                    </label>
                  </div>
                </div>
                <Button className="w-full">Save Webhook</Button>
              </div>
            </div>
          </div>
        </StaggerReveal>
      </div>
    </div>
  )
}

