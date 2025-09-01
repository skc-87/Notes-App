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
  const [dobError, setDobError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateDateOfBirth = (dateString: string): boolean => {
    if (!dateString) {
      setDobError('Date of birth is required.');
      return false;
    }

    const selectedDate = new Date(dateString);
    const today = new Date();
    
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setDobError('Date of birth cannot be in the future.');
      return false;
    }

    const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    if (selectedDate > thirteenYearsAgo) {
      setDobError('You must be at least 13 years old to sign up.');
      return false;
    }

    setDobError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'dateOfBirth') {
      validateDateOfBirth(value);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDateOfBirth(formData.dateOfBirth)) {
      return;
    }
    
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
                    error={dobError}
                    max={today}
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
                  <Button type="submit" isLoading={isLoading} loadingText="Getting OTP..." disabled={isLoading || !!dobError}>
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