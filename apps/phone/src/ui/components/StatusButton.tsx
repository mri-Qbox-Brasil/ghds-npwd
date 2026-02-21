import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { cn } from '@utils/cn';

type StatusButtonStyleColor = 'success' | 'error' | 'warning' | 'info';

interface StatusButtonProps extends Omit<ButtonProps, 'color'> {
  color?: StatusButtonStyleColor;
}

const colorVariants: Record<StatusButtonStyleColor, Record<string, string>> = {
  success: {
    ghost: 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30',
    outline: 'border-green-600/50 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-600',
    default: 'bg-green-600 text-white hover:bg-green-700',
  },
  error: {
    ghost: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30',
    outline: 'border-red-600/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-600',
    default: 'bg-red-600 text-white hover:bg-red-700',
  },
  warning: {
    ghost: 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30',
    outline: 'border-yellow-600/50 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 hover:border-yellow-600',
    default: 'bg-yellow-500 text-white hover:bg-yellow-600',
  },
  info: {
    ghost: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30',
    outline: 'border-blue-600/50 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-600',
    default: 'bg-blue-600 text-white hover:bg-blue-700',
  },
};

export const StatusButton: React.FC<StatusButtonProps> = ({
  color = 'info',
  variant = 'default',
  className,
  ...props
}) => {
  const variantKey = variant === 'ghost' ? 'ghost' : variant === 'outline' ? 'outline' : 'default';

  return (
    <Button
      variant={variant as any}
      className={cn(colorVariants[color][variantKey], className)}
      {...props}
    />
  );
};
