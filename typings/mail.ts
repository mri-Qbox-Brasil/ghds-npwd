export interface MailMessage {
    id: number;
    citizenid: string;
    sender: string;
    subject: string;
    message: string;
    read: number;
    date: string;
}

export enum MailEvents {
    FETCH_MAILS = 'npwd:mail:fetchMails',
    DELETE_MAIL = 'npwd:mail:deleteMail',
    SET_MAIL_READ = 'npwd:mail:setMailRead',
}
