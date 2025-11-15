import { useState } from 'react'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Shield, CheckCircle2, XCircle, Clock, Plus, FileText } from 'lucide-react'
import type { VerificationRequest } from '@/types/reputation'

export default function VerificationRequests(): JSX.Element {
  const [requests, setRequests] = useState<VerificationRequest[]>([
    {
      id: 'req_1',
      type: 'identity',
      status: 'pending',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      proofs: ['document_hash_1'],
    },
    {
      id: 'req_2',
      type: 'skill',
      status: 'approved',
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
      reviewedAt: new Date(Date.now() - 86400000).toISOString(),
      verifier: 'did:riss:verifier1',
      proofs: ['github_commit_1', 'certificate_1'],
    },
  ])
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({ type: 'identity' as const, proofs: [''] })

  const handleCreateRequest = (): void => {
    const request: VerificationRequest = {
      id: `req_${Date.now()}`,
      type: newRequest.type,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      proofs: newRequest.proofs.filter((p) => p.trim()),
    }
    setRequests([request, ...requests])
    setNewRequest({ type: 'identity', proofs: [''] })
    setIsCreateModalOpen(false)
  }

  const handleReviewRequest = (requestId: string, action: 'approved' | 'rejected'): void => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: action,
              reviewedAt: new Date().toISOString(),
              verifier: 'did:riss:current_user',
            }
          : req
      )
    )
    setIsDetailsModalOpen(false)
  }

  const statusColors = {
    pending: 'border-muted text-muted',
    approved: 'border-accent text-accent',
    rejected: 'border-red-500 text-red-500',
  }

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-accent mb-2">
                Verification Requests
              </h1>
              <p className="font-body text-muted">
                Request verifications for identity, skills, projects, or KRNL contracts
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              New Request
            </Button>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {requests.map((request) => {
              const StatusIcon = statusIcons[request.status]
              return (
                <div
                  key={request.id}
                  className={`bg-panel border-2 ${statusColors[request.status]} p-6 cursor-pointer hover:bg-panel/80 transition-colors`}
                  onClick={() => {
                    setSelectedRequest(request)
                    setIsDetailsModalOpen(true)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Shield size={24} className="text-accent" />
                        <h3 className="font-display text-xl font-bold text-accent capitalize">
                          {request.type} Verification
                        </h3>
                        <StatusIcon size={20} />
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted mb-2">
                        <span>
                          Submitted:{' '}
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </span>
                        {request.reviewedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Reviewed:{' '}
                              {new Date(request.reviewedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-body text-sm text-muted">Proofs:</span>
                        <span className="font-display font-bold text-accent">
                          {request.proofs.length}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-accent capitalize mb-1">
                        {request.status}
                      </div>
                      {request.verifier && (
                        <div className="font-mono text-xs text-muted">
                          {request.verifier.slice(0, 20)}...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </StaggerReveal>
      </div>

      {/* Create Request Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="New Verification Request"
      >
        <div className="space-y-4">
          <div>
            <label className="font-display font-bold text-sm text-accent mb-2 block">
              Verification Type
            </label>
            <select
              className="w-full bg-bg border-2 border-muted/20 p-3 font-body text-muted focus:border-accent focus:outline-none"
              value={newRequest.type}
              onChange={(e) =>
                setNewRequest({ ...newRequest, type: e.target.value as VerificationRequest['type'] })
              }
            >
              <option value="identity">Identity</option>
              <option value="skill">Skill</option>
              <option value="project">Project</option>
              <option value="krnl_contract">KRNL Contract</option>
            </select>
          </div>
          <div>
            <label className="font-display font-bold text-sm text-accent mb-2 block">
              Proofs (one per line)
            </label>
            <textarea
              className="w-full bg-bg border-2 border-muted/20 p-3 font-body text-muted focus:border-accent focus:outline-none"
              rows={4}
              value={newRequest.proofs.join('\n')}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  proofs: e.target.value.split('\n').filter((p) => p.trim()),
                })
              }
              placeholder="Enter proof hashes or URLs, one per line"
            />
          </div>
          <Button onClick={handleCreateRequest} className="w-full">
            Submit Request
          </Button>
        </div>
      </Modal>

      {/* Request Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        title={selectedRequest ? `${selectedRequest.type} Verification` : 'Request Details'}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <div className="font-body text-sm text-muted mb-1">Status</div>
              <div className="font-display font-bold text-accent capitalize">
                {selectedRequest.status}
              </div>
            </div>
            <div>
              <div className="font-body text-sm text-muted mb-1">Submitted</div>
              <div className="font-body text-muted">
                {new Date(selectedRequest.submittedAt).toLocaleString()}
              </div>
            </div>
            {selectedRequest.reviewedAt && (
              <div>
                <div className="font-body text-sm text-muted mb-1">Reviewed</div>
                <div className="font-body text-muted">
                  {new Date(selectedRequest.reviewedAt).toLocaleString()}
                </div>
              </div>
            )}
            {selectedRequest.verifier && (
              <div>
                <div className="font-body text-sm text-muted mb-1">Verifier</div>
                <div className="font-mono text-sm text-muted break-all">
                  {selectedRequest.verifier}
                </div>
              </div>
            )}
            <div>
              <div className="font-body text-sm text-muted mb-2">Proofs</div>
              <div className="space-y-2">
                {selectedRequest.proofs.map((proof, index) => (
                  <div
                    key={index}
                    className="bg-bg border-2 border-muted/20 p-3 font-mono text-xs text-muted break-all"
                  >
                    {proof}
                  </div>
                ))}
              </div>
            </div>
            {selectedRequest.comments && (
              <div>
                <div className="font-body text-sm text-muted mb-1">Comments</div>
                <div className="font-body text-muted">{selectedRequest.comments}</div>
              </div>
            )}
            {selectedRequest.status === 'pending' && (
              <div className="flex space-x-2 pt-4 border-t-2 border-muted/20">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleReviewRequest(selectedRequest.id, 'approved')}
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => handleReviewRequest(selectedRequest.id, 'rejected')}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

