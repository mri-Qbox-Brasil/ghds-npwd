import React, { useEffect, useRef } from 'react';
import { useActiveDarkchatValue, useDarkchatMessagesValue } from '../../state/state';
import { useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import ChannelMessageBubble from '../ui/ChannelMessageBubble';
import ChannelImageBubble from '../ui/ChannelImageBubble';
import ChannelInput from '../ui/ChannelInput';
import { UploadMediaModal } from '../modals/UploadMedia';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { useHistory } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useModal } from '../../hooks/useModal';
import { OwnerModal } from '@apps/darkchat/components/modals/OwnerModal';
import { Hash, Ghost } from 'lucide-react';

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
    <div className="flex-1 flex items-center justify-center bg-neutral-950">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-neutral-950 relative overflow-hidden">
      <UploadMediaModal />
      <OwnerModal open={ownerModal} closeModal={() => setOwnerModal(false)} />

      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center scale-150 -rotate-12 z-0">
        <Hash size={500} strokeWidth={1} />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth scrollbar-hide z-10"
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <React.Fragment key={message.id || index}>
              {message.isImage ? (
                <ChannelImageBubble {...message} />
              ) : (
                <ChannelMessageBubble {...message} />
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 text-neutral-400 gap-4">
            <Ghost size={48} />
            <p className="font-bold uppercase tracking-widest text-[10px] italic">Início da transmissão anônima</p>
          </div>
        )}
      </div>

      <footer className="p-4 bg-neutral-950 z-20">
        <ChannelInput />
      </footer>
    </div>
  );
};
