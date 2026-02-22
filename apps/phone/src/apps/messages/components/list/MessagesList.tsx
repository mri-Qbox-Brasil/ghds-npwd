import React, { useEffect, useState } from 'react';
import useMessages from '../../hooks/useMessages';
import MessageGroupItem from './MessageGroupItem';
import { useTranslation } from 'react-i18next';
import {
    useCheckedConversations,
    useFilteredConversationsValue,
    useIsEditing,
    useSetFilterValue,
} from '../../hooks/state';
import { useDebounce } from '@os/phone/hooks/useDebounce';
import { Search, Edit2, Edit, X } from "lucide-react";
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import { cn } from '@utils/cn';
import { useHistory } from 'react-router-dom';
import { AppWrapper } from '../../../../ui/components/AppWrapper';
import { AppContent } from '../../../../ui/components/AppContent';
import { DynamicHeader } from '../../../../ui/components/DynamicHeader';

const MessagesList = (): any => {
    const history = useHistory();
    const [isEditing, setIsEditing] = useIsEditing();
    const [checkedConversation, setCheckedConversation] = useCheckedConversations();
    const [t] = useTranslation();

    const { conversations, goToConversation } = useMessages();
    const { setMessageRead } = useMessageAPI();

    const filteredConversations = useFilteredConversationsValue();
    const setFilterVal = useSetFilterValue();

    const [inputVal, setInputVal] = useState('');
    const debouncedVal = useDebounce<string>(inputVal, 200);

    useEffect(() => {
        setFilterVal(debouncedVal);
    }, [debouncedVal, setFilterVal]);

    if (!conversations) return (
        <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="font-medium">{String(t('MESSAGES.LOADING'))}</p>
        </div>
    );

    const handleClick = (conversation: MessageConversation) => () => {
        if (isEditing) {
            handleToggleConversation(conversation.id);
            return;
        }
        setMessageRead(conversation.id);
        goToConversation(conversation);
    };

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handleToggleConversation = (conversationId: number) => {
        const currentIndex = checkedConversation.indexOf(conversationId);
        const newChecked = [...checkedConversation];

        if (currentIndex === -1) {
            newChecked.push(conversationId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedConversation(newChecked);
    };

    const scrollRef = React.useRef<HTMLDivElement>(null);

    const leftActions = (
        <div className="flex items-center">
            {!!conversations.length && (
                <button
                    onClick={toggleEdit}
                    className={cn(
                        "text-[17px] transition-colors active:opacity-70",
                        isEditing
                            ? "text-red-500 font-bold"
                            : "text-blue-500"
                    )}
                >
                    {isEditing ? "Concluir" : "Editar"}
                </button>
            )}
        </div>
    );

    const rightActions = (
        <div className="flex items-center">
            <button
                onClick={() => history.push('/messages/new')}
                className="text-blue-500 transition-colors active:opacity-70"
            >
                <Edit size={22} className="stroke-[2.5px]" />
            </button>
        </div>
    );

    return (
        <AppWrapper className="bg-white dark:bg-black animate-in fade-in duration-500 p-0 m-0">
            <DynamicHeader
                title="Mensagens"
                scrollRef={scrollRef}
                variant="pinned"
                leftContent={leftActions}
                rightContent={rightActions}
            />

            <AppContent
                ref={scrollRef}
                className="flex flex-col grow pb-24 scrollbar-hide h-full relative"
            >
                <DynamicHeader title="Mensagens" scrollRef={scrollRef} variant="largeTitle" />

                {/* Search Bar */}
                <div className="px-4 pb-2">
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Search size={16} className="stroke-[2.5px]" />
                        </div>
                        <input
                            type="text"
                            className="w-full h-9 pl-9 pr-4 rounded-[10px] bg-neutral-200/60 dark:bg-neutral-800/60 border-none text-[17px] focus:ring-0 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-500"
                            onChange={(e) => setInputVal(e.currentTarget.value)}
                            placeholder={t('MESSAGES.SEARCH_PLACEHOLDER') as string}
                            value={inputVal}
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1">
                    <div className="flex flex-col">
                        {[...filteredConversations]
                            .sort((a, b) => b.updatedAt - a.updatedAt)
                            .map((conversation) => (
                                <MessageGroupItem
                                    handleToggle={handleToggleConversation}
                                    isEditing={isEditing}
                                    checked={checkedConversation}
                                    key={conversation.id}
                                    messageConversation={conversation}
                                    handleClick={handleClick}
                                />
                            ))}
                    </div>

                    {filteredConversations.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-neutral-400 opacity-40 text-center gap-2">
                            <Search size={48} />
                            <p className="font-bold">{String(t('MESSAGES.NO_RESULTS'))}</p>
                        </div>
                    )}
                </div>
            </AppContent>
        </AppWrapper>
    );
};

export default MessagesList;
