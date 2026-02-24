import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { useTranslation } from 'react-i18next';
import { useMail } from '../hooks/useMail';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';

export const MailCompose: React.FC = () => {
    const history = useHistory();
    const { sendMail } = useMail();
    const [t] = useTranslation();
    const { addAlert } = useSnackbar();

    const [target, setTarget] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!target.trim() || !message.trim()) return;

        setIsSending(true);
        const success = await sendMail({
            target,
            subject: subject || (t('MAIL.NO_SUBJECT') as string || 'Sem Assunto'),
            message: message.replace(/\n/g, '<br>') // Convert newlines to HTML breaks for basic formatting
        });

        setIsSending(false);

        if (success) {
            history.goBack();
        } else {
            addAlert({
                message: t('MAIL.SEND_ERROR') as string || 'Erro ao enviar email.',
                type: 'error',
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black relative w-full overflow-hidden">
            <DynamicHeader
                title={t('MAIL.NEW_MESSAGE') as string || 'Nova Mensagem'}
                variant="pinned"
                forceBackdrop={true}
                centerContent={
                    <span className="text-[17px] font-semibold text-neutral-900 dark:text-white tracking-tight whitespace-nowrap truncate block px-2 m-0 p-0 leading-none">
                        {t('MAIL.NEW_MESSAGE') as string || 'Nova Mensagem'}
                    </span>
                }
                leftContent={
                    <button
                        onClick={() => history.goBack()}
                        className="flex items-center text-blue-500 hover:text-blue-600 transition-colors cursor-pointer appearance-none bg-transparent border-none font-normal"
                        disabled={isSending}
                    >
                        Cancelar
                    </button>
                }
                rightContent={
                    <button
                        onClick={handleSend}
                        disabled={isSending || !target.trim() || !message.trim()}
                        className="text-blue-500 font-semibold disabled:opacity-50 hover:text-blue-600 transition-opacity bg-transparent border-none p-0 outline-none"
                    >
                        {isSending ? 'Enviando...' : 'Enviar'}
                    </button>
                }
            />

            <div className="flex flex-col flex-1 px-4 pt-[110px] overflow-y-auto scrollbar-hide h-full w-full">
                {/* To Field */}
                <div className="flex items-center min-h-[44px] border-b border-neutral-200 dark:border-[#2C2C2E]">
                    <span className="text-neutral-500 dark:text-[#8E8E93] text-[15px] mr-2 w-8">Para:</span>
                    <input
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-black dark:text-white placeholder:font-normal placeholder:text-neutral-400"
                        placeholder="Passaporte (ex: BGD12345)"
                        autoFocus
                        disabled={isSending}
                    />
                </div>

                {/* Subject Field */}
                <div className="flex items-center border-b border-neutral-200 dark:border-[#2C2C2E]">
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="flex-1 bg-transparent min-h-[44px] border-none outline-none text-[15px] font-semibold text-black dark:text-white placeholder:font-normal placeholder:text-neutral-400"
                        placeholder="Assunto"
                        disabled={isSending}
                    />
                </div>

                {/* Message Body Field */}
                <div className="flex-1 pt-4 pb-8 h-full min-h-[300px]">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-full bg-transparent border-none outline-none resize-none text-[15px] text-black dark:text-white placeholder:text-neutral-400"
                        disabled={isSending}
                    />
                </div>
            </div>
        </div>
    );
};

export default MailCompose;
