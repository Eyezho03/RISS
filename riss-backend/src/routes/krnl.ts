import express from 'express';
import { processKrnlTaskOnChain } from '../services/blockchain.js';
import { Activity } from '../database/models/Activity.js';
import { User } from '../database/models/User.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const router = express.Router();

const taskSchema = z.object({
  taskId: z.string(),
  userId: z.string(),
  scoreWeight: z.number().min(0).max(100),
});

interface ReputationScore {
  total: number;
  identity: number;
  contribution: number;
  trust: number;
  social: number;
  engagement: number;
}

function applyKrnlTaskToReputation(
  current: ReputationScore,
  scoreImpact: number,
): ReputationScore {
  const MAX = 100;
  const clamp = (value: number) => Math.max(0, Math.min(MAX, value));
  const next: ReputationScore = { ...current };

  // KRNL tasks contribute to the contribution bucket, same as in the contract
  next.contribution = clamp(next.contribution + scoreImpact);

  next.total = Math.round(
    next.identity * 0.25 +
      next.contribution * 0.35 +
      next.trust * 0.2 +
      next.social * 0.1 +
      next.engagement * 0.1,
  );

  return next;
}

/**
 * POST /api/krnl/task/complete
 * Process a completed KRNL task
 */
router.post('/task/complete', async (req, res) => {
  try {
    const body = taskSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ 
      $or: [
        { walletAddress: body.userId.toLowerCase() },
        { did: body.userId }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if task already processed
    const existing = await Activity.findOne({
      proofId: `krnl_${body.taskId}`,
    });

    if (existing) {
      return res.status(409).json({ error: 'Task already processed' });
    }

    // Create activity record
    const activity = new Activity({
      proofId: `krnl_${body.taskId}`,
      userId: user._id,
      activityType: 'krnl_task_completed',
      title: `KRNL Task Completed: ${body.taskId}`,
      source: 'KRNL',
      timestamp: new Date(),
      scoreImpact: body.scoreWeight,
      verificationLevel: 'verified', // KRNL tasks are pre-validated
      verifier: 'krnl_protocol',
    });

    await activity.save();

    // Update cached reputation score for the user
    const baseScore: ReputationScore =
      (user.reputationScore as ReputationScore) || {
        total: 0,
        identity: 0,
        contribution: 0,
        trust: 0,
        social: 0,
        engagement: 0,
      };

    user.reputationScore = applyKrnlTaskToReputation(baseScore, body.scoreWeight);
    await user.save();

    // Process on blockchain
    const txHash = await processKrnlTaskOnChain(body.taskId);

    res.json({
      taskId: body.taskId,
      status: 'processed',
      txHash,
      message: 'KRNL task processed successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    logger.error('Error processing KRNL task:', error);
    res.status(500).json({ error: 'Failed to process KRNL task' });
  }
});

/**
 * POST /api/krnl/tasks/batch
 * Process multiple KRNL tasks at once
 */
router.post('/tasks/batch', async (req, res) => {
  try {
    const { tasks } = req.body; // Array of { taskId, userId, scoreWeight }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Tasks array required' });
    }

    const results = [];

    for (const task of tasks) {
      try {
        const validated = taskSchema.parse(task);
        const user = await User.findOne({
          $or: [
            { walletAddress: validated.userId.toLowerCase() },
            { did: validated.userId }
          ]
        });

        if (!user) {
          results.push({ taskId: validated.taskId, status: 'error', error: 'User not found' });
          continue;
        }

        const activity = new Activity({
          proofId: `krnl_${validated.taskId}`,
          userId: user._id,
          activityType: 'krnl_task_completed',
          title: `KRNL Task Completed: ${validated.taskId}`,
          source: 'KRNL',
          timestamp: new Date(),
          scoreImpact: validated.scoreWeight,
          verificationLevel: 'verified',
          verifier: 'krnl_protocol',
        });

        await activity.save();

        const baseScore: ReputationScore =
          (user.reputationScore as ReputationScore) || {
            total: 0,
            identity: 0,
            contribution: 0,
            trust: 0,
            social: 0,
            engagement: 0,
          };

        user.reputationScore = applyKrnlTaskToReputation(baseScore, validated.scoreWeight);
        await user.save();

        results.push({ taskId: validated.taskId, status: 'processed' });
      } catch (error) {
        results.push({ taskId: task.taskId, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    res.json({
      processed: results.filter(r => r.status === 'processed').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    });
  } catch (error) {
    logger.error('Error processing batch KRNL tasks:', error);
    res.status(500).json({ error: 'Failed to process batch tasks' });
  }
});

export default router;

