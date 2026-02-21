import React from 'react';
import { ListItem, List } from '@npwd/keyos';
import { X } from 'lucide-react';

export interface IContextMenuOption {
  onClick(e: React.MouseEvent, option: IContextMenuOption): void;
  label: string;
  description?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  key?: string;
}

interface ContextMenuProps {
  open: boolean;
  onClose: () => void;
  options: Array<IContextMenuOption>;
  settingLabel: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  open,
  onClose,
  options,
  settingLabel,
}) => {
  if (!open) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[9999] animate-in slide-in-from-bottom duration-300">
      <div className="max-h-[70%] min-h-[10%] w-full overflow-hidden rounded-t-2xl border-t border-neutral-800 bg-neutral-100 p-2 text-white dark:bg-neutral-900">
        <div className="flex items-center justify-between px-2">
          <p className="text-base font-medium text-neutral-900 dark:text-neutral-50">
            {settingLabel}
          </p>
          <button onClick={onClose} className="text-neutral-900 dark:text-neutral-50 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-auto max-h-[500px] pb-4">
          <List>
            {options.map((option, idx) => (
              <ListItem
                key={option.key || idx}
                startElement={option.icon}
                primaryText={option.label}
                secondaryText={option.description}
                button
                selected={option.selected}
                onClick={(e) => {
                  option.onClick(e, option);
                  onClose();
                }}
              />
            ))}
          </List>
        </div>
      </div>
    </div>
  );
};
