import express from 'express';
import { getProfile } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);

export default router;
