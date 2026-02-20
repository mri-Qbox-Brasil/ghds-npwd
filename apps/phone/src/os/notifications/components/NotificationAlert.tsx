import { X } from 'lucide-react';
import { Flex } from '@ui/components/ui/flex';
import { Slide } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import { useCurrentCallValue } from '@os/call/hooks/state';

export const NotificationAlert = () => {
  const { currentAlert } = useNotifications();
  const call = useCurrentCallValue();

  return (
    <div className="mt-[-710px] flex justify-center items-center">
      <Slide in={!!currentAlert} mountOnEnter unmountOnExit>
        <div style={{ position: 'relative' }}>
          {currentAlert && (
            <Flex
              onClick={(e) => {
                if (!call) currentAlert?.onClickAlert?.(e);
              }}
              className="relative cursor-pointer w-[370px] h-[80px] z-50 bg-paper text-foreground rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.35)] border border-border/50 overflow-hidden"
            >
              <Flex className="absolute top-2 right-4">
                <button
                  className="p-1 hover:bg-muted/50 rounded-full text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    currentAlert?.onCloseAlert?.(e);
                  }}
                >
                  <X size={20} />
                </button>
              </Flex>

              {currentAlert?.icon && (
                <Flex align="center" justify="center" className="py-2 pl-4 pr-3 text-foreground">
                  {currentAlert.icon as React.ReactNode}
                </Flex>
              )}

              <Flex direction="col" justify="center" className={`py-2 px-4 w-full ${currentAlert?.icon ? '' : 'pl-4'}`}>
                <div className="w-[282px] whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
                  {currentAlert?.title as React.ReactNode}
                </div>
                <div className="break-all max-w-[360px] h-[20px] mx-auto line-clamp-3 overflow-hidden text-ellipsis text-sm text-muted-foreground w-full">
                  {currentAlert?.content as React.ReactNode}
                </div>
              </Flex>
            </Flex>
          )}
        </div>
      </Slide>
    </div>
  );
};
