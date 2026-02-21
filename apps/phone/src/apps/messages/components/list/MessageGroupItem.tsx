import React, { useCallback } from 'react';
import { MessageConversation } from '@typings/messages';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useContacts } from '../../../contacts/hooks/state';
import { Contact } from '@typings/contact';
import { initials } from '@utils/misc';
import { cn } from '@utils/cn';
import { ChevronRight, Users } from 'lucide-react';

interface IProps {
  messageConversation: MessageConversation;
  handleClick: (conversations: MessageConversation) => () => void;
  isEditing: boolean;
  checked: number[];
  handleToggle: (id: number) => void;
}

const MessageGroupItem = ({
  messageConversation,
  handleClick,
  isEditing,
  checked,
  handleToggle,
}: IProps): any => {
  const contacts = useContacts();
  const { getContactByNumber } = useContactActions();

  const contactDisplay = useCallback(
    (number: string): Contact | null => {
      return contacts.length ? getContactByNumber(number) : null;
    },
    [contacts, getContactByNumber],
  );

  const getContact = useCallback((): Contact | null => {
    const participant = messageConversation.participant;
    const conversationList = messageConversation.conversationList.split('+');

    for (const p of conversationList) {
      if (p !== participant) {
        const contact = contactDisplay(p);
        return contact || null;
      }
    }
    return null;
  }, [contactDisplay, messageConversation]);

  const getLabelOrContact = useCallback((): string => {
    const conversationLabel = messageConversation.label;
    const participant = messageConversation.participant;
    const conversationList = messageConversation.conversationList.split('+');

    if (messageConversation.isGroupChat) return conversationLabel || "Grupo";

    const contact = getContact();
    return contact?.display || conversationList.filter((p) => p !== participant)[0] || "Desconhecido";
  }, [messageConversation, getContact]);

  const isChecked = checked.indexOf(messageConversation.id) !== -1;
  const contact = getContact();

  return (
    <div
      onClick={!isEditing ? handleClick(messageConversation) : () => handleToggle(messageConversation.id)}
      className={cn(
        "flex items-center gap-4 py-3 px-2 cursor-pointer transition-all active:scale-[0.98] relative overflow-hidden",
        isChecked ? "bg-blue-50/50 dark:bg-blue-500/5" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
      )}
    >
      {/* Seleção de Edição */}
      {isEditing && (
        <div className="flex items-center justify-center pl-2 animate-in slide-in-from-left-4 duration-300">
          <div className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
            isChecked ? "bg-red-500 border-red-500" : "border-neutral-300 dark:border-neutral-700"
          )}>
            {isChecked && <div className="h-2 w-2 rounded-full bg-white animate-in zoom-in" />}
          </div>
        </div>
      )}

      {/* Avatar */}
      <div className="relative shrink-0">
        {messageConversation.isGroupChat ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            <Users size={28} />
          </div>
        ) : contact?.avatar ? (
          <img
            src={contact.avatar}
            className="h-14 w-14 rounded-2xl object-cover shadow-md border border-neutral-100 dark:border-neutral-800"
            alt="avatar"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 shadow-inner">
            <span className="text-neutral-500 dark:text-neutral-400 font-bold text-lg">
              {initials(getLabelOrContact())}
            </span>
          </div>
        )}

        {/* Badge de Não Lida */}
        {!isEditing && messageConversation.unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-[11px] font-black text-white ring-4 ring-white dark:ring-neutral-900 shadow-lg animate-in zoom-in">
            {messageConversation.unreadCount > 99 ? '99+' : messageConversation.unreadCount}
          </span>
        )}
      </div>

      {/* Info Conversa */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "font-bold truncate transition-colors",
            messageConversation.unreadCount > 0 ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"
          )}>
            {getLabelOrContact()}
          </h3>
          <span className="text-[11px] font-medium text-neutral-400 shrink-0">
            {/* Timer logic could be added here if needed */}
          </span>
        </div>
        <p className={cn(
          "text-sm truncate",
          messageConversation.unreadCount > 0 ? "font-bold text-blue-500" : "text-neutral-400 font-medium"
        )}>
          {messageConversation.last_message || "Nenhuma mensagem"}
        </p>
      </div>

      {!isEditing && (
        <div className="pr-2 text-neutral-300 dark:text-neutral-700">
          <ChevronRight size={18} />
        </div>
      )}
    </div>
  );
};

export default MessageGroupItem;
