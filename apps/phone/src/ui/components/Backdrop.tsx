import React from 'react';
import { cn } from '@utils/cn';

const Backdrop: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-black/60 z-[5] animate-in fade-in duration-300",
        className
      )}
      {...props}
    />
  );
};

export default Backdrop;
