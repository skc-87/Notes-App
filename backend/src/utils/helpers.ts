import jwt from 'jsonwebtoken';

// The JwtPayload interface is now updated to include the user's name
export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  
  // No changes needed here, but it will now accept a payload with a name
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRE } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JwtPayload;
};