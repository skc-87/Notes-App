import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

const Input: React.FC<InputProps> = ({ label, id, error, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input id={id} className={`${styles.input} ${error ? styles.error : ''}`} {...props} />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;