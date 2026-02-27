import React from 'react';
import Modal from '@ui/components/Modal';
import { User, UserPlus, ShieldIcon } from 'lucide-react';
import { findParticipants } from '../../utils/helpers';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { cn } from '@utils/cn';

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  conversationList: string;
  addContact: (number: any) => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  conversationList,
  addContact,
}) => {
  const myPhoneNumber = useMyPhoneNumber();
  const { getContactByNumber } = useContactActions();

  const participants = findParticipants(conversationList, myPhoneNumber);

  const findContact = (phoneNumber: string) => {
    return getContactByNumber(phoneNumber);
  };

  return (
    <Modal visible={open} handleClose={onClose} className="p-0 overflow-hidden bg-neutral-50 dark:bg-neutral-900 rounded-3xl">
      <header className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
            <ShieldIcon size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Membros do Grupo</h2>
        </div>
      </header>

      <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
        {participants.map((participant) => {
          const contact = findContact(participant);

          return (
            <div
              key={participant}
              className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800/40 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm transition-all hover:border-blue-500/30 group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:text-blue-500 transition-colors">
                  {contact?.avatar ? (
                    <img src={contact.avatar} className="h-full w-full object-cover rounded-2xl" alt="avatar" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {contact?.display ?? "Desconhecido"}
                  </span>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    {participant}
                  </span>
                </div>
              </div>

              {!contact && (
                <button
                  onClick={() => addContact(participant)}
                  className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-90"
                >
                  <UserPlus size={20} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 pt-2 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all active:scale-95"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
};

export default GroupDetailsModal;
