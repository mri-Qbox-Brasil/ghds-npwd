import React, { useState } from 'react';
import { Modal2 } from '@ui/components/Modal';
import { useTranslation } from 'react-i18next';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { Search, User, X, Check, BookUser, Share2 } from 'lucide-react';
import { cn } from '@utils/cn';

interface MessageContactModalProps {
  isVisible: boolean;
  onClose: () => void;
  messageGroup: MessageConversation | undefined;
}

const MessageContactModal: React.FC<MessageContactModalProps> = ({
  isVisible,
  onClose,
  messageGroup,
}) => {
  const [t] = useTranslation();
  const contacts = useContactsValue();
  const [selectedContact, setSelectContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { sendEmbedMessage } = useMessageAPI();
  const { activeMessageConversation } = useMessages();

  const filteredContacts = contacts.filter(contact =>
    contact.display.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.number.includes(searchTerm)
  );

  const handleSendEmbedMessage = () => {
    if (!messageGroup || !selectedContact) return;
    sendEmbedMessage({
      conversationId: messageGroup.id,
      conversationList: activeMessageConversation.conversationList,
      embed: { type: 'contact', ...selectedContact },
      tgtPhoneNumber: messageGroup.participant,
      message: t('MESSAGES.CONTACT_SHARED') as string,
    });
    onClose();
    setSelectContact(null);
    setSearchTerm("");
  };

  return (
    <Modal2 visible={isVisible} handleClose={onClose} className="p-0 overflow-hidden bg-neutral-50 dark:bg-neutral-900 rounded-3xl">
      <header className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <BookUser size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic">Compartilhar Contato</h2>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-red-500 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
      </header>

      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            className="w-full h-12 pl-12 pr-4 bg-white dark:bg-neutral-800 border-none rounded-2xl text-sm font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
            placeholder="Buscar contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>

        <div className="space-y-1 py-2">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectContact(contact)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent active:scale-[0.98] group font-bold tracking-tight",
                  selectedContact?.id === contact.id
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors",
                    selectedContact?.id === contact.id ? "bg-white/20" : "bg-neutral-100 dark:bg-neutral-700"
                  )}>
                    {contact.avatar ? (
                      <img src={contact.avatar} className="h-full w-full object-cover rounded-2xl" alt="avatar" />
                    ) : (
                      <User size={22} />
                    )}
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="truncate">{contact.display}</span>
                    <span className={cn(
                      "text-[10px] uppercase tracking-widest font-black",
                      selectedContact?.id === contact.id ? "text-white/60" : "text-neutral-400"
                    )}>
                      {contact.number}
                    </span>
                  </div>
                </div>
                {selectedContact?.id === contact.id ? (
                  <Check size={20} strokeWidth={4} />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-neutral-200 dark:border-neutral-700" />
                )}
              </button>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-20 text-neutral-400 gap-2">
              <Search size={48} />
              <p className="font-bold uppercase tracking-widest text-xs italic">Nenhum contato encontrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
        <button
          disabled={!selectedContact}
          onClick={handleSendEmbedMessage}
          className={cn(
            "w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3",
            !selectedContact
              ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/30"
          )}
        >
          <Share2 size={20} strokeWidth={3} />
          {t('GENERIC.SHARE')}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-3 py-3 text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-red-500 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </Modal2>
  );
};

export default MessageContactModal;
