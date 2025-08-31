import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  
  // Use a type assertion to bypass the strict type checking
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRE } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JwtPayload;
};