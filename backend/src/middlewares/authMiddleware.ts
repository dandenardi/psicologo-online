import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Unauthorized access. Token not provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    req.user = decoded; // Agora o TypeScript reconhece `req.user` devido ao `declare global`

    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export { authenticateToken };
