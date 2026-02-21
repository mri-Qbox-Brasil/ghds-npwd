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
import { Phone, PhoneForwarded, PhoneIncoming, UserRoundPlus } from 'lucide-react';
import { cn } from '@utils/cn';

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
          {t('DIALER.NO_HISTORY')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-20 animate-in fade-in duration-300">
      <div className="mt-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700/50 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700/50">
        <List className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
          {calls.map((call: CallHistoryItem) => {
            const isOutgoing = call.transmitter === myNumber;
            const displayNum = isOutgoing ? call.receiver : (call.isAnonymous ? 'Privado' : call.transmitter);
            const displayName = isOutgoing ? getDisplay(call.receiver) : (call.isAnonymous ? t('DIALER.ANONYMOUS') : getDisplay(call.transmitter));
            const callDate = dayjs().to(dayjs.unix(parseInt(call.start)));
            const isUnknown = displayName === displayNum && !call.isAnonymous;

            return (
              <ListItem
                key={call.id}
                className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                    isOutgoing ? "bg-green-100 dark:bg-green-500/10 text-green-600" : "bg-red-100 dark:bg-red-500/10 text-red-500"
                  )}>
                    {isOutgoing ? <PhoneForwarded size={18} /> : <PhoneIncoming size={18} />}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      "font-bold truncate leading-none mb-1",
                      !isOutgoing && !call.isAnonymous ? "text-red-500" : "text-neutral-900 dark:text-white"
                    )}>
                      {displayName}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">{callDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isUnknown && !call.isAnonymous && (
                    <NPWDButton
                      onClick={() => history.push(`/contacts/-1?addNumber=${displayNum}&referal=/phone/contacts`)}
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    >
                      <UserRoundPlus size={18} />
                    </NPWDButton>
                  )}
                  <NPWDButton
                    onClick={() => !call.isAnonymous && handleCall(displayNum)}
                    size="icon"
                    variant="ghost"
                    disabled={call.isAnonymous}
                    className="h-10 w-10 rounded-xl text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 disabled:opacity-30"
                  >
                    <Phone size={18} fill="currentColor" />
                  </NPWDButton>
                </div>
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  );
};
