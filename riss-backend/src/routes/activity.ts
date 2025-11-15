import express from 'express';
import { Activity } from '../database/models/Activity.js';
import { User } from '../database/models/User.js';
import { submitActivityProofOnChain, verifyActivityOnChain } from '../services/blockchain.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const router = express.Router();

const activitySchema = z.object({
  proofId: z.string(),
  activityType: z.string(),
  title: z.string(),
  description: z.string().optional(),
  source: z.string(),
  scoreImpact: z.number().min(0).max(100),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * POST /api/activity
 * Submit a new activity proof
 */
router.post('/', async (req, res) => {
  try {
    const body = activitySchema.parse(req.body);
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
      return res.status(401).json({ error: 'Wallet address required' });
    }

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    // Check if proof already exists
    const existing = await Activity.findOne({ proofId: body.proofId });
    if (existing) {
      return res.status(409).json({ error: 'Proof ID already exists' });
    }

    // Create activity in database
    const activity = new Activity({
      proofId: body.proofId,
      userId: user._id,
      activityType: body.activityType,
      title: body.title,
      description: body.description,
      source: body.source,
      timestamp: new Date(),
      scoreImpact: body.scoreImpact,
      verificationLevel: 'pending',
      metadata: body.metadata,
    });

    await activity.save();

    // Submit to blockchain (async, don't wait)
    submitActivityProofOnChain(
      body.proofId,
      body.activityType,
      body.title,
      body.source,
      body.scoreImpact
    ).catch(err => logger.error('Failed to submit to blockchain:', err));

    res.status(201).json({
      id: activity.proofId,
      status: 'pending',
      message: 'Activity proof submitted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    logger.error('Error submitting activity:', error);
    res.status(500).json({ error: 'Failed to submit activity proof' });
  }
});

/**
 * GET /api/activity/:address
 * Get all activities for a user
 */
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    const user = await User.findOne({ walletAddress: address.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const query: any = { userId: user._id };
    if (status) {
      query.verificationLevel = status;
    }

    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    res.json({
      address,
      count: activities.length,
      activities: activities.map(a => ({
        id: a.proofId,
        type: a.activityType,
        title: a.title,
        description: a.description,
        source: a.source,
        timestamp: a.timestamp,
        scoreImpact: a.scoreImpact,
        verificationLevel: a.verificationLevel,
        verifier: a.verifier,
        metadata: a.metadata,
      })),
    });
  } catch (error) {
    logger.error('Error getting activities:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

/**
 * POST /api/activity/:proofId/verify
 * Verify an activity proof (verifier only)
 */
router.post('/:proofId/verify', async (req, res) => {
  try {
    const { proofId } = req.params;
    const verifierAddress = req.headers['x-wallet-address'] as string;

    if (!verifierAddress) {
      return res.status(401).json({ error: 'Verifier address required' });
    }

    // TODO: Check if address is authorized verifier

    const activity = await Activity.findOne({ proofId });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.verificationLevel === 'verified') {
      return res.status(400).json({ error: 'Activity already verified' });
    }

    const user = await User.findById(activity.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update in database
    activity.verificationLevel = 'verified';
    activity.verifier = verifierAddress;
    await activity.save();

    // Update user reputation score
    // TODO: Calculate and update reputation score

    // Verify on blockchain
    const activities = await Activity.find({ userId: user._id }).sort({ timestamp: 1 });
    const proofIndex = activities.findIndex(a => a.proofId === proofId);
    
    if (proofIndex >= 0) {
      verifyActivityOnChain(user.walletAddress, proofIndex).catch(err =>
        logger.error('Failed to verify on blockchain:', err)
      );
    }

    res.json({
      proofId,
      status: 'verified',
      message: 'Activity verified successfully',
    });
  } catch (error) {
    logger.error('Error verifying activity:', error);
    res.status(500).json({ error: 'Failed to verify activity' });
  }
});

export default router;

