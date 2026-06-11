import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    outline: 'btn-outline',
  };

  return (
    <button 
      className={cn(variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
