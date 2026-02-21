import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { PreDBConversation } from '@typings/messages';
import { PreDBContact } from '@typings/contact';
import { Search, User, X, Check, Users, ArrowLeft } from 'lucide-react';
import { cn } from '@utils/cn';

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

  return (
    <div className="flex flex-col h-full bg-background animate-in slide-in-from-right duration-500 overflow-hidden">
      <header className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-background/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-blue-500 transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic">Nova Conversa</h1>
        </div>
        <button
          onClick={handleCancel}
          className="text-xs font-bold text-neutral-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Cancelar
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Recipientes Selecionados */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">Para:</h2>
          <div className={cn(
            "flex flex-wrap gap-2 p-3 rounded-2xl border border-dashed transition-colors",
            participants.length > 0
              ? "bg-blue-50/30 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20"
              : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800"
          )}>
            {participants.length === 0 ? (
              <span className="text-sm text-neutral-400 font-medium italic p-1">Nenhum contato selecionado...</span>
            ) : (
              participants.map(p => (
                <div key={p.number} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-black shadow-sm animate-in zoom-in-95">
                  <span className="truncate max-w-[120px]">{p.display || p.number}</span>
                  <button onClick={() => toggleParticipant(p)} className="hover:bg-white/20 p-0.5 rounded-lg transition-colors">
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Busca e Lista */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              className="w-full h-12 pl-12 pr-4 bg-neutral-100 dark:bg-neutral-800 border-none rounded-2xl text-sm font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Busque por nome ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && addManualNumber()}
            />
          </div>

          <div className="space-y-1">
            {searchTerm.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <button
                      key={contact.number}
                      onClick={() => toggleParticipant(contact)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-900 dark:text-neutral-100 transition-all active:scale-[0.98] border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-200 dark:bg-neutral-700 text-neutral-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          {contact.avatar ? (
                            <img src={contact.avatar} className="h-full w-full object-cover rounded-2xl" alt="avatar" />
                          ) : (
                            <User size={22} />
                          )}
                        </div>
                        <div className="flex flex-col items-start min-w-0">
                          <span className="font-bold text-sm truncate">{contact.display}</span>
                          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{contact.number}</span>
                        </div>
                      </div>
                      {participants.find(p => p.number === contact.number) ? (
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-neutral-300 dark:border-neutral-700" />
                      )}
                    </button>
                  ))
                ) : (
                  !participants.find(p => p.number === searchTerm) && (
                    <button
                      onClick={addManualNumber}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 text-blue-500 border border-blue-100 dark:border-blue-500/20 transition-all active:scale-95 group font-bold"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Plus size={22} strokeWidth={3} />
                      </div>
                      <div className="flex flex-col items-start translate-y-[1px]">
                        <span className="text-xs uppercase tracking-widest opacity-60">Usar número manual</span>
                        <span>{searchTerm}</span>
                      </div>
                    </button>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20 text-neutral-400 gap-2">
                <Users size={48} />
                <p className="font-bold uppercase tracking-widest text-xs italic">Busque um contato acima</p>
              </div>
            )}
          </div>
        </div>

        {/* Nome do Grupo (Condicional) */}
        {isGroupChat && (
          <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1">Nome do Grupo:</h2>
            <input
              className="w-full h-12 px-4 bg-neutral-100 dark:bg-neutral-800 border-none rounded-2xl text-sm font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Ex: Amigos da MRI, Elite Squad..."
              value={conversationLabel}
              onChange={(e) => setConversationLabel(e.currentTarget.value)}
            />
          </div>
        )}
      </div>

      <footer className="p-6 bg-background/80 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={handleSubmit}
          disabled={disableSubmit}
          className={cn(
            "w-full h-14 rounded-2xl font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3",
            disableSubmit
              ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none"
              : "bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/30"
          )}
        >
          {isGroupChat ? "Criar Grupo" : "Iniciar Conversa"}
          {!disableSubmit && <div className="p-1 rounded-lg bg-white/20"><Check size={18} strokeWidth={4} /></div>}
        </button>
        {isYourself && (
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center mt-3">Você não pode enviar mensagens para si mesmo</p>
        )}
      </footer>
    </div>
  );
};

export default NewMessageGroupForm;
