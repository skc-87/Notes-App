import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';

export const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.CLIENT_URL}/auth/google/callback`
);

export const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Invalid Google token: No payload received');
    }
    
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    throw new Error('Failed to verify Google token. Please try again.');
  }
};

export const findOrCreateGoogleUser = async (googleData: any) => {
  try {
    let user = await User.findOne({ googleId: googleData.googleId });
    
    if (user) {
      return user;
    }
    
    user = await User.findOne({ email: googleData.email });
    
    if (user) {
      user.googleId = googleData.googleId;
      await user.save();
      return user;
    }
    
    user = await User.create({
      googleId: googleData.googleId,
      name: googleData.name,
      email: googleData.email,
      isVerified: true,
    });
    
    return user;
  } catch (error) {
    throw new Error('Failed to process Google user');
  }
};