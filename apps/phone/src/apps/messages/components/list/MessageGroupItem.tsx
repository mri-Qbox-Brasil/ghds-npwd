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
        "flex items-center gap-4 cursor-pointer transition-colors hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 active:bg-neutral-200/80 dark:active:bg-neutral-800/80 relative overflow-hidden pl-4",
        isChecked ? "bg-neutral-200/60 dark:bg-neutral-800/60" : ""
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
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
            <Users size={24} className="opacity-80" />
          </div>
        ) : contact?.avatar ? (
          <img
            src={contact.avatar}
            className="h-[52px] w-[52px] rounded-full object-cover border border-neutral-100 dark:border-neutral-800"
            alt="avatar"
          />
        ) : (
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-b from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800">
            <span className="text-white font-semibold text-xl">
              {initials(getLabelOrContact())}
            </span>
          </div>
        )}

        {/* Badge de Não Lida */}
        {!isEditing && messageConversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-[12px] font-semibold text-white ring-2 ring-background dark:ring-background animate-in zoom-in">
            {messageConversation.unreadCount > 99 ? '99+' : messageConversation.unreadCount}
          </span>
        )}
      </div>

      {/* Info Conversa */}
      <div className="flex-1 min-w-0 flex flex-col justify-center h-full border-b border-black/5 dark:border-white/10 py-3 pr-4">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className={cn(
            "text-[17px] truncate transition-colors",
            messageConversation.unreadCount > 0 ? "font-semibold text-neutral-900 dark:text-white" : "font-medium text-neutral-900 dark:text-white"
          )}>
            {getLabelOrContact()}
          </h3>
          <span className="text-[15px] font-normal text-neutral-500 shrink-0">
            {/* Timer logic could be added here if needed */}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[15px] text-neutral-500 truncate pr-2 font-normal">
            {messageConversation.last_message || "Nenhuma mensagem"}
          </p>

          {!isEditing && (
            <div className="text-neutral-300 dark:text-neutral-600">
              <ChevronRight size={18} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MessageGroupItem;
