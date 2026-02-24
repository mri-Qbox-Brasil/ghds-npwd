import { useRecoilState } from 'recoil';
import { mailState } from './state';
import fetchNui from '@utils/fetchNui';
import { MailEvents, MailMessage } from '@typings/mail';
import { useEffect } from 'react';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { MockMailsServerResp } from '../utils/constants';

export const useMail = () => {
    const [mails, setMails] = useRecoilState(mailState);

    const fetchMails = async () => {
        try {
            const resp = await fetchNui<any>(MailEvents.FETCH_MAILS, undefined, MockMailsServerResp);
            if (resp && resp.status === 'ok') {
                setMails(resp.data);
            }
        } catch (e) {
            console.error('Failed to fetch mails', e);
        }
    };

    const deleteMail = async (id: number | number[]) => {
        try {
            const resp = await fetchNui<any>(MailEvents.DELETE_MAIL, id, { status: 'ok', data: true });

            if (resp && resp.status === 'ok' && resp.data) {
                if (Array.isArray(id)) {
                    setMails((prev) => prev.filter((mail) => !id.includes(mail.id)));
                } else {
                    setMails((prev) => prev.filter((mail) => mail.id !== id));
                }
            }
        } catch (e) {
            console.error('Failed to delete mail(s)', e);
        }
    };

    const setMailRead = async (id: number) => {
        try {
            const targetMail = mails.find((m) => m.id === id);
            if (targetMail && targetMail.read === 1) return;

            const resp = await fetchNui<any>(MailEvents.SET_MAIL_READ, id, { status: 'ok', data: true });
            if (resp && resp.status === 'ok' && resp.data) {
                setMails((prev) =>
                    prev.map((mail) => (mail.id === id ? { ...mail, read: 1 } : mail))
                );
            }
        } catch (e) {
            console.error('Failed to set mail read', e);
        }
    };

    const updateButton = async (id: number, buttonParams: any) => {
        try {
            const resp = await fetchNui<any>(MailEvents.UPDATE_BUTTON, { id, button: buttonParams }, { status: 'ok' });
            if (resp && resp.status === 'ok') {
                setMails((prev) =>
                    prev.map((mail) => (mail.id === id ? { ...mail, button: null } : mail))
                );
            }
        } catch (e) {
            console.error('Failed to update button', e);
        }
    };

    useNuiEvent('MAIL', 'npwd:mail:receiveNew', (newMail: MailMessage) => {
        setMails((prev) => [newMail, ...prev]);
    });

    useEffect(() => {
        fetchMails();
    }, []);

    return { mails, fetchMails, deleteMail, setMailRead, updateButton };
};
