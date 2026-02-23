import React from 'react';
import { LucideIcon, PlayCircle } from "lucide-react";
import { cn } from '@utils/cn';

interface SettingItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  Icon: LucideIcon;
  iconBg?: string;
}

interface SettingItemProps {
  options?: any;
  label: string;
  value?: string | object | number | null;
  onClick?: any;
  Icon: LucideIcon;
  iconBg?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  options,
  label,
  value,
  onClick,
  Icon,
  iconBg = "bg-blue-500",
}) => (
  <button
    onClick={() => onClick?.(options, label)}
    className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-100 dark:border-white/5 last:border-none group shadow-none"
  >
    <div className="flex items-center gap-3">
      <div className={cn("w-[29px] h-[29px] rounded-[7px] flex items-center justify-center text-white shrink-0", iconBg)}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[17px] font-normal text-neutral-900 dark:text-white tracking-tight">{label}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-[17px] font-normal text-neutral-400 dark:text-neutral-500">{value.toString()}</span>}
      <div className="text-neutral-300 dark:text-neutral-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </div>
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
  iconBg?: string;
}

export const SoundItem: React.FC<SoundItemProps> = ({
  options,
  label,
  value,
  onClick,
  Icon,
  onPreviewClicked,
  iconBg = "bg-orange-500",
}) => (
  <div className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-white/5 last:border-none group">
    <button
      onClick={() => onClick?.(options, label)}
      className="flex-1 flex items-center gap-3 text-left"
    >
      <div className={cn("w-[29px] h-[29px] rounded-[7px] flex items-center justify-center text-white shrink-0", iconBg)}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-start translate-y-[0px]">
        <span className="text-[17px] font-normal text-neutral-900 dark:text-white tracking-tight">{label}</span>
      </div>
    </button>

    <div className="flex items-center gap-2">
      {value && <span className="text-[17px] font-normal text-neutral-400 dark:text-neutral-500">{value.toString()}</span>}
      <button
        className="p-1.5 rounded-full text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onPreviewClicked?.(options, label);
        }}
      >
        <PlayCircle size={22} strokeWidth={2} />
      </button>
      <div className="text-neutral-300 dark:text-neutral-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </div>
    </div>
  </div>
);

interface SettingSliderProps {
  label: string;
  icon: JSX.Element;
  value: number;
  onCommit: (value: number | number[]) => void;
  iconBg?: string;
  min?: number;
  max?: number;
}

export const SettingItemSlider: React.FC<SettingSliderProps> = ({
  icon,
  label,
  value,
  onCommit,
  iconBg = "bg-orange-500",
  min = 0,
  max = 100,
}) => (
  <div className="w-full flex flex-col pl-4 pr-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-white/5 last:border-none gap-3">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className={cn("w-[29px] h-[29px] rounded-[7px] flex items-center justify-center text-white shrink-0", iconBg)}>
          {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: 2.5 })}
        </div>
        <span className="text-[17px] font-normal text-neutral-900 dark:text-white tracking-tight">{label}</span>
      </div>
      <span className="text-[17px] font-normal text-neutral-400 dark:text-neutral-500">{value}%</span>
    </div>
    <div className="px-1">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onCommit(parseInt(e.target.value, 10))}
        className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer accent-blue-500"
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
  iconBg?: string;
}

export const SettingSwitch: React.FC<SettingSwitchProps> = ({
  label,
  value,
  onClick,
  icon,
  secondary,
  iconBg = "bg-neutral-400",
}) => (
  <div className="w-full flex items-center justify-between pl-4 pr-4 py-2 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-white/5 last:border-none group">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className={cn("w-[29px] h-[29px] rounded-[7px] flex items-center justify-center text-white shrink-0", iconBg)}>
        {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: 2.5 })}
      </div>
      <div className="flex flex-col items-start min-w-0 pr-2">
        <span className="text-[17px] font-normal text-neutral-900 dark:text-white tracking-tight truncate w-full">{label}</span>
        {secondary && <p className="text-[12px] font-normal text-neutral-400 dark:text-neutral-500 leading-tight">{secondary}</p>}
      </div>
    </div>

    <button
      onClick={() => onClick(value)}
      className={cn(
        "relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        value ? "bg-[#34C759]" : "bg-[#E9E9EA] dark:bg-[#39393D]"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-[27px] w-[27px] transform rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)] transition duration-200 ease-in-out",
          value ? "translate-x-[20px]" : "translate-x-0"
        )}
      />
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
  iconBg?: string;
}

export const SettingItemIconAction: React.FC<SettingItemIconActionProps> = ({
  Icon,
  label,
  handleAction,
  actionIcon,
  labelSecondary,
  iconBg = "bg-blue-500",
}) => (
  <div className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-white/5 last:border-none group">
    <div className="flex items-center gap-3 flex-1">
      <div className={cn("w-[29px] h-[29px] rounded-[7px] flex items-center justify-center text-white shrink-0", iconBg)}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[17px] font-normal text-neutral-900 dark:text-white tracking-tight">{label}</span>
      </div>
    </div>

    <div className="flex items-center gap-2">
      {labelSecondary && <span className="text-[17px] font-normal text-neutral-400 dark:text-neutral-500">{labelSecondary}</span>}
      <button
        className="p-1.5 rounded-full text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
        onClick={handleAction}
      >
        {React.cloneElement(actionIcon as React.ReactElement, { size: 18, strokeWidth: 2 })}
      </button>
      <div className="text-neutral-300 dark:text-neutral-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </div>
    </div>
  </div>
);
