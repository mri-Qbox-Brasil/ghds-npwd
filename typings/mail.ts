export interface MailMessage {
    id: number;
    citizenid: string;
    sender: string;
    subject: string;
    message: string;
    read: number;
    mailid?: number;
    button?: any;
    date: string;
}

export interface ComposeMailData {
    target: string;
    subject: string;
    message: string;
}

export enum MailEvents {
    FETCH_MAILS = 'npwd:mail:fetchMails',
    DELETE_MAIL = 'npwd:mail:deleteMail',
    SET_MAIL_READ = 'npwd:mail:setMailRead',
    UPDATE_BUTTON = 'npwd:mail:updateButton',
    SEND_MAIL = 'npwd:mail:sendMail',
}
