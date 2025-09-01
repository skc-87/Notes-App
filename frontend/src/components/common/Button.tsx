import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText = 'Loading...',
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default Button;