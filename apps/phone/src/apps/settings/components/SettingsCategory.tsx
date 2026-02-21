import React from 'react';

export const SettingsCategory: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h3 className="px-5 mb-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 italic">
        {title}
      </h3>
      <div className="mx-4 overflow-hidden rounded-[24px] border border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/30 shadow-sm backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};
