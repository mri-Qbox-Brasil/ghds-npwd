import { DbInterface } from '@npwd/database';
import { MailMessage } from '@typings/mail';
import PlayerService from '../players/player.service';

const MailService = {
    fetchQuery: `SELECT * FROM player_mails WHERE citizenid = ? ORDER BY date DESC`,
    deleteQuery: `DELETE FROM player_mails WHERE id = ? AND citizenid = ?`,
    setReadQuery: `UPDATE player_mails SET \`read\` = 1 WHERE id = ? AND citizenid = ?`,
    insertQuery: `INSERT INTO player_mails (citizenid, sender, subject, message, mailid, button) VALUES (?, ?, ?, ?, ?, ?)`,

    async getPlayerMails(source: number): Promise<MailMessage[]> {
        const player = PlayerService.getPlayer(source);
        if (!player) throw new Error('Player not found');

        const [results] = await DbInterface._rawExec(this.fetchQuery, [player.getIdentifier()]);
        const records = <any[]>results || [];

        // Ensure Date objects from the database are serialized to strings 
        // before passing them through the FiveM network layer. Also decode button payload.
        return records.map(record => ({
            ...record,
            button: record.button ? JSON.parse(record.button) : undefined,
            date: record.date instanceof Date ? record.date.toISOString() : new Date(record.date).toISOString()
        })) as MailMessage[];
    },

    async sendMail(identifier: string, sender: string, subject: string, message: string, button?: any): Promise<boolean> {
        const mailid = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
        const buttonPayload = button && Object.keys(button).length > 0 ? JSON.stringify(button) : null;

        const [result] = await DbInterface._rawExec(this.insertQuery, [identifier, sender, subject, message, mailid, buttonPayload]);
        return (<any>result).affectedRows > 0;
    },

    async deleteMail(source: number, id: number): Promise<boolean> {
        const player = PlayerService.getPlayer(source);
        if (!player) throw new Error('Player not found');

        const [result] = await DbInterface._rawExec(this.deleteQuery, [id, player.getIdentifier()]);
        return (<any>result).affectedRows > 0;
    },

    async setMailRead(source: number, id: number): Promise<boolean> {
        const player = PlayerService.getPlayer(source);
        if (!player) throw new Error('Player not found');

        const [result] = await DbInterface._rawExec(this.setReadQuery, [id, player.getIdentifier()]);
        return (<any>result).affectedRows > 0;
    },

    async wipeButton(source: number, id: number): Promise<boolean> {
        const player = PlayerService.getPlayer(source);
        if (!player) throw new Error('Player not found');

        const query = `UPDATE player_mails SET button = NULL WHERE id = ? AND citizenid = ?`;
        const [result] = await DbInterface._rawExec(query, [id, player.getIdentifier()]);
        return (<any>result).affectedRows > 0;
    }
};

export default MailService;
