import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { PreDBConversation } from '@typings/messages';
import { PreDBContact } from '@typings/contact';
import { Search, User, X, Check, Users, Plus } from 'lucide-react';
import { cn } from '@utils/cn';
import { DynamicHeader } from '../../../../ui/components/DynamicHeader';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const history = useHistory();
  const [t] = useTranslation();
  const [participants, setParticipants] = useState<PreDBContact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversationLabel, setConversationLabel] = useState<string>('');
  const { getContactByNumber } = useContactActions();
  const contacts = useContactsValue();
  const { addConversation } = useMessageAPI();
  const myPhoneNumber = useMyPhoneNumber();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isGroupChat = participants.length > 1;

  const handleSubmit = () => {
    const selectedParticipants = participants.map((participant) => participant.number);
    const dto: PreDBConversation = {
      conversationLabel: isGroupChat ? conversationLabel : '',
      participants: [myPhoneNumber, ...selectedParticipants],
      isGroupChat,
    };
    addConversation(dto);
  };

  useEffect(() => {
    if (phoneNumber) {
      const contact = getContactByNumber(phoneNumber) || {
        display: '',
        number: phoneNumber,
      };
      setParticipants([contact]);
    }
  }, [phoneNumber, getContactByNumber]);

  const handleCancel = () => {
    history.goBack();
  };

  const toggleParticipant = (contact: any) => {
    const exists = participants.find(p => p.number === contact.number);
    if (exists) {
      setParticipants(participants.filter(p => p.number !== contact.number));
    } else {
      setParticipants([...participants, contact]);
    }
    setSearchTerm("");
  };

  const addManualNumber = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    if (participants.find(p => p.number === trimmed)) {
      setSearchTerm("");
      return;
    }

    setParticipants([...participants, { display: '', number: trimmed }]);
    setSearchTerm("");
  };

  const filteredContacts = contacts.filter(contact =>
    contact.display.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.number.includes(searchTerm)
  );

  const isYourself = participants.find((p) => p.number === myPhoneNumber);
  const disableSubmit = !participants?.length || (isGroupChat && !conversationLabel) || !!isYourself;

  const rightActions = (
    <button
      onClick={handleCancel}
      className="text-blue-500 font-medium text-[17px] active:opacity-70 transition-opacity"
    >
      Cancelar
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#000000] overflow-hidden">
      <DynamicHeader
        title="Nova Mensagem"
        variant="pinned"
        rightContent={rightActions}
        forceBackdrop={true}
      />

      <div className="flex-1 overflow-y-auto pt-[110px]" ref={scrollRef}>
        {/* Recipient Input (To: field) */}
        <div className="px-4 py-2 flex flex-wrap items-center gap-2 border-b border-neutral-100 dark:border-white/5 min-h-[50px]">
          <span className="text-neutral-400 text-[15px] font-normal mr-2">Para:</span>

          {participants.map(p => (
            <div
              key={p.number}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-[4px] text-[15px] animate-in zoom-in-95 group transition-colors hover:bg-blue-200 dark:hover:bg-blue-500/30"
            >
              <span>{p.display || p.number}</span>
              <button
                onClick={() => toggleParticipant(p)}
                className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-sm"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}

          <input
            type="text"
            className="flex-1 min-w-[120px] bg-transparent border-none text-[15px] p-1 focus:ring-0 text-neutral-900 dark:text-white caret-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && addManualNumber()}
            autoFocus
          />
        </div>

        {/* Suggested Contacts List */}
        <div className="flex-1">
          {searchTerm.length > 0 ? (
            <div className="py-2 animate-in fade-in duration-300">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <button
                    key={contact.number}
                    onClick={() => toggleParticipant(contact)}
                    className="w-full flex items-center px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 active:bg-neutral-100 dark:active:bg-neutral-800 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mr-3 overflow-hidden">
                      {contact.avatar ? (
                        <img src={contact.avatar} className="h-full w-full object-cover" alt="avatar" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="flex flex-col items-start min-w-0 flex-1 border-b border-neutral-100 dark:border-white/5 pb-3">
                      <span className="font-semibold text-[16px] text-neutral-900 dark:text-white truncate">{contact.display}</span>
                      <span className="text-[14px] text-neutral-500 truncate">{contact.number}</span>
                    </div>
                    {participants.find(p => p.number === contact.number) && (
                      <div className="ml-2 text-blue-500">
                        <Check size={18} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))
              ) : (
                !participants.find(p => p.number === searchTerm) && (
                  <button
                    onClick={addManualNumber}
                    className="w-full flex items-center px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group text-blue-500"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10 mr-3">
                      <Plus size={20} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[16px] font-medium">Usar número manual</span>
                      <span className="text-[14px] opacity-70">{searchTerm}</span>
                    </div>
                  </button>
                )
              )}
            </div>
          ) : (
            <div className="px-4 py-10 flex flex-col items-center justify-center text-neutral-300 dark:text-neutral-700 select-none">
              <Users size={64} strokeWidth={1.5} className="mb-4 opacity-20" />
              <p className="text-[15px] font-medium opacity-40">Busque um contato para iniciar</p>
            </div>
          )}
        </div>

        {/* Group Name (Conditional) */}
        {isGroupChat && (
          <div className="p-4 space-y-3 animate-in slide-in-from-top-4 duration-500 border-t border-neutral-100 dark:border-white/5">
            <h2 className="text-[13px] font-medium text-neutral-400 uppercase tracking-tight px-1 italic opacity-60">Nome do Grupo (Obrigatório)</h2>
            <input
              className="w-full h-11 px-4 bg-neutral-100/50 dark:bg-neutral-900/50 border-none rounded-xl text-[16px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-1 focus:ring-blue-500/20 transition-all border border-transparent focus:border-blue-500/20"
              placeholder="Ex: Família, Trabalho..."
              value={conversationLabel}
              onChange={(e) => setConversationLabel(e.currentTarget.value)}
            />
          </div>
        )}
      </div>

      <footer className="p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-neutral-100 dark:border-white/5 safe-area-bottom">
        <button
          onClick={handleSubmit}
          disabled={disableSubmit}
          className={cn(
            "w-full h-12 rounded-xl font-bold text-[17px] transition-all active:scale-95 flex items-center justify-center gap-2",
            disableSubmit
              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
              : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
          )}
        >
          {isGroupChat ? "Criar Grupo" : "Iniciar"}
          {!disableSubmit && <Check size={18} strokeWidth={3} />}
        </button>
        {isYourself && (
          <p className="text-[12px] text-red-500 font-medium text-center mt-3">Você não pode enviar mensagens para si mesmo</p>
        )}
      </footer>
    </div>
  );
};

export default NewMessageGroupForm;
