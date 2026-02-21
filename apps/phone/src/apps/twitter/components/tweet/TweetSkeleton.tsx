import React from 'react';

export default function TweetSkeleton() {
  return (
    <div className="w-full p-4 flex flex-col gap-3 animate-pulse border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-row items-start gap-4">
        <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
        <div className="flex flex-col flex-1 gap-2 mt-1">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
          <div className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-full mt-2" />
        </div>
      </div>
    </div>
  );
}
