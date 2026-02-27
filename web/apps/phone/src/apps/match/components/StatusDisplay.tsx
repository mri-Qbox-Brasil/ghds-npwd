import React from 'react';
import { cn } from '@utils/cn';

interface StatusDisplayProps {
  className?: string;
  visible: boolean;
  text: string;
}

function StatusDisplay({ className, visible, text }: StatusDisplayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none transition-all duration-300 transform",
        visible ? "opacity-100 scale-110" : "opacity-0 scale-90",
        className
      )}
    >
      <span className="px-4 py-2 border-[6px] rounded-2xl font-black text-4xl uppercase tracking-tighter">
        {text}
      </span>
    </div>
  );
}

export default StatusDisplay;
