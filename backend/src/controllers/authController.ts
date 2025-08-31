import { Response } from 'express';
import { generateToken } from '../utils/helpers';
import * as authService from '../services/authService';
import { AuthRequest } from '../types';

// requestOTP remains the same as it does not generate a token.
export const requestOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, dateOfBirth } = req.body;
    const user = await authService.requestSignupOTP(name, email, dateOfBirth);
    res.status(200).json({
      message: 'OTP has been sent to your email.',
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const verifyOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, otp, password } = req.body;

    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    const user = await authService.verifyUserOTP(email, otp, password);
    // FIX: Added user.name to the token payload
    const token = generateToken({ userId: user._id.toString(), email: user.email, name: user.name });

    res.status(200).json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const requestLoginOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.requestLoginOTP(email);
    res.status(200).json({ message: 'OTP has been sent to your email.' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const verifyLoginOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const user = await authService.verifyLoginOTP(email, otp);

    // FIX: Added user.name to the token payload
    const token = generateToken({ userId: user._id.toString(), email: user.email, name: user.name });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    
    // FIX: Added user.name to the token payload
    const token = generateToken({ userId: user._id.toString(), email: user.email, name: user.name });
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const googleLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({ message: 'Google ID token is required' });
      return;
    }
    
    const user = await authService.googleSignIn(idToken);
    // FIX: Added user.name to the token payload
    const token = generateToken({ userId: user._id.toString(), email: user.email, name: user.name });
    
    res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// No changes needed for getGoogleAuthStatus or getMe
export const getGoogleAuthStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    // ... same as before
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    // ... same as before
};