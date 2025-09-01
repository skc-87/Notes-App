import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const validateLogin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ message: 'Please provide email and password' });
    return;
  }
  
  next();
};

export const validateNote = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    res.status(400).json({ message: 'Please provide title and content for the note' });
    return;
  }
  
  if (title.length > 100) {
    res.status(400).json({ message: 'Title must be less than 100 characters' });
    return;
  }
  
  next();
};

export const validateNoteUpdate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const { title, content } = req.body;
  
  if (!title && !content) {
    res.status(400).json({ message: 'Please provide title or content to update' });
    return;
  }
  
  if (title && title.length > 100) {
    res.status(400).json({ message: 'Title must be less than 100 characters' });
    return;
  }
  
  next();
};

export const validateOtpRequest = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const { name, email, dateOfBirth } = req.body;

  if (!name || !email || !dateOfBirth) {
    res.status(400).json({ message: 'Please provide name, email, and date of birth' });
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    res.status(400).json({ message: 'Please provide a valid email address' });
    return;
  }

  next();
};