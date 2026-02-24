import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMail } from '../hooks/useMail';
import { Typography } from '@ui/components/ui/typography';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { AppContent } from '@ui/components';
import { Trash2 } from 'lucide-react';
import { AlertDialog } from '@ui/components/AlertDialog';

export const MailList: React.FC = () => {
    const { mails, deleteMail } = useMail();
    const history = useHistory();
    const [t] = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const inboxTitle = (t('MAIL.INBOX') as string) || 'Entrada';
    const unreadCount = mails.filter(m => m.read === 0).length;
    let unreadText = '';

    if (mails.length === 0) {
        unreadText = (t('MAIL.TOTAL_COUNT_ZERO') as string) || '';
    } else if (unreadCount > 0) {
        unreadText = unreadCount === 1
            ? (t('MAIL.UNREAD_COUNT_ONE') as string) || '1 Não Lida'
            : (t('MAIL.UNREAD_COUNT_MANY', { count: unreadCount }) as string) || `${unreadCount} Não Lidas`;
    } else {
        unreadText = mails.length === 1
            ? (t('MAIL.TOTAL_COUNT_ONE') as string) || '1 Mensagem'
            : (t('MAIL.TOTAL_COUNT_MANY', { count: mails.length }) as string) || `${mails.length} Mensagens`;
    }

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        setSelectedIds([]);
    };

    const toggleSelection = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedIds.length === 0) return;

        await deleteMail(selectedIds);
        setSelectedIds([]);
        setIsEditing(false);
        setIsModalOpen(false);
    };

    return (
        <>
            <DynamicHeader
                title={inboxTitle}
                scrollRef={scrollRef}
                variant="pinned"
                rightContent={
                    mails.length > 0 && (
                        <button
                            onClick={toggleEdit}
                            className="text-blue-500 hover:text-blue-600 transition-colors bg-transparent border-none outline-none font-medium text-[16px] mr-2"
                        >
                            {isEditing ? 'Concluído' : 'Editar'}
                        </button>
                    )
                }
            />
            <AppContent
                ref={scrollRef}
                className="flex flex-col grow scrollbar-hide h-full w-full relative bg-white dark:bg-black"
            >
                <DynamicHeader title={inboxTitle} scrollRef={scrollRef} variant="largeTitle" />

                {mails.length === 0 ? (
                    <div className="flex flex-col items-center w-full mt-8">
                        <Typography variant="body1" className="text-[15px] font-medium text-[#8E8E93] dark:text-[#8E8E93]">
                            {t('MAIL.EMPTY') as string}
                        </Typography>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 pb-24 bg-white dark:bg-black w-full overflow-x-hidden">
                        <div className="flex flex-col w-full">
                            {mails.map((mail, index) => {
                                const isLast = index === mails.length - 1;
                                const isSelected = selectedIds.includes(mail.id);

                                return (
                                    <div
                                        key={mail.id}
                                        onClick={() => {
                                            if (isEditing) {
                                                toggleSelection(mail.id);
                                            } else {
                                                history.push(`/mail/view/${mail.id}`);
                                            }
                                        }}
                                        className="relative flex items-center active:bg-neutral-200/50 dark:active:bg-[#1C1C1E] transition-colors cursor-pointer w-full overflow-hidden"
                                    >
                                        {/* Edit Checkbox container mapped for smoothly sliding in */}
                                        <div
                                            className={cn(
                                                "transition-all duration-300 flex items-center justify-center",
                                                isEditing ? "w-10 opacity-100 ml-3" : "w-0 opacity-0 ml-0 pointer-events-none"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex items-center justify-center w-[22px] h-[22px] rounded-full border transition-colors",
                                                isSelected
                                                    ? "bg-blue-500 border-blue-500 text-white"
                                                    : "border-neutral-300 dark:border-neutral-600 bg-transparent"
                                            )}>
                                                {isSelected && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        {/* Blue Unread Dot on left edge - Adjusts visually when editing */}
                                        {mail.read === 0 && (
                                            <div
                                                className={cn(
                                                    "absolute top-[17px] w-[11px] h-[11px] rounded-full bg-[#007AFF] transition-all duration-300",
                                                    isEditing ? "left-[-20px] opacity-0" : "left-[10px] opacity-100"
                                                )}
                                            />
                                        )}

                                        {/* Content container with left margin to indent the bottom border typical of iOS */}
                                        <div className={cn(
                                            "flex flex-col flex-1 pl-1 pr-4 py-[10px] transition-all duration-300",
                                            isEditing ? "ml-2" : "ml-8",
                                            !isLast && "border-b border-neutral-200/80 dark:border-[#2C2C2E]"
                                        )}>
                                            <div className="flex items-center justify-between mb-0.5">
                                                <Typography variant="body1" className="font-bold text-black dark:text-white truncate text-[16px] tracking-tight">
                                                    {mail.sender}
                                                </Typography>
                                                <div className="flex items-center text-neutral-500 dark:text-[#8E8E93] shrink-0 ml-2 text-[15px] font-normal">
                                                    {new Date(mail.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 ml-1.5 -mr-1">
                                                        <polyline points="9 18 15 12 9 6"></polyline>
                                                    </svg>
                                                </div>
                                            </div>

                                            <Typography variant="body2" className="text-black dark:text-white truncate text-[15px] mb-0.5 font-normal tracking-tight">
                                                {mail.subject}
                                            </Typography>

                                            <div className="text-neutral-500 dark:text-[#8E8E93] text-[15px] leading-tight line-clamp-2 white-space-normal font-normal tracking-tight pr-2">
                                                {mail.message.replace(/<[^>]*>?/gm, '')}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </AppContent>

            <AlertDialog
                isOpen={isModalOpen}
                title="Excluir Emails?"
                description={`Tem certeza que deseja apagar ${selectedIds.length} email${selectedIds.length > 1 ? 's' : ''} permanentemente?`}
                onClose={() => setIsModalOpen(false)}
                actions={[
                    {
                        label: 'Cancelar',
                        style: 'cancel',
                        onClick: () => setIsModalOpen(false)
                    },
                    {
                        label: 'Excluir',
                        style: 'destructive',
                        onClick: handleConfirmDelete
                    }
                ]}
            />

            {/* Default Bottom Toolbar */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 w-full z-10 transition-transform duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-neutral-200 dark:border-white/10 px-4 pt-2.5 pb-8 flex items-center justify-between",
                    !isEditing ? "translate-y-0" : "translate-y-full"
                )}
            >
                {/* Filter Icon */}
                <button className="text-blue-500 hover:opacity-80 transition-opacity bg-transparent border-none outline-none -ml-1 flex items-center justify-center p-1 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="10" x2="16" y2="10" />
                        <line x1="8" y1="14" x2="16" y2="14" />
                        <line x1="10" y1="18" x2="14" y2="18" />
                    </svg>
                </button>

                {/* Center text */}
                <div className="flex flex-col items-center">
                    <span className="text-[11px] font-medium text-black dark:text-white leading-tight">
                        {(t('MAIL.JUST_UPDATED') as string) || 'Atualizado Há Pouco'}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">
                        {unreadText}
                    </span>
                </div>

                {/* Compose Icon */}
                <button className="text-blue-500 hover:opacity-80 transition-opacity bg-transparent border-none outline-none -mr-1 flex items-center justify-center p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                </button>
            </div>

            {/* Bottom Toolbar for Editing Operations */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 w-full z-10 transition-transform duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-neutral-200 dark:border-white/10 px-4 pt-3 pb-8 flex items-center justify-between",
                    isEditing ? "translate-y-0" : "translate-y-full"
                )}
            >
                <div>
                    <button
                        onClick={() => setSelectedIds(mails.map(m => m.id))}
                        className="text-blue-500 font-normal hover:opacity-80 transition-opacity disabled:opacity-30 appearance-none bg-transparent border-none"
                    >
                        Tudo
                    </button>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setSelectedIds([])}
                            className="text-blue-500 font-normal hover:opacity-80 transition-opacity disabled:opacity-30 appearance-none bg-transparent border-none pl-3 ml-3 border-l border-neutral-300 dark:border-neutral-700"
                        >
                            Nenhum
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={selectedIds.length === 0}
                    className="text-red-500 disabled:opacity-30 hover:opacity-80 transition-opacity appearance-none bg-transparent border-none flex items-center gap-1.5 font-medium"
                >
                    Excluir
                    <Trash2 size={18} />
                </button>
            </div>
        </>
    );
};
