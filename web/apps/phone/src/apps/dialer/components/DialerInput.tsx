import React, { useContext } from 'react';
import { Phone, Delete } from 'lucide-react';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCall } from '@os/call/hooks/useCall';
import { cn } from '@utils/cn';

export const DialerDisplay: React.FC = () => {
  const history = useHistory();
  const [t] = useTranslation();
  const { inputVal } = useContext<IDialInputCtx>(DialInputCtx);

  const handleNewContact = () => {
    history.push(`/contacts/-1/?addNumber=${inputVal}&referal=/phone/contacts`);
  };

  return (
    <div className="w-full flex flex-col items-center min-h-[100px] justify-center overflow-hidden py-4">
      <div className="w-full text-center text-[48px] font-light text-foreground tracking-tight h-[60px] flex items-center justify-center transition-colors duration-300">
        {inputVal || ""}
      </div>

      <div className="h-6 mt-1">
        {inputVal.length > 0 && (
          <button
            className="text-[#007AFF] text-[17px] hover:opacity-70 transition-opacity animate-in fade-in"
            onClick={handleNewContact}
          >
            {t('CONTACTS.MODAL_BUTTON_ADD', 'Adicionar Número') as string}
          </button>
        )}
      </div>
    </div>
  );
};

export const DialerControls: React.FC = () => {
  const { initializeCall } = useCall();
  const { inputVal, removeOne } = useContext<IDialInputCtx>(DialInputCtx);

  const handleCall = () => {
    if (!inputVal) return;
    initializeCall(inputVal);
  };

  return (
    <div className="flex items-center justify-center gap-12 w-full pt-2 pb-8">
      <div className="w-12 h-12" /> {/* Left Spacer */}

      <button
        onClick={handleCall}
        className={cn(
          "h-[78px] w-[78px] rounded-full flex items-center justify-center text-white transition-all duration-300",
          inputVal ? "bg-[#34C759] scale-100 opacity-100" : "bg-[#34C759] scale-90 opacity-20 cursor-not-allowed"
        )}
      >
        <Phone size={36} fill="currentColor" strokeWidth={0} />
      </button>

      <button
        onClick={() => removeOne()}
        className={cn(
          "h-12 w-12 flex items-center justify-center text-neutral-400 dark:text-white/40 hover:text-neutral-600 dark:hover:text-white transition-all active:scale-90",
          !inputVal && "opacity-0 pointer-events-none"
        )}
      >
        <Delete size={32} />
      </button>
    </div>
  );
};
