import express from 'express';
import {
  requestOTP,
  verifyOTP,
  login,
  googleLogin,
  getGoogleAuthStatus,
  getMe,
  requestLoginOTP,  // Add this
  verifyLoginOTP, 
} from '../controllers/authController';
import { validateLogin ,validateOtpRequest} from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/request-otp', validateOtpRequest, requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/login', validateLogin, login);
router.post('/login/request-otp', requestLoginOTP);
router.post('/login/verify-otp', verifyLoginOTP);
router.get('/me', authenticate, getMe);

// Google OAuth routes - SIMPLIFIED with GIS
router.get('/google/status', getGoogleAuthStatus); // Check if Google auth is configured
router.post('/google', googleLogin); // Main Google login endpoint

export default router;