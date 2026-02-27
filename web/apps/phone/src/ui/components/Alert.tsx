import React, { forwardRef } from 'react';
import { cn } from '@utils/css';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'filled' | 'outlined' | 'standard';
  severity?: 'success' | 'info' | 'warning' | 'error';
  elevation?: number;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'filled', severity = 'info', children, ...props }, ref) => {
    // Cores sutis por cima do blur (iOS) dependendo da severidade
    const severityStyles = {
      success: 'text-green-600 dark:text-green-400',
      info: 'text-foreground', // Neutro/Padrão
      warning: 'text-orange-500 dark:text-orange-400',
      error: 'text-red-500 dark:text-red-400',
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'z-[10000] flex w-max max-w-[340px] items-center justify-center break-words',
          'px-5 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
          'bg-white/70 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/20 dark:border-white/5',
          'text-[15px] font-medium tracking-tight',
          severityStyles[severity],
          className
        )}
        {...props}
      >
        <span className="line-clamp-2 text-center leading-snug">{children}</span>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
export default Alert;
