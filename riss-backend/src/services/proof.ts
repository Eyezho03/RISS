import crypto from 'crypto';

interface ScoreProofInput {
  address: string;
  did?: string;
  score: {
    total: number;
    identity: number;
    contribution: number;
    trust: number;
    social: number;
    engagement: number;
    lastUpdated?: number;
  };
  aiWeights: {
    identity: number;
    contribution: number;
    trust: number;
    social: number;
    engagement: number;
  };
  engineVersion: string;
}

export interface ScoreProofMeta {
  proofHash: string;
  ipfsCid: string;
  engineVersion: string;
}

/**
 * createScoreProof
 *
 * Minimal, deterministic proof of the scoring computation.
 * For MVP we hash the canonical JSON payload and derive a stable
 * pseudo IPFS CID string. In production, replace the CID generation
 * with a real IPFS pin and store the returned CID here.
 */
export function createScoreProof(input: ScoreProofInput): ScoreProofMeta {
  const payload = {
    address: input.address.toLowerCase(),
    did: input.did,
    score: input.score,
    aiWeights: input.aiWeights,
    engineVersion: input.engineVersion,
  };

  const json = JSON.stringify(payload);
  const hash = crypto.createHash('sha256').update(json).digest('hex');

  // In a real IPFS integration, you would pin `json` and get back a CID.
  // Here we derive a deterministic, CID-like placeholder for demos.
  const cid = `ipfs://riss-${hash.slice(0, 32)}`;

  return {
    proofHash: `0x${hash}`,
    ipfsCid: cid,
    engineVersion: input.engineVersion,
  };
}
