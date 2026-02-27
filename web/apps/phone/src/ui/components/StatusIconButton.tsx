import React from 'react';
import { cn } from '@utils/cn';

type StatusButtonStyleColor = 'success' | 'error' | 'warning' | 'info';

interface StatusIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: StatusButtonStyleColor;
  size?: 'small' | 'medium' | 'large';
}

const colorVariants: Record<StatusButtonStyleColor, string> = {
  success: 'bg-green-600 text-white hover:bg-green-700',
  error: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  info: 'bg-blue-600 text-white hover:bg-blue-700',
};

const sizeVariants = {
  small: 'p-1',
  medium: 'p-2',
  large: 'p-3',
};

export const StatusIconButton: React.FC<StatusIconButtonProps> = ({
  color = 'info',
  size = 'medium',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        colorVariants[color],
        sizeVariants[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
