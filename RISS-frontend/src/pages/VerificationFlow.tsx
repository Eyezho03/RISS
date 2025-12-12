import { useState } from 'react'
import { Upload, FileText, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/Progress'

type Step = 'upload' | 'review' | 'submit' | 'pending' | 'success' | 'failed'

export default function VerificationFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [verificationType, setVerificationType] = useState('identity')
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [xHandle, setXHandle] = useState('')

  const steps = [
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'review', label: 'Review Information', icon: FileText },
    { id: 'submit', label: 'Submit for Verification', icon: CheckCircle },
  ]

  const verificationTypes = [
    { id: 'identity', label: 'Identity Verification', description: 'Verify your personal identity' },
    { id: 'skill', label: 'Skill Verification', description: 'Verify your professional skills' },
    { id: 'project', label: 'Project Verification', description: 'Verify your project contributions' },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCurrentStep('review')
    }
  }

  const handleSubmit = () => {
    setCurrentStep('pending')
    // Simulate verification process
    setTimeout(() => {
      setCurrentStep('success')
    }, 2000)
  }

  const getStepProgress = () => {
    switch (currentStep) {
      case 'upload':
        return 33
      case 'review':
        return 66
      case 'submit':
      case 'pending':
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-text-primary mb-1">
          Verification
        </h1>
        <p className="text-sm text-text-muted">
          Upload and link profiles.
        </p>
      </div>

      {/* Progress Steps */}
      <Card variant="glass">
        <div className="mb-6">
          <Progress value={getStepProgress()} variant="linear" color="accent" />
        </div>
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = steps.findIndex((s) => s.id === currentStep) >= index
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-accent text-text-on-accent'
                      : 'bg-bg-panel text-text-muted'
                  }`}
                >
                  <StepIcon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Step Content */}
      <Card variant="glass">
        {currentStep === 'upload' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
                Select Verification Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {verificationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setVerificationType(type.id)}
                    className={`p-4 rounded-card border-2 transition-all text-left ${
                      verificationType === type.id
                        ? 'border-accent bg-accent-soft'
                        : 'border-border bg-bg-secondary hover:border-accent/50'
                    }`}
                  >
                    <h3 className="font-medium text-text-primary mb-1">{type.label}</h3>
                    <p className="text-sm text-text-muted">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-text-primary mb-2">Upload Documents</h3>
              <p className="text-sm text-text-muted mb-4">
                RISS uses your documents together with your developer profiles (GitHub, LinkedIn, X)
                to build a transparent, verifiable score that DAOs and clients can trust.
              </p>
              <label className="block">
                <div className="border-2 border-dashed border-border rounded-card p-12 text-center hover:border-accent transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-primary mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-text-muted">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-text-primary">Developer profiles</h3>
              <p className="text-sm text-text-muted">
                These links are required inputs for the RISS AI scoring engine. They are used to
                aggregate your contributions and reputation across platforms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="GitHub Profile URL"
                  placeholder="https://github.com/your-handle"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
                <Input
                  label="LinkedIn Profile URL"
                  placeholder="https://www.linkedin.com/in/your-handle"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
                <Input
                  label="X (Twitter) Handle"
                  placeholder="@your-handle"
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 'review' && selectedFile && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Review Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Verification Type"
                value={verificationTypes.find((t) => t.id === verificationType)?.label || ''}
                disabled
              />
              <Input
                label="Document Name"
                value={selectedFile.name}
                disabled
              />
              <Input
                label="File Size"
                value={`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                disabled
              />
              <Input
                label="GitHub Profile URL"
                value={githubUrl}
                disabled
              />
              <Input
                label="LinkedIn Profile URL"
                value={linkedinUrl}
                disabled
              />
              <Input
                label="X (Twitter) Handle"
                value={xHandle}
                disabled
              />
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setCurrentStep('upload')}>
                Back
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit for Verification
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'pending' && (
          <div className="text-center py-12 space-y-4">
            <Clock className="w-16 h-16 text-warning mx-auto animate-spin" />
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Verification Pending
            </h2>
            <p className="text-text-muted">
              Your verification is in progress.
            </p>
          </div>
        )}

        {currentStep === 'success' && (
          <div className="text-center py-12 space-y-4">
            <CheckCircle className="w-16 h-16 text-success mx-auto" />
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Verification Successful!
            </h2>
            <p className="text-text-muted">
              Verification approved. Your RISS score will update shortly.
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
