import React from 'react';

export const SettingsCategory: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-8 animate-in fade-in duration-500">
      <h3 className="px-8 mb-2 text-[13px] font-normal uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
        {title}
      </h3>
      <div className="mx-4 overflow-hidden rounded-[10px] bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-white/5 shadow-none">
        {children}
      </div>
    </div>
  );
};
