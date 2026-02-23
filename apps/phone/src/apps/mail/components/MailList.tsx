import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMail } from '../hooks/useMail';
import { Typography } from '@ui/components/ui/typography';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

export const MailList: React.FC = () => {
    const { mails } = useMail();
    const history = useHistory();
    const [t] = useTranslation();

    if (mails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 dark:text-neutral-400 mt-20">
                <Typography variant="body1">{t('MAIL.EMPTY') as string}</Typography>
            </div>
        );
    }

    return (
        <div className="flex flex-col pb-6 px-4 mt-2">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm">
                {mails.map((mail, index) => {
                    const isLast = index === mails.length - 1;

                    return (
                        <div
                            key={mail.id}
                            onClick={() => history.push(`/mail/view/${mail.id}`)}
                            className={cn(
                                "flex flex-col p-3 pl-8 relative active:bg-neutral-200/50 dark:active:bg-neutral-800/50 transition-colors cursor-pointer",
                                !isLast && "border-b border-neutral-200 dark:border-neutral-800"
                            )}
                        >
                            {mail.read === 0 && (
                                <div className="absolute top-4 left-3 w-2.5 h-2.5 rounded-full bg-blue-500" />
                            )}

                            <div className="flex items-center justify-between mb-0.5">
                                <Typography variant="body1" className="font-semibold text-black dark:text-white truncate text-[17px]">
                                    {mail.sender}
                                </Typography>
                                <Typography variant="caption" className="text-neutral-500 dark:text-neutral-400 shrink-0 ml-2">
                                    {new Date(mail.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </Typography>
                            </div>

                            <Typography variant="body2" className="text-black dark:text-white font-medium truncate text-[15px]">
                                {mail.subject}
                            </Typography>

                            <Typography variant="body2" className="text-neutral-500 dark:text-neutral-400 truncate mt-0.5 text-[15px] leading-tight flex-1 line-clamp-2 white-space-normal">
                                {mail.message.replace(/<[^>]*>?/gm, '')}
                            </Typography>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
