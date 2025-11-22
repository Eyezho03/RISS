import express from 'express';
import { User } from '../database/models/User.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const router = express.Router();

const userSchema = z.object({
  did: z.string(),
  walletAddress: z.string(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  socialAccounts: z.object({
    github: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});

/**
 * POST /api/user/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const body = userSchema.parse(req.body);

    // Check if user already exists
    const existing = await User.findOne({
      $or: [
        { walletAddress: body.walletAddress.toLowerCase() },
        { did: body.did }
      ]
    });

    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = new User({
      did: body.did,
      walletAddress: body.walletAddress.toLowerCase(),
      username: body.username,
      email: body.email,
      socialAccounts: body.socialAccounts,
      reputationScore: {
        total: 0,
        identity: 0,
        contribution: 0,
        trust: 0,
        social: 0,
        engagement: 0,
      },
      verificationLevel: 'unverified',
    });

    await user.save();

    res.status(201).json({
      did: user.did,
      walletAddress: user.walletAddress,
      message: 'User registered successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    logger.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

/**
 * GET /api/user/:identifier
 * Get user by DID or wallet address
 */
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    const user = await User.findOne({
      $or: [
        { walletAddress: identifier.toLowerCase() },
        { did: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      did: user.did,
      walletAddress: user.walletAddress,
      username: user.username,
      reputationScore: user.reputationScore,
      verificationLevel: user.verificationLevel,
      socialAccounts: user.socialAccounts,
      createdAt: user.createdAt,
    });
  } catch (error) {
    logger.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * PATCH /api/user/:identifier
 * Update username (and later other profile fields)
 */
router.patch('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const { username } = req.body as { username?: string };

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await User.findOne({
      $or: [
        { walletAddress: identifier.toLowerCase() },
        { did: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username;
    await user.save();

    res.json({
      did: user.did,
      walletAddress: user.walletAddress,
      username: user.username,
      message: 'Username updated',
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;

