import express from 'express';
import {
  requestOTP,
  verifyOTP,
  login,
  googleLogin,
  getGoogleAuthStatus,
  getMe,
  requestLoginOTP,
  verifyLoginOTP,
} from '../controllers/authController';
import { validateLogin, validateOtpRequest, validateEmail } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const otpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many OTP requests. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.post('/request-otp', otpRateLimit, validateOtpRequest, requestOTP);
router.post('/verify-otp', loginRateLimit, verifyOTP);
router.post('/login', loginRateLimit, validateLogin, login);
router.post('/login/request-otp', otpRateLimit, validateEmail, requestLoginOTP);
router.post('/login/verify-otp', loginRateLimit, verifyLoginOTP);
router.get('/me', authenticate, getMe);

router.get('/google/status', getGoogleAuthStatus);
router.post('/google', loginRateLimit, googleLogin);

export default router;