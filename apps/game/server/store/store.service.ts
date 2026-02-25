import PlayerService from '../players/player.service';
import { StoreDB, _StoreDB } from './store.database';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { mainLogger } from '../sv_logger';

const storeLogger = mainLogger.child({ module: 'store' });

class _StoreService {
    private readonly db: _StoreDB;

    constructor() {
        this.db = StoreDB;
        storeLogger.debug('Store service started');
    }

    async handleGetInstalledApps(
        reqObj: PromiseRequest<void>,
        resp: PromiseEventResp<string | null>,
    ): Promise<void> {
        const identifier = PlayerService.getIdentifier(reqObj.source);
        try {
            const installedApps = await this.db.getInstalledApps(identifier);
            resp({ status: 'ok', data: installedApps });
        } catch (e) {
            storeLogger.error(`Error in handleGetInstalledApps: ${e.message}`);
            resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
        }
    }

    async handleSetInstalledApps(
        reqObj: PromiseRequest<string>,
        resp: PromiseEventResp<void>,
    ): Promise<void> {
        const identifier = PlayerService.getIdentifier(reqObj.source);
        try {
            await this.db.setInstalledApps(identifier, reqObj.data);
            resp({ status: 'ok' });
        } catch (e) {
            storeLogger.error(`Error in handleSetInstalledApps: ${e.message}`);
            resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
        }
    }
}

const StoreService = new _StoreService();
export default StoreService;
