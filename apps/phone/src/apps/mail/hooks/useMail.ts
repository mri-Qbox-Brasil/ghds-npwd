import { useRecoilState } from 'recoil';
import { mailState } from './state';
import fetchNui from '@utils/fetchNui';
import { MailEvents, MailMessage } from '@typings/mail';
import { useEffect } from 'react';

const mockMails: MailMessage[] = [
    {
        id: 1,
        citizenid: '12345',
        sender: 'Bank of Los Santos',
        subject: 'Your recent deposit',
        message: 'Dear customer, your recent deposit of <b>$5,000</b> has been successfully processed.',
        read: 0,
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        id: 2,
        citizenid: '12345',
        sender: 'Simeon Yetarian',
        subject: 'Car Repossession',
        message: 'Hello my friend! I have a very special job for you. Please come see me at the dealership immediately. Do not disappoint me!',
        read: 1,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: 3,
        citizenid: '12345',
        sender: 'Central Hospital',
        subject: 'Medical Bill Overdue',
        message: 'Your recent medical bill of $1,200 is past due. Please pay immediately to avoid further penalties or collections.',
        read: 1,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    }
];

export const useMail = () => {
    const [mails, setMails] = useRecoilState(mailState);

    const fetchMails = async () => {
        try {
            const resp = await fetchNui<any>(MailEvents.FETCH_MAILS, undefined, { status: 'ok', data: mockMails });
            if (resp && resp.status === 'ok') {
                setMails(resp.data);
            }
        } catch (e) {
            console.error('Failed to fetch mails', e);
        }
    };

    const deleteMail = async (id: number) => {
        try {
            const resp = await fetchNui<any>(MailEvents.DELETE_MAIL, id, { status: 'ok', data: true });
            if (resp && resp.status === 'ok' && resp.data) {
                setMails((prev) => prev.filter((mail) => mail.id !== id));
            }
        } catch (e) {
            console.error('Failed to delete mail', e);
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

    useEffect(() => {
        fetchMails();
    }, []);

    return { mails, fetchMails, deleteMail, setMailRead };
};
