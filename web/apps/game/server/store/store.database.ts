import { DbInterface } from '@npwd/database';

export class _StoreDB {
    async getInstalledApps(identifier: string): Promise<string | null> {
        const query = 'SELECT installed_apps FROM npwd_players_apps WHERE identifier = ? LIMIT 1';
        const [result] = await DbInterface._rawExec(query, [identifier]);
        const rows = result as any[];
        if (rows.length === 0) return null;
        return rows[0].installed_apps;
    }

    async setInstalledApps(identifier: string, installedApps: string): Promise<void> {
        const query =
            'INSERT INTO npwd_players_apps (identifier, installed_apps) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE installed_apps = VALUES(installed_apps)';
        await DbInterface._rawExec(query, [identifier, installedApps]);
    }
}

export const StoreDB = new _StoreDB();
