import express from 'express';
import { VerificationRequest } from '../database/models/VerificationRequest.js';
import { User } from '../database/models/User.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const router = express.Router();

const requestSchema = z.object({
  requestId: z.string(),
  requestType: z.enum(['identity', 'skill', 'project', 'krnl_contract']),
  proofs: z.array(z.string()),
});

/**
 * POST /api/verification/request
 * Submit a verification request
 */
router.post('/request', async (req, res) => {
  try {
    const body = requestSchema.parse(req.body);
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
      return res.status(401).json({ error: 'Wallet address required' });
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if request already exists
    const existing = await VerificationRequest.findOne({ requestId: body.requestId });
    if (existing) {
      return res.status(409).json({ error: 'Request ID already exists' });
    }

    const request = new VerificationRequest({
      requestId: body.requestId,
      userId: user._id,
      requestType: body.requestType,
      status: 'pending',
      proofs: body.proofs,
      submittedAt: new Date(),
    });

    await request.save();

    res.status(201).json({
      requestId: request.requestId,
      status: 'pending',
      message: 'Verification request submitted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    logger.error('Error submitting verification request:', error);
    res.status(500).json({ error: 'Failed to submit verification request' });
  }
});

/**
 * GET /api/verification/requests
 * Get verification requests (with filters)
 */
router.get('/requests', async (req, res) => {
  try {
    const { status, type, userId } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (type) query.requestType = type;
    if (userId) {
      const user = await User.findOne({
        $or: [
          { walletAddress: (userId as string).toLowerCase() },
          { did: userId }
        ]
      });
      if (user) query.userId = user._id;
    }

    const requests = await VerificationRequest.find(query)
      .populate('userId', 'did walletAddress username')
      .sort({ submittedAt: -1 })
      .limit(100);

    res.json({
      count: requests.length,
      requests: requests.map(r => ({
        requestId: r.requestId,
        requestType: r.requestType,
        status: r.status,
        proofs: r.proofs,
        submittedAt: r.submittedAt,
        reviewedAt: r.reviewedAt,
        reviewer: r.reviewer,
        comments: r.comments,
      })),
    });
  } catch (error) {
    logger.error('Error getting verification requests:', error);
    res.status(500).json({ error: 'Failed to get verification requests' });
  }
});

/**
 * POST /api/verification/:requestId/review
 * Review a verification request (verifier only)
 */
router.post('/:requestId/review', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approved, comments } = req.body;
    const reviewerAddress = req.headers['x-wallet-address'] as string;

    if (!reviewerAddress) {
      return res.status(401).json({ error: 'Reviewer address required' });
    }

    // TODO: Check if address is authorized verifier

    const request = await VerificationRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already reviewed' });
    }

    request.status = approved ? 'approved' : 'rejected';
    request.reviewedAt = new Date();
    request.reviewer = reviewerAddress;
    if (comments) request.comments = comments;

    await request.save();

    // If approved, update user verification level
    if (approved) {
      const user = await User.findById(request.userId);
      if (user) {
        if (user.verificationLevel === 'unverified') {
          user.verificationLevel = 'basic';
        } else if (request.requestType === 'identity' && user.verificationLevel === 'basic') {
          user.verificationLevel = 'verified';
        }
        await user.save();
      }
    }

    res.json({
      requestId,
      status: request.status,
      message: `Verification request ${approved ? 'approved' : 'rejected'}`,
    });
  } catch (error) {
    logger.error('Error reviewing verification request:', error);
    res.status(500).json({ error: 'Failed to review verification request' });
  }
});

export default router;

