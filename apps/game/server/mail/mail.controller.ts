import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import { PromiseEventResp, PromiseRequest } from "../lib/PromiseNetEvents/promise.types";
import { MailEvents, MailMessage } from '@typings/mail';
import MailService from './mail.service';
import { mainLogger } from '../sv_logger';

onNetPromise<void, MailMessage[]>(MailEvents.FETCH_MAILS, async (reqObj: PromiseRequest<void>, resp: PromiseEventResp<MailMessage[]>) => {
    try {
        const mails = await MailService.getPlayerMails(reqObj.source);
        resp({ status: 'ok', data: mails });
    } catch (e) {
        mainLogger.error(`Error occurred in fetch mails (${reqObj.source}), Error: ${(e as Error).message}`);
        resp({ status: 'error', errorMsg: (e as Error).message });
    }
});

onNetPromise<number, boolean>(MailEvents.DELETE_MAIL, async (reqObj: PromiseRequest<number>, resp: PromiseEventResp<boolean>) => {
    try {
        const success = await MailService.deleteMail(reqObj.source, reqObj.data);
        resp({ status: 'ok', data: success });
    } catch (e) {
        mainLogger.error(`Error occurred while deleting mail (${reqObj.source}), Error: ${(e as Error).message}`);
        resp({ status: 'error', errorMsg: (e as Error).message });
    }
});

onNetPromise<number, boolean>(MailEvents.SET_MAIL_READ, async (reqObj: PromiseRequest<number>, resp: PromiseEventResp<boolean>) => {
    try {
        const success = await MailService.setMailRead(reqObj.source, reqObj.data);
        resp({ status: 'ok', data: success });
    } catch (e) {
        mainLogger.error(`Error occurred while setting mail read (${reqObj.source}), Error: ${(e as Error).message}`);
        resp({ status: 'error', errorMsg: (e as Error).message });
    }
});
