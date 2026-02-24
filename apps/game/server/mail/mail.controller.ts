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

onNetPromise<number | number[], boolean>(MailEvents.DELETE_MAIL, async (reqObj: PromiseRequest<number | number[]>, resp: PromiseEventResp<boolean>) => {
    try {
        const ids = Array.isArray(reqObj.data) ? reqObj.data : [reqObj.data];
        let success = true;

        for (const id of ids) {
            const result = await MailService.deleteMail(reqObj.source, id);
            if (!result) success = false;
        }

        resp({ status: 'ok', data: success });
    } catch (e) {
        mainLogger.error(`Error occurred while deleting mail(s) (${reqObj.source}), Error: ${(e as Error).message}`);
        resp({ status: 'error', errorMsg: (e as Error).message });
    }
});

onNetPromise<number, boolean>(MailEvents.SET_MAIL_READ, async (reqObj: PromiseRequest<number>, resp: PromiseEventResp<boolean>) => {
    try {
        const success = await MailService.setMailRead(reqObj.source, reqObj.data);
        resp({ status: 'ok', data: success });
    } catch (e) {
        resp({ status: 'error', errorMsg: (e as Error).message });
    }
});

onNetPromise<{ target: string; subject: string; message: string }, boolean>(MailEvents.SEND_MAIL, async (reqObj: PromiseRequest<{ target: string; subject: string; message: string }>, resp: PromiseEventResp<boolean>) => {
    try {
        const player = global.exports.qbx_core.GetPlayer(reqObj.source);
        if (!player) {
            resp({ status: 'error', errorMsg: 'Player not found' });
            return;
        }

        const senderAuth = player.PlayerData.charinfo.firstname + ' ' + player.PlayerData.charinfo.lastname;
        await MailService.sendMail(reqObj.data.target, senderAuth, reqObj.data.subject, reqObj.data.message);

        // Push notification to target if they are online
        const targetPlayer = global.exports.qbx_core.GetPlayerByCitizenId(reqObj.data.target);
        if (targetPlayer) {
            emitNet('npwd:mail:receiveNew', targetPlayer.PlayerData.source, {
                id: 0,
                sender: senderAuth,
                subject: reqObj.data.subject,
                message: reqObj.data.message,
                citizenid: reqObj.data.target,
                button: null,
                read: 0,
                date: new Date().toISOString()
            });
        }

        resp({ status: 'ok', data: true });
    } catch (e) {
        mainLogger.error(`Error occurred while sending mail (${reqObj.source}), Error: ${(e as Error).message}`);
        resp({ status: 'error', errorMsg: (e as Error).message });
    }
});

onNet('npwd:mail:wipeButton', async (id: number) => {
    const src = global.source;
    if (!src || src === 0) return;
    try {
        await MailService.wipeButton(src, id);
    } catch (e) {
        mainLogger.error(`Failed to wipe button for mail ${id}: ${(e as Error).message}`);
    }
});

RegisterCommand('testmail', async (source: number) => {
    if (source === 0) return; // Ignore console
    try {
        const player = global.exports.qbx_core.GetPlayer(source);
        if (!player) return;

        const identifier = player.PlayerData.citizenid;

        // Trigger our newly created global event
        emit('qb-phone:server:sendNewMail', {
            sender: 'Dynasty 8 Real Estate',
            subject: 'Payment Confirmation',
            message: 'Your monthly mortgage payment of <b>$2,500</b> has been successfully processed.',
            citizenid: identifier, // Required since the Lua bridge uses this when `source` is null over server emits
            button: {
                buttonEvent: 'QBCore:Client:PrintTest',
                buttonData: ['Test button pushed from email!']
            }
        });
        mainLogger.info(`Sent test email to ${identifier}`);
    } catch (e) {
        mainLogger.error(`Failed to send testmail: ${(e as Error).message}`);
    }
}, false);

// Proxy Receiver for local mail_bridge.lua events
on('npwd:mail:proxyNewMail', async (src: number | null, explicitCitizenId: string | null, sender: string, subject: string, message: string, button: any) => {
    let identifier = explicitCitizenId;
    let actualSource = src;

    try {
        if (actualSource && actualSource > 0) {
            const player = global.exports.qbx_core.GetPlayer(actualSource);
            if (player) {
                identifier = player.PlayerData.citizenid;
            }
        }

        if (!identifier) {
            mainLogger.error(`Failed to handle proxy mail: No citizenid or active source available.`);
            return;
        }

        await MailService.sendMail(identifier, sender, subject, message, button);

        // If we don't have a valid source (e.g., triggered from a server script), try to find the player
        if (!actualSource || actualSource === 0) {
            const player = global.exports.qbx_core.GetPlayerByCitizenId(identifier);
            if (player) {
                actualSource = player.PlayerData.source;
            }
        }

        if (actualSource && actualSource > 0) {
            // Only attempt to update the live UI if we have an active player session
            emitNet('npwd:mail:receiveNew', actualSource, {
                id: 0,
                sender,
                subject,
                message,
                citizenid: identifier,
                button,
                read: 0,
                date: new Date().toISOString()
            });
        }
        mainLogger.info(`Successfully proxied mail from ${sender} to ${identifier}.`);
    } catch (e) {
        mainLogger.error(`Failed to handle proxy mail: ${(e as Error).message}`);
    }
});
