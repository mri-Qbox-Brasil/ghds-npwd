import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@utils/cn';

export interface IContextMenuOption {
  onClick(e: React.MouseEvent, option: IContextMenuOption): void;
  label: string;
  description?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  key?: string;
  destructive?: boolean;
}

interface ContextMenuProps {
  open: boolean;
  onClose: () => void;
  options: Array<IContextMenuOption>;
  settingLabel?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  open,
  onClose,
  options,
  settingLabel,
}) => {
  const [visible, setVisible] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (open) {
      setRender(true);
      // Wait a tick to allow the element to mount before animating
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!render) return null;

  const content = (
    <div className="absolute inset-0 z-[10000] flex flex-col justify-end pointer-events-auto">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity duration-300 ease-out",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        className={cn(
          "relative w-full px-2 pb-[34px] flex flex-col gap-2 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          visible ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Options Group */}
        <div className="w-full bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl rounded-[14px] overflow-hidden flex flex-col shadow-xl">

          {settingLabel && (
            <div className="px-4 py-3.5 text-center text-[13px] font-medium text-neutral-500 dark:text-neutral-400 border-b border-black/5 dark:border-white/10 shrink-0">
              {settingLabel}
            </div>
          )}

          <div className="flex flex-col overflow-y-auto max-h-[65vh] divide-y divide-black/5 dark:divide-white/10 overscroll-contain">
            {options.map((option, idx) => (
              <button
                key={option.key || idx}
                onClick={(e) => {
                  option.onClick(e, option);
                  onClose();
                }}
                className={cn(
                  "w-full shrink-0 flex items-center justify-between px-5 min-h-[56px] transition-colors hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10",
                  option.selected ? "bg-black/5 dark:bg-white/5" : ""
                )}
              >
                <span className={cn(
                  "text-[20px] font-normal truncate",
                  option.destructive ? "text-red-500" : "text-blue-500 dark:text-blue-400"
                )}>
                  {option.label}
                </span>
                {option.icon && (
                  <div className={cn(
                    "opacity-90 shrink-0",
                    option.destructive ? "text-red-500" : "text-blue-500 dark:text-blue-400"
                  )}>
                    {/* Clone element to force sizes if it's a valid React element */}
                    {React.isValidElement(option.icon)
                      ? React.cloneElement(option.icon as React.ReactElement, { size: 22 })
                      : option.icon}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full min-h-[56px] shrink-0 bg-white dark:bg-[#1C1C1E] rounded-[14px] text-[20px] font-semibold text-blue-500 dark:text-blue-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700 shadow-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById('phone') || document.body);
};
