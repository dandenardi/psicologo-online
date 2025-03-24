import { Request, Response } from 'express';
import User from '../models/User';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Error while getting user profile' });
  }
};
