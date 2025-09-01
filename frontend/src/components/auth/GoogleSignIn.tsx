import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { googleLogin } from '../../store/slices/authSlice';
import styles from './GoogleSignIn.module.css';

const GoogleSignIn = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      dispatch(googleLogin(credentialResponse.credential));
    }
  };

  const handleError = () => {};

  return (
    <div className={styles.googleButtonWrapper}>
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