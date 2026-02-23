import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<void, any>('npwd:getWeather', async (reqObj, resp) => {
    try {
        // Usando StateBag Vanilla do FiveM (não precisa tocar no script de Clima)
        // No NodeJS FiveM env, state bags não são diretamente acessíveis sem bridge proxy, 
        // mas o Renewed-Weathersync fornece os exports de retrocompatibilidade do qb-weathersync.
        let current = 'CLEAR';
        try {
            current = global.exports['qb-weathersync'].getWeatherState();
        } catch {
            current = 'EXTRASUNNY'; // fallback seguro
        }

        resp({ status: 'ok', data: { current: { weather: current, time: 0 }, forecast: [] } });
    } catch (e) {
        console.error('Failed to get weather from Server', e);
        resp({ status: 'error', errorMsg: 'Failed to get weather formulation' });
    }
});
