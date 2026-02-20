import React, { forwardRef } from 'react';
import { cn } from '@utils/css';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'filled' | 'outlined' | 'standard';
  severity?: 'success' | 'info' | 'warning' | 'error';
  elevation?: number;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({ className, variant = 'filled', severity = 'info', children, ...props }, ref) => {

  const severityStyles = {
    success: 'bg-green-100 text-green-900 border-green-500 dark:bg-green-900/30 dark:text-green-400',
    info: 'bg-blue-100 text-blue-900 border-blue-500 dark:bg-blue-900/30 dark:text-blue-400',
    warning: 'bg-yellow-100 text-yellow-900 border-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-900 border-red-500 dark:bg-red-900/30 dark:text-red-400',
  };

  const variantStyles = {
    filled: severity === 'error' ? 'bg-red-500 text-white dark:bg-red-900' : 'bg-neutral-800 text-white',
    outlined: 'border bg-transparent',
    standard: '',
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'z-[10000] flex w-full max-w-[300px] break-words rounded-md p-3 text-[1.1em] shadow-md',
        variant === 'outlined' ? variantStyles.outlined : variantStyles.filled,
        variant !== 'filled' ? severityStyles[severity] : '',
        className
      )}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
});

Alert.displayName = 'Alert';
export default Alert;
