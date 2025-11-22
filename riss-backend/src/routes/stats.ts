import express from 'express';
import { User } from '../database/models/User.js';
import { Activity } from '../database/models/Activity.js';
import { VerificationRequest } from '../database/models/VerificationRequest.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/stats
 * Lightweight aggregate stats for the landing page.
 */
router.get('/', async (_req, res) => {
  try {
    const [userCount, verifiedUsers, krnlTasks, activities] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ verificationLevel: { $in: ['verified', 'premium'] } }),
      Activity.countDocuments({ activityType: 'krnl_task_completed' }),
      Activity.find({ verificationLevel: 'verified' }).select('scoreImpact').lean(),
    ]);

    const totalReputationPoints = activities.reduce((sum, a: any) => sum + (a.scoreImpact || 0), 0);

    res.json({
      activeBuilders: userCount,
      reputationPoints: totalReputationPoints,
      verifiedIdentities: verifiedUsers,
      krnlTasks: krnlTasks,
    });
  } catch (error) {
    logger.error('Error computing stats:', error);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

export default router;