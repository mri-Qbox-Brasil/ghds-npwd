import { atom, selector } from 'recoil';
import { MailMessage } from '@typings/mail';

export const mailState = atom<MailMessage[]>({
    key: 'mailState',
    default: [],
});

export const unreadMailsSelector = selector({
    key: 'unreadMailsSelector',
    get: ({ get }) => {
        const mails = get(mailState);
        return mails.filter((mail) => mail.read === 0).length;
    },
});
