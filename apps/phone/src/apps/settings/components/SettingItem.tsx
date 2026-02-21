import React from 'react';
import { LucideIcon, PlayCircle } from "lucide-react";
import { cn } from '@utils/cn';

interface SettingItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  Icon: LucideIcon;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  options,
  label,
  value,
  onClick,
  Icon,
}) => (
  <button
    onClick={() => onClick?.(options, label)}
    className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-800/40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all border-b border-neutral-100 dark:border-neutral-800 last:border-none group"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-blue-500 transition-colors">
        <Icon size={20} />
      </div>
      <div className="flex flex-col items-start translate-y-[1px]">
        <span className="font-bold text-sm text-neutral-900 dark:text-white">{label}</span>
        {value && <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{value.toString()}</span>}
      </div>
    </div>
    <div className="text-neutral-300 dark:text-neutral-600 group-hover:text-blue-500 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
    </div>
  </button>
);

interface SoundItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  Icon: LucideIcon;
  tooltip: string;
  onPreviewClicked: any;
}

export const SoundItem: React.FC<SoundItemProps> = ({
  options,
  label,
  value,
  onClick,
  Icon,
  onPreviewClicked,
}) => (
  <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-800/40 border-b border-neutral-100 dark:border-neutral-800 last:border-none group">
    <button
      onClick={() => onClick?.(options, label)}
      className="flex-1 flex items-center gap-4 text-left"
    >
      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-blue-500 transition-colors">
        <Icon size={20} />
      </div>
      <div className="flex flex-col items-start translate-y-[1px]">
        <span className="font-bold text-sm text-neutral-900 dark:text-white">{label}</span>
        {value && <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{value.toString()}</span>}
      </div>
    </button>

    <button
      className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-90 shadow-sm"
      onClick={(e) => {
        e.stopPropagation();
        onPreviewClicked?.(options, label);
      }}
    >
      <PlayCircle size={20} />
    </button>
  </div>
);

interface SettingSliderProps {
  label: string;
  icon: JSX.Element;
  value: number;
  onCommit: (value: number | number[]) => void;
}

export const SettingItemSlider: React.FC<SettingSliderProps> = ({
  icon,
  label,
  value,
  onCommit,
}) => (
  <div className="w-full flex flex-col p-4 bg-white dark:bg-neutral-800/40 border-b border-neutral-100 dark:border-neutral-800 last:border-none gap-4">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
        {icon}
      </div>
      <div className="flex flex-col items-start translate-y-[1px]">
        <span className="font-bold text-sm text-neutral-900 dark:text-white">{label}</span>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{value}%</span>
      </div>
    </div>
    <div className="px-2">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onCommit(parseInt(e.target.value, 10))}
        className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  </div>
);

interface SettingSwitchProps {
  label: string;
  value: boolean;
  onClick: any;
  icon: JSX.Element;
  secondary: string;
}

export const SettingSwitch: React.FC<SettingSwitchProps> = ({
  label,
  value,
  onClick,
  icon,
  secondary,
}) => (
  <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-800/40 border-b border-neutral-100 dark:border-neutral-800 last:border-none group">
    <div className="flex items-center gap-4 flex-1">
      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-blue-500 transition-colors">
        {icon}
      </div>
      <div className="flex flex-col items-start translate-y-[1px] min-w-0 pr-2">
        <span className="font-bold text-sm text-neutral-900 dark:text-white truncate w-full">{label}</span>
        <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 line-clamp-1">{secondary}</p>
      </div>
    </div>

    <button
      onClick={() => onClick(value)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        value ? "bg-blue-500" : "bg-neutral-200 dark:bg-neutral-700"
      )}
    >
      <span className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
        value ? "translate-x-5" : "translate-x-1"
      )} />
    </button>
  </div>
);

interface SettingItemIconActionProps {
  Icon: LucideIcon;
  actionIcon: JSX.Element;
  label: string;
  labelSecondary: string;
  handleAction: () => void;
  actionLabel: string;
}

export const SettingItemIconAction: React.FC<SettingItemIconActionProps> = ({
  Icon,
  label,
  handleAction,
  actionIcon,
  labelSecondary,
}) => (
  <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-800/40 border-b border-neutral-100 dark:border-neutral-800 last:border-none group">
    <div className="flex items-center gap-4 flex-1">
      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-blue-500 transition-colors">
        <Icon size={20} />
      </div>
      <div className="flex flex-col items-start translate-y-[1px]">
        <span className="font-bold text-sm text-neutral-900 dark:text-white">{label}</span>
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{labelSecondary}</span>
      </div>
    </div>

    <button
      className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 hover:text-blue-500 transition-all active:scale-90"
      onClick={handleAction}
    >
      {actionIcon}
    </button>
  </div>
);
