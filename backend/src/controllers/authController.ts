import { Response } from 'express';
import { generateToken } from '../utils/helpers';
import * as authService from '../services/authService';
import { AuthRequest } from '../types';
import User, { IUser } from '../models/User';

// in src/controllers/authController.ts

// Rename signup to requestOTP and update its body
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

// Update verifyOTP to include the password
export const verifyOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, otp, password } = req.body; // Add password here

    // Simple validation for the password
    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    const user = await authService.verifyUserOTP(email, otp, password); // Pass password
    const token = generateToken({ userId: user._id.toString(), email: user.email });

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

// in src/controllers/authController.ts

// Add this new function for requesting a login OTP
export const requestLoginOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.requestLoginOTP(email);
    res.status(200).json({ message: 'OTP has been sent to your email.' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Add this new function for verifying the login OTP
export const verifyLoginOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const user = await authService.verifyLoginOTP(email, otp);

    // If OTP is correct, generate a token and log the user in
    const token = generateToken({ userId: user._id.toString(), email: user.email });

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
    const token = generateToken({ userId: user._id.toString(), email: user.email });
    
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
    const token = generateToken({ userId: user._id.toString(), email: user.email });
    
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
    console.error('Google login error:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getGoogleAuthStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isConfigured = !!(process.env.GOOGLE_CLIENT_ID);
    res.status(200).json({ 
      configured: isConfigured,
      clientId: process.env.GOOGLE_CLIENT_ID,
      message: isConfigured ? 
        'Google Sign-In is configured and ready' : 
        'Google Sign-In is not configured. Please set GOOGLE_CLIENT_ID environment variable.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};