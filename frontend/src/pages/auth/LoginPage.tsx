import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { requestLoginOtp, verifyLoginOtp, clearAuthError } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import GoogleSignIn from '../../components/auth/GoogleSignIn';
import styles from './Auth.module.css';
import authImage from '../../assets/windows-11-blue-wallpaper.jpg';
import logoIcon from '../../assets/icon.png';

const LoginPage = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [formData, setFormData] = useState({ email: '', otp: '' });
  const [rememberMe, setRememberMe] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAuth();
  
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
  
  useEffect(() => {
    if(isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(requestLoginOtp({ email: formData.email }));
    if (requestLoginOtp.fulfilled.match(result)) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(verifyLoginOtp({ email: formData.email, otp: formData.otp, rememberMe }));
  };
  
  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.formInner}>
             <div className={styles.header}>
              <img src={logoIcon} alt="HD Logo" className={styles.logoIcon} />
              <span className={styles.logoText}>HD</span>
            </div>

            <div>
                <h1 className={styles.title}>Sign in</h1>
                <p className={styles.subtitle}>Please login to continue to your account.</p>
            </div>
            
            <div className={styles.formContent}>
                {error && <p className={styles.errorMessage}>{error}</p>}

                {step === 'email' && (
                    <form onSubmit={handleRequestOtp}>
                        <Input
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                        {/* FIX: Add custom loading text */}
                        <Button type="submit" isLoading={isLoading} loadingText="Sending OTP...">
                          Send OTP
                        </Button>
                    </form>
                )}

                {step === 'otp' && (
                    <form onSubmit={handleVerifyOtp}>
                        <p>An OTP has been sent to {formData.email}.</p>
                        <Input
                        label="OTP"
                        id="otp"
                        name="otp"
                        type="text"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                        />
                        <div className={styles.rememberMe}>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">Remember Me</label>
                        </div>
                        {/* FIX: Add custom loading text */}
                        <Button type="submit" isLoading={isLoading} loadingText="Signing In...">
                          Sign In
                        </Button>
                    </form>
                )}
                <div className={styles.orSeparator}>Or</div>

                <div className={styles.googleButtonWrapper}>
                    <GoogleSignIn />
                </div>

                <p className={styles.switchAuth}>
                    Need an account? <Link to="/signup">Create one</Link>
                </p>
            </div>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img src={authImage} alt="Abstract background" className={styles.image} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;