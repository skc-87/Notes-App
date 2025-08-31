import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';

// Create Google OAuth2 client WITH Client Secret
export const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,           // Client ID from .env
  process.env.GOOGLE_CLIENT_SECRET,       // Client Secret from .env (CRITICAL!)
  `${process.env.CLIENT_URL}/auth/google/callback`
);

// Verify Google ID token USING Client Secret
export const verifyGoogleToken = async (idToken: string) => {
  try {
    console.log('Verifying Google token with Client Secret...');
    
    // THIS IS WHERE CLIENT SECRET IS USED!
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Verify audience matches our Client ID
    });
    
    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Invalid Google token: No payload received');
    }
    
    console.log('Google token verified successfully for:', payload.email);
    
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw new Error('Failed to verify Google token. Please try again.');
  }
};

// Find or create user from Google data
export const findOrCreateGoogleUser = async (googleData: any) => {
  try {
    console.log('Finding or creating user for Google ID:', googleData.googleId);
    
    // Check if user exists with Google ID
    let user = await User.findOne({ googleId: googleData.googleId });
    
    if (user) {
      console.log('Existing user found with Google ID:', user.email);
      return user;
    }
    
    // Check if user exists with email
    user = await User.findOne({ email: googleData.email });
    
    if (user) {
      console.log('Linking Google account to existing user:', user.email);
      user.googleId = googleData.googleId;
      await user.save();
      return user;
    }
    
    // Create new user
    console.log('Creating new user with Google account:', googleData.email);
    user = await User.create({
      googleId: googleData.googleId,
      name: googleData.name,
      email: googleData.email,
      isVerified: true, // Google users are automatically verified
    });
    
    return user;
  } catch (error) {
    console.error('Error in findOrCreateGoogleUser:', error);
    throw new Error('Failed to process Google user');
  }
};