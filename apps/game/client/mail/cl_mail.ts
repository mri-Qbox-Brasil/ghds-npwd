import { RegisterNuiProxy, RegisterNuiCB } from '../cl_utils';
import { MailEvents } from '@typings/mail';
import { sendMessage } from '../../utils/messages';

RegisterNuiProxy(MailEvents.FETCH_MAILS);
RegisterNuiProxy(MailEvents.DELETE_MAIL);
RegisterNuiProxy(MailEvents.SET_MAIL_READ);

onNet('npwd:mail:receiveNew', (mailData: any) => {
    // Forward the mail update directly to the React layer
    sendMessage('MAIL', 'npwd:mail:receiveNew', mailData);

    // Provide the OS with a visual notification
    global.exports.npwd.createNotification({
        notisId: `mail-${Math.random()}`,
        appId: 'MAIL',
        content: `New email from ${mailData.sender}`,
        keepOpen: false,
        duration: 5000,
        path: '/mail'
    });
});

RegisterNuiCB(MailEvents.UPDATE_BUTTON, async (data: { id: number, button: any }, cb: (data: any) => void) => {
    try {
        const btnResp = data.button;
        if (btnResp) {
            const ev = btnResp.buttonEvent;
            const args = btnResp.buttonData || [];
            const isServer = btnResp.isServer;

            if (isServer) {
                emitNet(ev, ...(Array.isArray(args) ? args : [args]));
            } else {
                emit(ev, ...(Array.isArray(args) ? args : [args]));
            }
        }

        // Notify server to nullify the button in DB
        emitNet('npwd:mail:wipeButton', data.id);
        cb({ status: 'ok' });
    } catch (e) {
        cb({ status: 'error' });
    }
});
