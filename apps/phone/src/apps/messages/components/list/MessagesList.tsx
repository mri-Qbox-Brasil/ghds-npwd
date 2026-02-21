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
import { Search, Edit2, X } from "lucide-react";
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import { cn } from '@utils/cn';

const MessagesList = (): any => {
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
            <p className="font-medium">{t('MESSAGES.LOADING')}</p>
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

    return (
        <div className="flex flex-col h-full bg-background animate-in fade-in duration-500 overflow-hidden">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-background/80 backdrop-blur-md sticky top-0 z-10">
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase italic">Mensagens</h1>
                {!!conversations.length && (
                    <button
                        onClick={toggleEdit}
                        className={cn(
                            "p-2.5 rounded-2xl transition-all active:scale-95 flex items-center gap-2 font-bold text-sm",
                            isEditing
                                ? "bg-red-50 dark:bg-red-500/10 text-red-500"
                                : "bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:text-blue-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        )}
                    >
                        {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                        {isEditing ? "Concluir" : "Editar"}
                    </button>
                )}
            </header>

            {/* Search Bar */}
            <div className="px-6 py-3">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        className="w-full h-11 pl-11 pr-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        onChange={(e) => setInputVal(e.currentTarget.value)}
                        placeholder={t('MESSAGES.SEARCH_PLACEHOLDER') as string}
                        value={inputVal}
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-4 pb-24">
                <div className="divide-y divide-neutral-50 dark:divide-neutral-900">
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
                        <p className="font-bold">{t('MESSAGES.NO_RESULTS')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesList;
