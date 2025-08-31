import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/helpers';
import User, { IUser } from '../models/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ message: 'Token is not valid.' });
      return;
    }
    
    // Add user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};