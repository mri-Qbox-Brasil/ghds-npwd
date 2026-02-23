import React, { useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useMail } from '../hooks/useMail';
import { Typography } from '@ui/components/ui/typography';
import { ChevronLeft, Trash2, Reply, Folder, CornerUpLeft, Edit } from 'lucide-react';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { AlertDialog } from '@ui/components';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

export const MailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { mails, setMailRead, deleteMail } = useMail();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [t] = useTranslation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const mail = mails.find((m) => m.id === Number(id));

    useEffect(() => {
        if (mail && mail.read === 0) {
            setMailRead(mail.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mail]);

    if (!mail) {
        return null;
    }

    const handleDelete = () => {
        deleteMail(mail.id);
        history.goBack();
    };

    const BackButton = (
        <button
            onClick={() => history.goBack()}
            className="flex items-center text-blue-500 active:opacity-70 transition-opacity -ml-2"
        >
            <ChevronLeft size={28} strokeWidth={2.5} className="-ml-1" />
            <span className="text-[17px] font-normal tracking-tight -ml-1">Inboxes</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black relative">
            <DynamicHeader
                title=""
                variant="pinned"
                leftContent={BackButton}
            />

            <div ref={scrollRef} className="flex flex-col px-4 pt-28 pb-24 overflow-y-auto scrollbar-hide h-full">
                <Typography variant="h2" className="mb-4 font-bold text-black dark:text-white text-[32px] leading-tight tracking-tight">
                    {mail.subject}
                </Typography>

                <div className="flex items-start justify-between mb-1">
                    <Typography variant="body1" className="font-semibold text-black dark:text-white text-[17px]">
                        {mail.sender}
                    </Typography>
                    <Typography variant="caption" className="text-neutral-500 dark:text-neutral-400 mt-1 whitespace-nowrap ml-2">
                        {new Date(mail.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                </div>

                <Typography variant="body2" className="text-neutral-500 dark:text-neutral-400 mb-6 text-[15px]">
                    To: You
                </Typography>

                {/* Render HTML nicely if it comes from the DB */}
                <Typography
                    variant="body1"
                    className="text-black dark:text-neutral-200 leading-relaxed text-[17px]"
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: mail.message }}
                />
            </div>

            {/* iOS Mail Bottom Toolbar */}
            <div className="absolute bottom-0 w-full min-h-[80px] pb-6 px-6 pt-3 bg-[#F9F9F9]/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-blue-500 z-40">
                <button className="active:opacity-70 opacity-30 cursor-not-allowed">
                    <Folder size={22} strokeWidth={2} />
                </button>
                <button className="active:opacity-70" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 size={24} strokeWidth={1.5} className="text-blue-500" />
                </button>
                <button className="active:opacity-70 opacity-30 cursor-not-allowed">
                    <CornerUpLeft size={24} strokeWidth={1.5} />
                </button>
                <button className="active:opacity-70 opacity-30 cursor-not-allowed">
                    <Edit size={22} strokeWidth={1.5} />
                </button>
            </div>

            {/* iOS Alert Dialog for Delete Confirmation */}
            <AlertDialog
                isOpen={showDeleteConfirm}
                title="Trash Message"
                description="This message will be permanently deleted."
                onClose={() => setShowDeleteConfirm(false)}
                actions={[
                    {
                        label: 'Cancel',
                        style: 'cancel',
                        onClick: () => setShowDeleteConfirm(false)
                    },
                    {
                        label: 'Trash',
                        style: 'destructive',
                        onClick: handleDelete
                    }
                ]}
            />
        </div>
    );
};
