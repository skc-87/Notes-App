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
import { validateLogin, validateOtpRequest } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/request-otp', validateOtpRequest, requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/login', validateLogin, login);
router.post('/login/request-otp', requestLoginOTP);
router.post('/login/verify-otp', verifyLoginOTP);
router.get('/me', authenticate, getMe);

router.get('/google/status', getGoogleAuthStatus);
router.post('/google', googleLogin);

export default router;