import StoreService from './store.service';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<void, string | null>('npwd:getInstalledApps', (reqObj, resp) => {
    StoreService.handleGetInstalledApps(reqObj, resp).catch((e) => {
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<string, void>('npwd:setInstalledApps', (reqObj, resp) => {
    StoreService.handleSetInstalledApps(reqObj, resp).catch((e) => {
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});
