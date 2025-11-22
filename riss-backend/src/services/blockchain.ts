import dotenv from 'dotenv';
dotenv.config();

import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';

// Contract ABIs (simplified - in production, import from artifacts)
const RISS_REPUTATION_ABI = [
  'function submitActivityProof(string memory _proofId, string memory _activityType, string memory _title, string memory _source, uint256 _scoreImpact)',
  'function verifyActivity(address _user, uint256 _proofIndex)',
  'function submitVerificationRequest(string memory _requestId, string memory _requestType, string[] memory _proofs)',
  'function reviewVerificationRequest(string memory _requestId, bool _approved)',
  'function recordKrnlTaskCompletion(address _user, string memory _taskId, uint256 _scoreWeight)',
  'function getReputationScore(address _user) view returns (uint256 total, uint256 identity, uint256 contribution, uint256 trust, uint256 social, uint256 engagement, uint256 lastUpdated)',
  'function getUserActivities(address _user) view returns (tuple(string proofId, string activityType, string title, string source, uint256 timestamp, uint256 scoreImpact, bool verified, address verifier)[])',
  'event ActivityAdded(address indexed user, string indexed proofId, string activityType, uint256 scoreImpact)',
  'event ActivityVerified(address indexed user, string indexed proofId, address indexed verifier)',
  'event ReputationUpdated(address indexed user, uint256 totalScore, uint256 identity, uint256 contribution, uint256 trust, uint256 social, uint256 engagement)',
];

const KRNL_INTEGRATION_ABI = [
  'function processKrnlTask(string memory _taskId)',
  'function batchProcessKrnlTasks(string[] memory _taskIds)',
  'function isTaskProcessed(string memory _taskId) view returns (bool)',
];

let provider: ethers.Provider;
let rissReputationContract: ethers.Contract;
let krnlIntegrationContract: ethers.Contract;
let signer: ethers.Wallet;

export function initializeBlockchain(): void {
  const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
  const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
  const RISS_REPUTATION_ADDRESS = process.env.RISS_REPUTATION_ADDRESS || '';
  const KRNL_INTEGRATION_ADDRESS = process.env.KRNL_INTEGRATION_ADDRESS || '';

  if (!PRIVATE_KEY || !RISS_REPUTATION_ADDRESS) {
    logger.warn('Blockchain not configured. Running in mock mode.');
    return;
  }

  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
    
    rissReputationContract = new ethers.Contract(
      RISS_REPUTATION_ADDRESS,
      RISS_REPUTATION_ABI,
      signer
    );

    if (KRNL_INTEGRATION_ADDRESS) {
      krnlIntegrationContract = new ethers.Contract(
        KRNL_INTEGRATION_ADDRESS,
        KRNL_INTEGRATION_ABI,
        signer
      );
    }

    logger.info('Blockchain initialized');
    logger.info(`RISS Reputation: ${RISS_REPUTATION_ADDRESS}`);
    if (KRNL_INTEGRATION_ADDRESS) {
      logger.info(`KRNL Integration: ${KRNL_INTEGRATION_ADDRESS}`);
    }
  } catch (error) {
    logger.error('Failed to initialize blockchain:', error);
    throw error;
  }
}

export async function submitActivityProofOnChain(
  proofId: string,
  activityType: string,
  title: string,
  source: string,
  scoreImpact: number
): Promise<string | null> {
  if (!rissReputationContract) {
    logger.warn('Blockchain not initialized, skipping on-chain submission');
    return null;
  }

  try {
    const tx = await rissReputationContract.submitActivityProof(
      proofId,
      activityType,
      title,
      source,
      scoreImpact
    );
    const receipt = await tx.wait();
    logger.info(`Activity proof submitted on-chain: ${receipt.hash}`);
    return receipt.hash;
  } catch (error) {
    logger.error('Failed to submit activity proof on-chain:', error);
    throw error;
  }
}

export async function verifyActivityOnChain(
  userAddress: string,
  proofIndex: number
): Promise<string | null> {
  if (!rissReputationContract) {
    logger.warn('Blockchain not initialized, skipping on-chain verification');
    return null;
  }

  try {
    const tx = await rissReputationContract.verifyActivity(userAddress, proofIndex);
    const receipt = await tx.wait();
    logger.info(`Activity verified on-chain: ${receipt.hash}`);
    return receipt.hash;
  } catch (error) {
    logger.error('Failed to verify activity on-chain:', error);
    throw error;
  }
}

export async function getReputationScoreOnChain(
  userAddress: string
): Promise<{
  total: number;
  identity: number;
  contribution: number;
  trust: number;
  social: number;
  engagement: number;
  lastUpdated: number;
} | null> {
  if (!rissReputationContract) {
    return null;
  }

  try {
    const score = await rissReputationContract.getReputationScore(userAddress);
    return {
      total: Number(score.total),
      identity: Number(score.identity),
      contribution: Number(score.contribution),
      trust: Number(score.trust),
      social: Number(score.social),
      engagement: Number(score.engagement),
      lastUpdated: Number(score.lastUpdated),
    };
  } catch (error) {
    logger.error('Failed to get reputation score on-chain:', error);
    return null;
  }
}

export async function processKrnlTaskOnChain(taskId: string): Promise<string | null> {
  if (!krnlIntegrationContract) {
    logger.warn('KRNL Integration contract not initialized');
    return null;
  }

  try {
    const tx = await krnlIntegrationContract.processKrnlTask(taskId);
    const receipt = await tx.wait();
    logger.info(`KRNL task processed on-chain: ${receipt.hash}`);
    return receipt.hash;
  } catch (error) {
    logger.error('Failed to process KRNL task on-chain:', error);
    throw error;
  }
}

// Initialize on module load
if (process.env.NODE_ENV !== 'test') {
  initializeBlockchain();
}

