import { MailMessage } from '@typings/mail';
import { ServerPromiseResp } from '@typings/common';

export const MockMails: MailMessage[] = [
    {
        id: 1,
        citizenid: 'BGD12345',
        sender: 'Dynasty 8 Real Estate',
        subject: 'Payment Confirmation',
        message: 'Your monthly mortgage payment of $2,500 has been successfully processed.',
        read: 0,
        date: new Date().toISOString(),
    },
    {
        id: 2,
        citizenid: 'BGD12345',
        sender: 'Fleeca Bank',
        subject: 'Recent Transaction Alert',
        message: 'A recent transfer of $5,000 has been initiated from your checking account. If you did not authorize this, please contact support immediately.',
        read: 1,
        date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 3,
        citizenid: 'BGD12345',
        sender: 'Los Santos Customs',
        subject: 'Your vehicle is ready!',
        message: 'Hey there! Your Elegy Retro Custom has been fully repaired and modifications have been applied. Come pick it up anytime before 8 PM.',
        read: 1,
        date: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 4,
        citizenid: 'BGD12345',
        sender: 'Simeon Yetarian',
        subject: 'Vehicle Request',
        message: 'My friend! I have a client looking for a pristine Futo. Bring one to the docks in perfect condition and I will make it worth your while.',
        read: 0,
        date: new Date(Date.now() - 259200000).toISOString(),
    },
    {
        id: 5,
        citizenid: 'BGD12345',
        sender: 'Pillbox Hill Medical Center',
        subject: 'Billing Statement',
        message: 'Your recent visit to Pillbox Hill Medical Center resulted in a charge of $500. Please ensure payment is made within 14 days.',
        read: 1,
        date: new Date(Date.now() - 432000000).toISOString(),
    }
];

export const MockMailsServerResp: ServerPromiseResp<MailMessage[]> = {
    data: MockMails,
    status: 'ok',
};
