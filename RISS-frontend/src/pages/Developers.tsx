import { Code2, KeyRound, Webhook, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const exampleCurl = `curl -X GET \
  https://api.riss.xyz/v1/reputation/{did} \
  -H "Authorization: Bearer <YOUR_API_KEY>"`

const exampleJson = `{
  "did": "did:riss:0x1234...5678",
  "score": 78,
  "breakdown": {
    "identity": 25,
    "contribution": 28,
    "trust": 15,
    "social": 7,
    "engagement": 3
  }
}`

export default function Developers() {
  const fakeApiKey = 'riss_test_********************'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary mb-1">
            Developers & API
          </h1>
          <p className="text-sm text-text-muted max-w-md">
            Wire RISS scores and proofs into your app.
          </p>
        </div>
        <Code2 className="w-10 h-10 text-primary-cyan hidden md:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="glass">
          <div className="flex items-center gap-3 mb-4">
            <KeyRound className="w-5 h-5 text-primary-purple" />
            <h2 className="font-display text-xl font-bold text-text-primary">
              API Keys
            </h2>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Use API keys to access the RISS reputation API from server-side or trusted environments.
          </p>
          <Input
            label="Test API Key"
            value={fakeApiKey}
            readOnly
          />
          <p className="mt-2 text-xs text-text-muted">
            In production, generate and manage keys from the RISS dashboard. Never expose secrets in client-side code.
          </p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-4">
            <Webhook className="w-5 h-5 text-primary-cyan" />
            <h2 className="font-display text-xl font-bold text-text-primary">
              Reputation & Proof Webhooks
            </h2>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Subscribe to reputation changes, verification events, AI score recomputations and KRNL
            task completions so your product can react in real time.
          </p>
          <ul className="text-sm text-text-muted space-y-1 mb-3 list-disc list-inside">
            <li><code className="text-primary-cyan">reputation.updated</code></li>
            <li><code className="text-primary-cyan">verification.completed</code></li>
            <li><code className="text-primary-cyan">task.verified</code></li>
          </ul>
          <Button variant="ghost" size="sm">
            Manage webhooks
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-5 h-5 text-success" />
            <h2 className="font-display text-xl font-bold text-text-primary">
              SDKs
            </h2>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Client libraries for TypeScript/JavaScript, Rust, and Motoko make it easy to query RISS from EVM, ICP, and KRNL modules.
          </p>
          <Button variant="ghost" size="sm">
            View SDK docs
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>

      {/* Scoring & proof flow */}
      <Card variant="glass">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-bold text-text-primary">
            Scoring & proof flow
          </h2>
          <span className="text-xs text-text-muted">For integrators</span>
        </div>
        <ScoringPipeline />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">
            Example: Fetch Developer Score by DID
          </h2>
          <pre className="bg-bg-panel rounded-card p-4 text-xs text-text-muted overflow-x-auto">
            <code>{exampleCurl}</code>
          </pre>
          <p className="mt-3 text-xs text-text-muted">
            Replace <code>&lt;YOUR_API_KEY&gt;</code> with a real key and <code>{'{did}'}</code> with a valid RISS DID.
          </p>
        </Card>

        <Card variant="glass">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">
            Example Scoring Payload
          </h2>
          <pre className="bg-bg-panel rounded-card p-4 text-xs text-text-muted overflow-x-auto">
            <code>{exampleJson}</code>
          </pre>
        </Card>
      </div>
    </div>
  )
}