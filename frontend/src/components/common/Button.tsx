import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  loadingText?: string; // Add a prop for custom loading text
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText = 'Loading...', // Set a default loading text
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={isLoading}
      {...props}
    >
      {/* FIX: Use the loadingText prop when isLoading is true */}
      {isLoading ? loadingText : children}
    </button>
  );
};

export default Button;