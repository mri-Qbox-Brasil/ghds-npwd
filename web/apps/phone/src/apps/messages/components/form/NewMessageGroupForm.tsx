import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { PreDBConversation } from '@typings/messages';
import { PreDBContact } from '@typings/contact';
import { User, X, Check, Plus, PlusCircle, ArrowUp } from 'lucide-react';
import { cn } from '@utils/cn';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const history = useHistory();
  const [t] = useTranslation();
  const [participants, setParticipants] = useState<PreDBContact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversationLabel, setConversationLabel] = useState<string>('');
  const { getContactByNumber } = useContactActions();
  const realContacts = useContactsValue();

  const contacts = realContacts;
  const { addConversation } = useMessageAPI();
  const myPhoneNumber = useMyPhoneNumber();
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Auto-submit when a single participant is selected (like iOS does)
  // Users can still add more participants to create a group

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black overflow-hidden">
      {/* ── iOS-style Navigation Bar ── */}
      <div className="shrink-0 pt-[60px] pb-3 px-4 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-neutral-200 dark:border-white/10 z-50 relative">
        <div className="flex items-center justify-between">
          {/* Empty left spacer for centering */}
          <div className="w-[72px]" />

          {/* Centered Title */}
          <h1 className="text-[17px] font-semibold text-neutral-900 dark:text-white tracking-tight text-center">
            Nova Mensagem
          </h1>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="text-blue-500 font-normal text-[17px] active:opacity-70 transition-opacity"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* To: Field */}
        <div className="px-4 py-2.5 flex items-start gap-0 border-b border-neutral-200 dark:border-white/10 min-h-[44px]">
          <span className="text-neutral-400 dark:text-neutral-500 text-[16px] font-normal leading-[32px] shrink-0">Para:</span>

          <div className="flex-1 flex flex-wrap items-center gap-1.5 ml-1.5 min-h-[32px]">
            {participants.map(p => (
              <button
                key={p.number}
                onClick={() => toggleParticipant(p)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#E8E8ED] dark:bg-neutral-800 text-blue-500 rounded-full text-[14px] font-normal animate-in zoom-in-95 duration-200 active:bg-neutral-300 dark:active:bg-neutral-700 transition-colors"
              >
                <span>{p.display || p.number}</span>
                <X size={14} strokeWidth={2} className="text-neutral-400" />
              </button>
            ))}

            <input
              ref={inputRef}
              type="text"
              className="flex-1 min-w-[80px] bg-transparent border-none text-[16px] py-1 px-0 focus:ring-0 focus:outline-none text-neutral-900 dark:text-white caret-blue-500 placeholder:text-neutral-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && addManualNumber()}
              autoFocus
            />
          </div>

          {/* Add Contact + icon */}
          <button
            onClick={() => inputRef.current?.focus()}
            className="ml-1 mt-1 text-blue-500 active:opacity-70 transition-opacity shrink-0"
          >
            <PlusCircle size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Group Name (Apple style — only when 2+ participants) */}
        {isGroupChat && (
          <div className="px-4 py-2.5 border-b border-neutral-200 dark:border-white/10 animate-in fade-in duration-300">
            <div className="flex items-center gap-0 min-h-[44px]">
              <span className="text-neutral-400 dark:text-neutral-500 text-[16px] font-normal shrink-0">Grupo:</span>
              <input
                className="flex-1 ml-1.5 bg-transparent border-none text-[16px] py-1 px-0 focus:ring-0 focus:outline-none text-neutral-900 dark:text-white caret-blue-500 placeholder:text-neutral-400"
                placeholder="Nome do grupo"
                value={conversationLabel}
                onChange={(e) => setConversationLabel(e.currentTarget.value)}
              />
            </div>
          </div>
        )}

        {/* Error: Can't message yourself */}
        {isYourself && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20">
            <p className="text-[13px] text-red-500 font-medium">Você não pode enviar mensagens para si mesmo</p>
          </div>
        )}

        {/* ── Contact Suggestions ── */}
        {searchTerm.length > 0 ? (
          <div className="animate-in fade-in duration-200">
            {/* Section header */}
            <div className="px-4 pt-4 pb-1.5">
              <span className="text-[13px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                Contatos
              </span>
            </div>

            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => {
                const isSelected = !!participants.find(p => p.number === contact.number);
                return (
                  <button
                    key={contact.number}
                    onClick={() => toggleParticipant(contact)}
                    className="w-full flex items-center pl-4 pr-4 active:bg-neutral-100 dark:active:bg-neutral-900 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 mr-3 overflow-hidden shrink-0">
                      {contact.avatar ? (
                        <img src={contact.avatar} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>

                    {/* Name + Number */}
                    <div className={cn(
                      "flex flex-col items-start min-w-0 flex-1 py-3",
                      index < filteredContacts.length - 1 && "border-b border-neutral-100 dark:border-white/5"
                    )}>
                      <span className="font-normal text-[16px] text-neutral-900 dark:text-white truncate w-full text-left">
                        {contact.display}
                      </span>
                      <span className="text-[13px] text-neutral-500 truncate w-full text-left">
                        {contact.number}
                      </span>
                    </div>

                    {/* Check if selected */}
                    {isSelected && (
                      <div className="ml-2 shrink-0">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check size={14} strokeWidth={3} className="text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              !participants.find(p => p.number === searchTerm) && (
                <button
                  onClick={addManualNumber}
                  className="w-full flex items-center px-4 py-3 active:bg-neutral-100 dark:active:bg-neutral-900 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20 mr-3 shrink-0">
                    <Plus size={20} strokeWidth={2.5} className="text-blue-500" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[16px] font-normal text-blue-500">Enviar para "{searchTerm}"</span>
                  </div>
                </button>
              )
            )}
          </div>
        ) : (
          /* Empty state — show all contacts or hint */
          contacts.length > 0 ? (
            <div>
              <div className="px-4 pt-4 pb-1.5">
                <span className="text-[13px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Sugestões
                </span>
              </div>
              {contacts.slice(0, 15).map((contact, index) => {
                const isSelected = !!participants.find(p => p.number === contact.number);
                return (
                  <button
                    key={contact.number}
                    onClick={() => toggleParticipant(contact)}
                    className="w-full flex items-center pl-4 pr-4 active:bg-neutral-100 dark:active:bg-neutral-900 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 mr-3 overflow-hidden shrink-0">
                      {contact.avatar ? (
                        <img src={contact.avatar} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className={cn(
                      "flex flex-col items-start min-w-0 flex-1 py-3",
                      index < Math.min(contacts.length, 15) - 1 && "border-b border-neutral-100 dark:border-white/5"
                    )}>
                      <span className="font-normal text-[16px] text-neutral-900 dark:text-white truncate w-full text-left">
                        {contact.display || contact.number}
                      </span>
                      {contact.display && (
                        <span className="text-[13px] text-neutral-500 truncate w-full text-left">
                          {contact.number}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="ml-2 shrink-0">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check size={14} strokeWidth={3} className="text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : null
        )}
      </div>

      {/* ── Bottom Action Bar (only when ready to submit) ── */}
      {participants.length > 0 && !isYourself && (
        <div className="shrink-0 safe-area-bottom animate-in fade-in slide-in-from-bottom-1 duration-300">
          {isGroupChat && !conversationLabel ? (
            <div className="px-4 py-3 border-t border-neutral-200 dark:border-white/10">
              <p className="text-[13px] text-neutral-400 text-center font-medium">
                Defina um nome para o grupo para continuar
              </p>
            </div>
          ) : (
            <div className="px-4 py-2.5 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-black">
              <button
                onClick={handleSubmit}
                disabled={disableSubmit}
                className="w-full flex items-center justify-center gap-2 py-2.5 active:opacity-60 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-[17px] font-normal text-blue-500">
                  {isGroupChat ? 'Criar Grupo' : 'Iniciar Conversa'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewMessageGroupForm;
