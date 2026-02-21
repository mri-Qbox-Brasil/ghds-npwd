import { useEffect, useState } from 'react';
import { Users, UserPlus, Phone, ArrowLeft } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-[100] flex h-full w-full flex-col bg-background animate-in slide-in-from-right duration-300">
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            onClick={closeModal}
            className="rounded-2xl p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-90"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className={cn(
              "font-black text-neutral-900 dark:text-white truncate tracking-tight uppercase italic",
              header.length > LARGE_HEADER_CHARS ? "text-base" : "text-lg"
            )}>
              {header}
            </h1>
            {activeMessageConversation.isGroupChat && (
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest -mt-1">
                Grupo · {activeMessageConversation.conversationList.split('+').length} membros
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!activeMessageConversation.isGroupChat && (
            <button
              onClick={() => initializeCall(targetNumber)}
              className="p-2.5 rounded-2xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-90"
            >
              <Phone size={22} fill="currentColor" className="opacity-20 absolute" />
              <Phone size={22} className="relative" />
            </button>
          )}
          {activeMessageConversation.isGroupChat ? (
            <button
              onClick={openGroupModal}
              className="p-2.5 rounded-2xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-90"
            >
              <Users size={22} />
            </button>
          ) : !doesContactExist ? (
            <button
              onClick={() => handleAddContact(targetNumber)}
              className="p-2.5 rounded-2xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-90"
            >
              <UserPlus size={22} />
            </button>
          ) : null}
        </div>
      </header>

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

      <footer className="shrink-0 bg-background">
        {audioContextMenuOpen ? (
          <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-background/95 backdrop-blur-md">
            <AudioContextMenu onClose={() => setAudioContextMenuOpen(false)} />
          </div>
        ) : (
          <MessageInput
            messageGroupName={activeMessageConversation.participant}
            messageConversation={activeMessageConversation}
            onAddImageClick={() => setContextMenuOpen(true)}
            onVoiceClick={() => setAudioContextMenuOpen(true)}
            voiceEnabled={ResourceConfig.voiceMessage.enabled}
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
