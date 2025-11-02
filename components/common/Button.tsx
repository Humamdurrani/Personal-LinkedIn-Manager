import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', isLoading = false, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
