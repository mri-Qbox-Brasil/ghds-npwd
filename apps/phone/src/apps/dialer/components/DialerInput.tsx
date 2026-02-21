import React, { useContext } from 'react';
import { Phone, Delete } from 'lucide-react';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCall } from '@os/call/hooks/useCall';
import { cn } from '@utils/cn';

export const DialerInput: React.FC = () => {
  const history = useHistory();
  const [t] = useTranslation();
  const { initializeCall } = useCall();
  const { inputVal, set, removeOne } = useContext<IDialInputCtx>(DialInputCtx);

  const handleCall = () => {
    if (!inputVal) return;
    initializeCall(inputVal);
  };

  const handleNewContact = () => {
    history.push(`/contacts/-1/?addNumber=${inputVal}&referal=/phone/contacts`);
  };

  return (
    <div className="flex flex-col items-center w-full gap-4 pt-4">
      <div className="relative w-full flex flex-col items-center min-h-[80px] justify-center">
        <input
          type="text"
          readOnly
          placeholder={t('DIALER.INPUT_PLACEHOLDER') as unknown as string}
          className="w-full bg-transparent border-none outline-none text-center text-4xl font-medium text-neutral-900 dark:text-white placeholder:text-neutral-200 dark:placeholder:text-neutral-800"
          value={inputVal}
        />

        {inputVal.length > 0 && (
          <button
            className="mt-2 text-blue-500 font-medium text-sm hover:underline animate-in fade-in slide-in-from-top-1"
            onClick={handleNewContact}
          >
            {t('CONTACTS.MODAL_BUTTON_ADD')}
          </button>
        )}
      </div>

      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
        <div className="w-12" /> {/* Spacer para equilibrar o botão de apagar */}

        <button
          disabled={!inputVal}
          onClick={handleCall}
          className={cn(
            "h-20 w-20 rounded-full flex items-center justify-center text-white transition-all shadow-lg active:scale-95",
            inputVal
              ? "bg-green-500 shadow-green-500/30 hover:bg-green-600"
              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 opacity-50 cursor-not-allowed"
          )}
        >
          <Phone size={32} fill="currentColor" />
        </button>

        <button
          onClick={() => removeOne()}
          className={cn(
            "h-12 w-12 flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-all active:scale-90",
            !inputVal && "opacity-0 pointer-events-none"
          )}
        >
          <Delete size={28} />
        </button>
      </div>
    </div>
  );
};
