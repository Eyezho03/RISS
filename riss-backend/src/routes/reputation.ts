import express from 'express';
import { User } from '../database/models/User.js';
import { Activity } from '../database/models/Activity.js';
import { getReputationScoreOnChain } from '../services/blockchain.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/reputation/:address
 * Get reputation score for a user by wallet address
 */
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;

    // Try to get from blockchain first
    const onChainScore = await getReputationScoreOnChain(address);
    
    // Get from database
    const user = await User.findOne({ walletAddress: address.toLowerCase() });
    
    if (!user && !onChainScore) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Merge on-chain and database scores (prefer on-chain if available)
    const score = onChainScore || {
      total: user?.reputationScore.total || 0,
      identity: user?.reputationScore.identity || 0,
      contribution: user?.reputationScore.contribution || 0,
      trust: user?.reputationScore.trust || 0,
      social: user?.reputationScore.social || 0,
      engagement: user?.reputationScore.engagement || 0,
    };

    res.json({
      address,
      did: user?.did,
      score,
      verificationLevel: user?.verificationLevel || 'unverified',
    });
  } catch (error) {
    logger.error('Error getting reputation:', error);
    res.status(500).json({ error: 'Failed to get reputation score' });
  }
});

/**
 * GET /api/reputation/:address/breakdown
 * Get detailed reputation breakdown with activities
 */
router.get('/:address/breakdown', async (req, res) => {
  try {
    const { address } = req.params;
    const user = await User.findOne({ walletAddress: address.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activities = await Activity.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    const verifiedCount = activities.filter(a => a.verificationLevel === 'verified').length;
    const totalPoints = activities
      .filter(a => a.verificationLevel === 'verified')
      .reduce((sum, a) => sum + a.scoreImpact, 0);

    res.json({
      address,
      did: user.did,
      score: user.reputationScore,
      stats: {
        totalActivities: activities.length,
        verifiedActivities: verifiedCount,
        totalPoints,
      },
      activities: activities.map(a => ({
        id: a.proofId,
        type: a.activityType,
        title: a.title,
        source: a.source,
        timestamp: a.timestamp,
        scoreImpact: a.scoreImpact,
        verificationLevel: a.verificationLevel,
      })),
    });
  } catch (error) {
    logger.error('Error getting reputation breakdown:', error);
    res.status(500).json({ error: 'Failed to get reputation breakdown' });
  }
});

export default router;

