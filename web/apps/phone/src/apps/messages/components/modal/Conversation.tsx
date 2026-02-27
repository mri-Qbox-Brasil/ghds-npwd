import React, { useCallback, useState } from 'react';
import { Message, MessageConversation, MessageEvents } from '@typings/messages';
import { MessageBubble } from './MessageBubble';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useConversationId, useSetMessages } from '../../hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

interface IProps {
  activeMessageGroup: MessageConversation;
  messages: Message[];
  isVoiceEnabled: boolean;
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation: React.FC<IProps> = ({ activeMessageGroup, messages, isVoiceEnabled }) => {
  const conversationId = useConversationId();
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const setMessages = useSetMessages();
  const [t] = useTranslation();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!!messages.length);

  const handleNextPage = useCallback(() => {
    fetchNui<ServerPromiseResp<Message[]>>(MessageEvents.FETCH_MESSAGES, {
      conversationId: conversationId,
      page,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        addAlert({
          message: t('MESSAGES.FEEDBACK.FETCHED_MESSAGES_FAILED') as unknown as string,
          type: 'error',
        });

        return history.push('/messages');
      }

      if (resp.data.length === 0) {
        setHasMore(false);
        return;
      }

      setHasMore(true);
      setPage((curVal) => curVal + 1);

      setMessages((currVal) => [...resp.data, ...currVal]);
    });
  }, [addAlert, conversationId, setMessages, history, t, page, setPage]);

  return (
    <div className="h-full w-full flex flex-col">
      <div
        id="scrollableDiv"
        className="flex-1 overflow-y-auto px-4 py-2 pt-[120px] flex flex-col-reverse scrollbar-hide"
      >
        <InfiniteScroll
          next={handleNextPage}
          scrollableTarget="scrollableDiv"
          hasMore={hasMore}
          inverse={true}
          loader={
            <div className="flex justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          }
          dataLength={messages.length}
          className="flex flex-col-reverse gap-1.5"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Conversation;
