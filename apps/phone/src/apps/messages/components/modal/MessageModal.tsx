import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Phone, ArrowLeft, ChevronRight } from 'lucide-react';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useMessagesState } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useCall } from '@os/call/hooks/useCall';
import { useMessageActions } from '../../hooks/useMessageActions';
import GroupDetailsModal from './GroupDetailsModal';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { usePhone } from '@os/phone/hooks';
import MessageInput from '../form/MessageInput';
import AudioContextMenu from './AudioContextMenu';
import MessageContextMenu from './MessageContextMenu';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { cn } from '@utils/cn';
import { AppWrapper } from '@ui/components/AppWrapper';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { initials } from '@utils/misc';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 600;

export const MessageModal = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const { groupId } = useParams<{ groupId: string }>();
  const { activeMessageConversation, setActiveMessageConversation } = useMessages();
  const { fetchMessages } = useMessageAPI();
  const { getLabelOrContact, getConversationParticipant } = useMessageActions();
  const { initializeCall } = useCall();

  const { getContactByNumber } = useContactActions();
  const [messages, setMessages] = useMessagesState();

  const [isLoaded, setLoaded] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [audioContextMenuOpen, setAudioContextMenuOpen] = useState(false);

  const query = useQueryParams();
  const referalImage = query?.image || null;
  const referalNote = query?.note || null;

  const { ResourceConfig } = usePhone();
  const myPhoneNumber = useMyPhoneNumber();

  useEffect(() => {
    if (groupId) {
      fetchMessages(groupId, 0);
    }
  }, [groupId, fetchMessages]);

  useEffect(() => {
    let timeout;
    if (activeMessageConversation && messages) {
      timeout = setTimeout(() => {
        setLoaded(true);
      }, MINIMUM_LOAD_TIME);
      return () => clearTimeout(timeout);
    }
    setLoaded(false);
  }, [activeMessageConversation, messages]);

  const closeModal = () => {
    setMessages(null);
    history.push('/messages');
  };

  const openGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  useEffect(() => {
    if (!groupId) return;
    setActiveMessageConversation(parseInt(groupId, 10));
  }, [groupId, setActiveMessageConversation]);

  useEffect(() => {
    if (isLoaded) {
      const element = document.getElementById(CONVERSATION_ELEMENT_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [isLoaded]);

  if (!activeMessageConversation) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-md" />
          <span className="text-xs font-black uppercase tracking-widest text-neutral-400 italic">Carregando conversa...</span>
        </div>
      </div>
    );
  }

  let header = getLabelOrContact(activeMessageConversation);
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header = header.length > MAX_HEADER_CHARS ? truncatedHeader : header;

  const handleAddContact = (number: string) => {
    const exists = getContactByNumber(number);
    const referal = encodeURIComponent(pathname);
    if (exists) {
      return history.push(`/contacts/${exists.id}/?referal=${referal}`);
    }
    return history.push(`/contacts/-1/?addNumber=${number}&referal=${referal}`);
  };

  let conversationList = activeMessageConversation.conversationList.split('+');
  conversationList = conversationList.filter((targetNumber) => targetNumber !== myPhoneNumber);
  let targetNumber: string =
    conversationList.length > 0 ? conversationList[0] : activeMessageConversation.participant;

  const doesContactExist = getConversationParticipant(activeMessageConversation.conversationList);

  const contact = !activeMessageConversation.isGroupChat ? getContactByNumber(targetNumber) : null;

  const leftActions = (
    <div className="flex items-center gap-1 -ml-3">
      <button
        onClick={closeModal}
        className="flex items-center p-1 rounded-2xl text-blue-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90"
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>
    </div>
  );

  const centerActions = (
    <div className="flex flex-col items-center justify-center min-w-0 pointer-events-auto cursor-pointer" onClick={() => activeMessageConversation.isGroupChat && openGroupModal()}>
      {activeMessageConversation.isGroupChat ? (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 mb-1">
          <Users size={16} className="opacity-80" />
        </div>
      ) : contact?.avatar ? (
        <img
          src={contact.avatar}
          className="h-8 w-8 rounded-full object-cover border border-neutral-100 dark:border-neutral-800 mb-1"
          alt="avatar"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 mb-1">
          <span className="text-white font-semibold text-sm">
            {initials(header)}
          </span>
        </div>
      )}

      <div className="flex items-center gap-0.5 max-w-full">
        <h1 className={cn(
          "font-semibold text-neutral-900 dark:text-white truncate tracking-tight text-[12px] leading-tight",
        )}>
          {header}
        </h1>
        <ChevronRight size={10} className="text-neutral-400 mt-0.5" />
      </div>
    </div>
  );

  const rightActions = (
    <div className="flex items-center gap-1">
      {!activeMessageConversation.isGroupChat && (
        <button
          onClick={() => initializeCall(targetNumber)}
          className="p-2 rounded-2xl text-blue-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90"
        >
          <Phone size={22} fill="currentColor" className="opacity-20 absolute" />
          <Phone size={22} className="relative" />
        </button>
      )}
      {activeMessageConversation.isGroupChat ? (
        <button
          onClick={openGroupModal}
          className="p-2 rounded-2xl text-blue-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90"
        >
          <Users size={22} />
        </button>
      ) : !doesContactExist ? (
        <button
          onClick={() => handleAddContact(targetNumber)}
          className="p-2 rounded-2xl text-blue-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90"
        >
          <UserPlus size={22} />
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="inset-0 z-[100] flex h-full w-full flex-col animate-in slide-in-from-right duration-300 bg-white dark:bg-black">
      <DynamicHeader
        title=""
        variant="pinned"
        leftContent={leftActions}
        rightContent={rightActions}
        centerContent={centerActions}
        forceBackdrop={true}
      />

      <main className="relative flex-1 overflow-hidden">
        {isLoaded && ResourceConfig ? (
          <Conversation
            isVoiceEnabled={ResourceConfig.voiceMessage.enabled}
            messages={messages}
            activeMessageGroup={activeMessageConversation}
          />
        ) : (
          <div className="p-4 space-y-4">
            <MessageSkeletonList />
          </div>
        )}
      </main>

      <footer className="shrink-0">
        {audioContextMenuOpen ? (
          <div className="px-2 py-2 pb-5 bg-white/80 dark:bg-black/80 backdrop-blur-xl flex items-end animate-in slide-in-from-bottom duration-300">
            <AudioContextMenu onClose={() => setAudioContextMenuOpen(false)} />
          </div>
        ) : (
          <MessageInput
            messageGroupName={activeMessageConversation.participant}
            messageConversation={activeMessageConversation}
            onAddImageClick={() => setContextMenuOpen(true)}
            onVoiceClick={() => setAudioContextMenuOpen(true)}
            voiceEnabled={ResourceConfig?.voiceMessage?.enabled}
          />
        )}

        <MessageContextMenu
          messageGroup={activeMessageConversation}
          isOpen={contextMenuOpen}
          onClose={() => setContextMenuOpen(false)}
          image={referalImage}
          note={referalNote}
        />
      </footer>

      <GroupDetailsModal
        open={isGroupModalOpen}
        onClose={closeGroupModal}
        conversationList={activeMessageConversation.conversationList}
        addContact={handleAddContact}
      />
    </div>
  );
};

export default MessageModal;
