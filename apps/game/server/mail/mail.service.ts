import { DbInterface } from '@npwd/database';
import { MailMessage } from '@typings/mail';
import PlayerService from '../players/player.service';

const MailService = {
    fetchQuery: `SELECT * FROM player_mails WHERE citizenid = ? ORDER BY date DESC`,
    deleteQuery: `DELETE FROM player_mails WHERE id = ? AND citizenid = ?`,
    setReadQuery: `UPDATE player_mails SET \`read\` = 1 WHERE id = ? AND citizenid = ?`,

    async getPlayerMails(source: number): Promise<MailMessage[]> {
        const player = PlayerService.getPlayer(source);
        if (!player) throw new Error('Player not found');

        const [results] = await DbInterface._rawExec(this.fetchQuery, [player.getIdentifier()]);
        return <MailMessage[]>results || [];
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
    }
};

export default MailService;
