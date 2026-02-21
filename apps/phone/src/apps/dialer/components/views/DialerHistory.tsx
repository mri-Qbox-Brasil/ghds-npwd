import React, { useCallback } from 'react';
import { List, ListItem, NPWDButton } from '@npwd/keyos';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { CallHistoryItem } from '@typings/call';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useDialHistory } from '../../hooks/useDialHistory';
import { useCall } from '@os/call/hooks/useCall';
import { useContacts } from '../../../contacts/hooks/state';
import { Phone, PhoneForwarded, PhoneIncoming, Info } from 'lucide-react';
import { cn } from '@utils/cn';
import { AppWrapper, AppContent } from '@ui/components';

export const DialerHistory: React.FC = () => {
  const myNumber = useMyPhoneNumber();
  const { getDisplayByNumber } = useContactActions();
  const { initializeCall } = useCall();
  const calls = useDialHistory();
  const contacts = useContacts();
  const history = useHistory();
  const [t] = useTranslation();

  const handleCall = (phoneNumber: string) => {
    initializeCall(phoneNumber);
  };

  const getDisplay = useCallback(
    (number: string) => (contacts.length ? getDisplayByNumber(number) : number),
    [contacts, getDisplayByNumber],
  );

  if (!calls?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 opacity-60">
        <span className="text-4xl mb-2">😞</span>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {t('DIALER.NO_HISTORY') as string}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-500">
      <div className="px-6 pb-4">
        <h1 className="text-[34px] font-bold text-foreground tracking-tight">Recentes</h1>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col">
          {calls.map((call: CallHistoryItem) => {
            const isOutgoing = call.transmitter === myNumber;
            const isMissed = !isOutgoing && !call.isAnonymous; // Simplified logic for missed calls
            const displayNum = isOutgoing ? call.receiver : (call.isAnonymous ? 'Privado' : call.transmitter);
            const displayName = isOutgoing ? getDisplay(call.receiver) : (call.isAnonymous ? t('DIALER.ANONYMOUS') : getDisplay(call.transmitter));

            const callTime = dayjs.unix(parseInt(call.start));
            const callDate = callTime.isSame(dayjs(), 'day')
              ? callTime.format('HH:mm')
              : callTime.isSame(dayjs().subtract(1, 'day'), 'day')
                ? 'Ontem'
                : callTime.format('DD/MM/YYYY');

            return (
              <div
                key={call.id}
                className="group px-6 py-3 border-b border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between active:bg-neutral-100 dark:active:bg-neutral-800/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1" onClick={() => !call.isAnonymous && handleCall(displayNum)}>
                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      "text-[17px] font-semibold truncate leading-tight",
                      isMissed ? "text-[#FF3B30]" : "text-foreground"
                    )}>
                      {displayName}
                    </span>
                    <span className="text-[14px] text-neutral-500 font-normal">
                      {isOutgoing ? 'Chamada efetuada' : 'Chamada recebida'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[15px] text-neutral-500 tabular-nums">
                    {callDate}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(`/contacts/-1?addNumber=${displayNum}&referal=/phone/contacts`);
                    }}
                    className="p-1 text-[#007AFF] hover:opacity-70 transition-opacity"
                  >
                    <Info size={22} className="stroke-[1.5px]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
