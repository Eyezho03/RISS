import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '@/context/AppContext'
import { useVerification } from '@/hooks/useVerification'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Upload, CheckCircle, Copy, ArrowRight } from 'lucide-react'

type Step = 'upload' | 'validation' | 'credential' | 'complete'

export default function VerificationFlow(): JSX.Element {
  const navigate = useNavigate()
  const { did, wallet } = useAppContext()
  const { verifyDocument, isVerifying, result } = useVerification()
  const [step, setStep] = useState<Step>('upload')
  const [documentHash, setDocumentHash] = useState('')
  const [documentType, setDocumentType] = useState('passport')
  const [txHash, setTxHash] = useState('')

  const handleUpload = (): void => {
    if (documentHash.trim()) {
      setStep('validation')
      // Simulate validation
      setTimeout(() => {
        setStep('credential')
      }, 2000)
    }
  }

  const handleValidation = async (): Promise<void> => {
    try {
      const verificationResult = await verifyDocument({
        documentHash,
        documentType,
        timestamp: Date.now(),
      })

      setTxHash(verificationResult.txHash)
      
      // Create DID if not exists
      if (!did.did && wallet.address) {
        await did.createDID(wallet.address)
      }

      setStep('complete')
    } catch (error) {
      console.error('Verification failed:', error)
    }
  }

  const copyTxHash = async (): Promise<void> => {
    if (txHash) {
      await navigator.clipboard.writeText(txHash)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 pb-24 md:pb-16">
      <div className="max-w-2xl w-full">
        <StaggerReveal>
          <div className="space-y-8">
            {/* Step 1: Upload Document */}
            {step === 'upload' && (
              <div className="bg-panel border-2 border-accent p-8 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Upload size={32} className="text-accent" />
                  <h1 className="font-display text-3xl font-bold text-accent">
                    Upload Document
                  </h1>
                </div>
                <Input
                  label="Document Hash"
                  value={documentHash}
                  onChange={(e) => setDocumentHash(e.target.value)}
                  placeholder="Enter document hash or upload file"
                />
                <div>
                  <label className="block font-display text-lg font-bold text-accent mb-2">
                    Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-4 py-3 bg-panel border-2 border-muted/20 text-muted font-body focus:outline-none focus:border-accent focus:text-accent transition-colors"
                  >
                    <option value="passport">Passport</option>
                    <option value="drivers-license">Driver's License</option>
                    <option value="id-card">ID Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Button onClick={handleUpload} className="w-full" size="lg">
                  Continue
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Onchain Validation */}
            {step === 'validation' && (
              <div className="bg-panel border-2 border-accent p-8 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
                  <h1 className="font-display text-3xl font-bold text-accent">
                    Validating on Blockchain
                  </h1>
                </div>
                <p className="font-body text-muted">
                  Submitting transaction to blockchain...
                </p>
                <div className="bg-bg border-2 border-muted/20 p-4">
                  <p className="font-mono text-sm text-muted break-all">
                    Document: {documentHash}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Issue Verifiable Credential */}
            {step === 'credential' && (
              <div className="bg-panel border-2 border-accent p-8 space-y-6">
                <h1 className="font-display text-3xl font-bold text-accent mb-4">
                  Issue Verifiable Credential
                </h1>
                <p className="font-body text-muted">
                  Creating your verifiable credential...
                </p>
                <Button
                  onClick={handleValidation}
                  disabled={isVerifying}
                  className="w-full"
                  size="lg"
                >
                  {isVerifying ? 'Processing...' : 'Issue Credential'}
                </Button>
              </div>
            )}

            {/* Step 4: DID Created */}
            {step === 'complete' && result && (
              <div className="bg-panel border-2 border-accent p-8 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={32} className="text-accent" />
                  <h1 className="font-display text-3xl font-bold text-accent">
                    Verification Complete
                  </h1>
                </div>

                <div className="space-y-4">
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <p className="font-display font-bold text-accent mb-2">
                      Transaction Hash
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-muted break-all flex-1">
                        {txHash}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyTxHash}
                        aria-label="Copy transaction hash"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <p className="font-display font-bold text-accent mb-2">DID Created</p>
                    <p className="font-mono text-sm text-muted break-all">
                      {result.did}
                    </p>
                  </div>

                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <p className="font-display font-bold text-accent mb-2">
                      Credential Issued
                    </p>
                    <p className="font-body text-sm text-muted">
                      {result.credential.type.join(', ')}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                  size="lg"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        </StaggerReveal>
      </div>
    </div>
  )
}

