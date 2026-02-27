import React from 'react';
import { cn } from '@utils/cn';

export default function MessageSkeleton({ height, isMine = false }) {
  return (
    <div
      className={cn(
        "w-full flex mb-4 animate-pulse px-2",
        isMine ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "bg-neutral-200 dark:bg-neutral-800 rounded-2xl shadow-sm",
          isMine ? "rounded-tr-sm" : "rounded-tl-sm"
        )}
        style={{
          width: `${Math.random() * (120) + 120}px`,
          height: `${height}px`
        }}
      />
    </div>
  );
}
