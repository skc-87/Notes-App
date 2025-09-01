import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { requestSignupOtp, verifySignupOtp, clearAuthError } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import GoogleSignIn from '../../components/auth/GoogleSignIn';
import styles from './Auth.module.css';
import authImage from '../../assets/windows-11-blue-wallpaper.jpg';
import logoIcon from '../../assets/icon.png';

const SignupPage = () => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    password: '',
    otp: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAuth();
  
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      requestSignupOtp({
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
      })
    );
    if (requestSignupOtp.fulfilled.match(result)) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      verifySignupOtp({
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
      })
    );
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
              <h1 className={styles.title}>Sign up</h1>
              <p className={styles.subtitle}>Sign up to enjoy the feature of HD</p>
            </div>


            <div className={styles.formContent}>
              {error && <p className={styles.errorMessage}>{error}</p>}

              {step === 'details' && (
                <form onSubmit={handleRequestOtp}>
                  <Input
                    label="Your Name"
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Date of Birth"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
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
                  <Button type="submit" isLoading={isLoading} loadingText="Getting OTP...">
                    Get OTP
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
                  <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Must be at least 6 characters"
                  />
                  {/* FIX: Add custom loading text */}
                  <Button type="submit" isLoading={isLoading} loadingText="Signing Up...">
                    Sign Up
                  </Button>
                </form>
              )}

              <div className={styles.orSeparator}>Or</div>

              <div className={styles.googleButtonWrapper}>
                <GoogleSignIn />
              </div>

              <p className={styles.switchAuth}>
                Already have an account? <Link to="/login">Sign in</Link>
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

export default SignupPage;