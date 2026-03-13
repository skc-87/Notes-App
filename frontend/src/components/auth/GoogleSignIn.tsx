import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { googleLogin } from '../../store/slices/authSlice';
import styles from './GoogleSignIn.module.css';
import { useState } from 'react';

const GoogleSignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    setError(null);
    if (credentialResponse.credential) {
      dispatch(googleLogin(credentialResponse.credential));
    }
  };

  const handleError = () => {
    setError('Google Sign-In failed. Please try again.');
  };

  return (
    <div className={styles.googleButtonWrapper}>
      {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        width="280"
        theme="outline"
        size="large"
      />
    </div>
  );
};

export default GoogleSignIn;