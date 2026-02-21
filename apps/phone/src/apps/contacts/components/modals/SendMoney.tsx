import React, { useState } from 'react';
import { Modal, TextField } from '@ui/components';
import { useTranslation } from 'react-i18next';
import { Button } from '@ui/components/Button';
import { useContactsAPI } from '../../hooks/useContactsAPI';
import { DollarSign } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';

interface SendMoneyModalProps {
  open: boolean;
  closeModal: () => void;
  openContact: string;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  open,
  closeModal,
  openContact,
}) => {
  const { payContact } = useContactsAPI();
  const [t] = useTranslation();

  const [amount, setAmount] = useState(500);

  const handleAmountChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    const parsed = parseInt(inputVal);
    setAmount(isNaN(parsed) ? 0 : parsed);
  };

  const sendContactMoney = () => {
    if (amount && amount > 0) {
      closeModal();
      payContact({ number: openContact, amount: amount });
    }
  };

  return (
    <Modal visible={open} handleClose={closeModal}>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-1 items-center text-center">
          <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
            <DollarSign size={32} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {t('CONTACTS.SENDMONEY')}
          </h2>
          <p className="text-xs text-neutral-400 font-medium">
            Insira o valor que deseja enviar para {openContact}
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-lg leading-none">
              $
            </div>
            <TextField
              className="pl-8 h-14 bg-neutral-100 dark:bg-neutral-800 border-none rounded-2xl text-xl font-bold focus:ring-2 focus:ring-amber-500/20"
              placeholder={t('CONTACTS.AMOUNT') as unknown as string}
              type="number"
              value={amount}
              onChange={handleAmountChange}
              autoFocus
            />
          </div>

          <NPWDButton
            onClick={sendContactMoney}
            disabled={!amount || amount <= 0}
            className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400"
          >
            {t('GENERIC.SEND')}
          </NPWDButton>

          <button
            onClick={closeModal}
            className="w-full py-2 text-sm font-medium text-neutral-400 hover:text-neutral-500 transition-colors"
          >
            {t('GENERIC_CANCEL')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
