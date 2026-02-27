import React from 'react';
import { cn } from '@utils/cn';

export const StyledMessage: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={cn("p-4 bg-neutral-100 dark:bg-white/5 rounded-2xl flex items-center gap-4", className)}>
    {children}
  </div>
);

export const AudioMessage: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={cn("w-full flex flex-col items-start gap-1 p-3 bg-neutral-100 dark:bg-white/5 rounded-2xl", className)}>
    {children}
  </div>
);

export default StyledMessage;
