import { Router } from 'express';
import Profile from '../models/Profile';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { fetchLeetcodeStats, fetchGithubStats } from '../services/codingProfiles';

const router = Router();

// GET current user's profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user?.userId });
    if (!profile) {
      // Create empty profile if it doesn't exist
      profile = new Profile({ userId: req.user?.userId });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT (update) current user's profile
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const updateData = req.body;
    updateData.updatedAt = new Date();

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user?.userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET basic coding profile stats (e.g. LeetCode rating, GitHub repos)
router.get('/me/coding-stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user?.userId });
    if (!profile || !profile.codingProfiles) {
      return res.status(404).json({ message: 'No coding profiles found' });
    }

    const { leetcode, github } = profile.codingProfiles;
    const stats: any = {};

    if (leetcode) {
      stats.leetcode = await fetchLeetcodeStats(leetcode);
    }
    if (github) {
      stats.github = await fetchGithubStats(github);
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats', error });
  }
});

export default router;
