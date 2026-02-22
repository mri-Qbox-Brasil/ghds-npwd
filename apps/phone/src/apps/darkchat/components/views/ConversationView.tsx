import React, { useEffect, useRef } from 'react';
import { useActiveDarkchatValue, useDarkchatMessagesValue } from '../../state/state';
import { useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import ChannelMessageBubble from '../ui/ChannelMessageBubble';
import ChannelImageBubble from '../ui/ChannelImageBubble';
import ChannelInput from '../ui/ChannelInput';
import DarkChatHeader from '../ui/DarkChatHeader';
import { UploadMediaModal } from '../modals/UploadMedia';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { useHistory } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useModal } from '../../hooks/useModal';
import { OwnerModal } from '@apps/darkchat/components/modals/OwnerModal';
import { Hash } from 'lucide-react';

export const ConversationView: React.FC = () => {
  const activeConversation = useActiveDarkchatValue();
  const { fetchMessages, fetchMembers } = useDarkchatAPI();
  const messages = useDarkchatMessagesValue();
  const history = useHistory();
  const query = useQueryParams();
  const { pathname, search } = useLocation();
  const { setModalMedia, ownerModal, setOwnerModal } = useModal();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query?.image) return;
    setModalMedia(query.image);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query?.image, history, pathname, search, setModalMedia]);

  useEffect(() => {
    if (activeConversation?.id) {
      fetchMessages(activeConversation.id);
      fetchMembers(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!activeConversation) return (
    <div className="flex-1 flex items-center justify-center bg-[#313338]">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#313338] overflow-hidden absolute inset-0">
      <UploadMediaModal />
      <OwnerModal open={ownerModal} closeModal={() => setOwnerModal(false)} />

      {/* Header — fixed at top */}
      <DarkChatHeader />

      {/* Messages Area — only this scrolls */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth scrollbar-hide min-h-0"
      >
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <React.Fragment key={message.id || index}>
                {message.isImage ? (
                  <ChannelImageBubble {...message} />
                ) : (
                  <ChannelMessageBubble {...message} />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start pt-8 gap-2">
            <div className="h-16 w-16 rounded-full bg-[#5865F2] flex items-center justify-center">
              <Hash size={32} strokeWidth={2.5} className="text-white" />
            </div>
            <h3 className="text-[22px] font-bold text-white mt-1">
              Bem-vindo ao #{activeConversation.label || activeConversation.identifier}!
            </h3>
            <p className="text-[14px] text-[#B5BAC1] leading-relaxed">
              Este é o início do canal anônimo. Suas mensagens são criptografadas.
            </p>
          </div>
        )}
      </div>

      {/* Input Area — fixed at bottom */}
      <footer className="shrink-0 px-6 pb-6 pt-1 bg-[#313338]">
        <ChannelInput />
      </footer>
    </div>
  );
};
