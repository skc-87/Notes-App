import User, { IUser } from '../models/User';
import { generateOTP } from '../utils/otpGenerator';
import { sendOTPEmail } from './emailService';
import { verifyGoogleToken, findOrCreateGoogleUser } from '../config/googleAuth';

// in src/services/authService.ts

export const requestSignupOTP = async (name: string, email: string, dateOfBirth: Date): Promise<IUser> => {
  const existingVerifiedUser = await User.findOne({ email, isVerified: true });
  if (existingVerifiedUser) {
    throw new Error('An account with this email already exists.');
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Find an unverified user or create a new one
  let user = await User.findOneAndUpdate(
    { email, isVerified: false },
    { name, dateOfBirth, otp, otpExpiry },
    { new: true, upsert: true } // Upsert: update if exists, insert if not
  );

  await sendOTPEmail(email, otp);
  return user;
};

// in src/services/authService.ts

// in src/services/authService.ts

export const verifyUserOTP = async (email: string, otp: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found. Please sign up first.');
  }

  if (user.isVerified) {
    throw new Error('User is already verified');
  }

  // FIX: Add this block to check for missing OTP fields
  if (!user.otp || !user.otpExpiry) {
    throw new Error('OTP not found or has expired. Please request a new one.');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  if (user.otpExpiry < new Date()) {
    throw new Error('OTP has expired');
  }

  // Set the password and finalize verification
  user.password = password;
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return user;
};

// in src/services/authService.ts

export const requestLoginOTP = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });

  // Ensure the user exists and is already verified
  if (!user || !user.isVerified) {
    throw new Error('No verified account found with this email. Please sign up first.');
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  await user.save();

  await sendOTPEmail(email, otp);
};

// in src/services/authService.ts

export const verifyLoginOTP = async (email: string, otp: string): Promise<IUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found.');
  }

  if (!user.otp || !user.otpExpiry) {
    throw new Error('OTP not found or has expired. Please request a new one.');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP.');
  }

  if (user.otpExpiry < new Date()) {
    throw new Error('OTP has expired.');
  }

  // Clear OTP fields after successful verification
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return user;
};

export const loginUser = async (email: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  if (!user.password) {
    throw new Error('Please use Google login for this account');
  }
  
  const isPasswordMatch = await user.comparePassword(password);
  
  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }
  
  if (!user.isVerified) {
    throw new Error('Please verify your email first');
  }
  
  return user;
};

export const googleSignIn = async (idToken: string): Promise<IUser> => {
  try {
    console.log('Starting Google sign-in process...');
    
    // Step 1: Verify Google token (USES CLIENT SECRET)
    const googleData = await verifyGoogleToken(idToken);
    
    // Step 2: Find or create user
    const user = await findOrCreateGoogleUser(googleData);
    
    console.log('Google sign-in successful for user:', user.email);
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw new Error((error as Error).message || 'Google authentication failed');
  }
};