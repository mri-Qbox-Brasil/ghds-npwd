import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@utils/cn';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ height, className, ...props }) => (
  <div
    className={cn(
      "flex items-center justify-center w-full",
      className
    )}
    style={{ height: height ?? '100%' }}
    {...props}
  >
    <Loader2 className="animate-spin text-primary w-8 h-8 opacity-70" />
  </div>
);
