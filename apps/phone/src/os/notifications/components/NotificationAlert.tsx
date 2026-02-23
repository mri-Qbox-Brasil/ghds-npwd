import { X } from 'lucide-react';
import { Flex } from '@ui/components/ui/flex';
import { cn } from '@utils/css';
import { useNotifications } from '../hooks/useNotifications';
import { useCurrentCallValue } from '@os/call/hooks/state';

export const NotificationAlert = () => {
  const { currentAlert } = useNotifications();
  const call = useCurrentCallValue();

  return (
    <div className="absolute top-2 inset-x-0 z-[100] flex justify-center items-start pointer-events-none">
      <div
        className={cn(
          "relative transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
          currentAlert ? "translate-y-0 opacity-100 pointer-events-auto scale-100" : "-translate-y-[150%] opacity-0 scale-95"
        )}
      >
        {currentAlert && (
          <div
            onClick={(e) => {
              if (!call) currentAlert?.onClickAlert?.(e);
            }}
            className="relative cursor-pointer w-[360px] min-h-[72px] mx-auto z-50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-3xl text-neutral-900 dark:text-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/20 dark:border-white/10 overflow-hidden flex"
          >
            {currentAlert?.icon && (
              <div className="flex items-center justify-center py-3 pl-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center shadow-sm">
                  {currentAlert.icon as React.ReactNode}
                </div>
              </div>
            )}

            <div className={`flex flex-col justify-center py-3 pr-4 flex-1 ${currentAlert?.icon ? 'pl-3' : 'pl-5'}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-[15px] leading-tight line-clamp-1">
                  {currentAlert?.title as React.ReactNode}
                </span>
                <button
                  className="p-1 -mr-2 -mt-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-neutral-400 dark:text-neutral-500 transition-colors shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    currentAlert?.onCloseAlert?.(e);
                  }}
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {currentAlert?.content && (
                <div className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2 mt-0.5">
                  {currentAlert?.content as React.ReactNode}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
