import { useState, useEffect } from 'react';
import fetchNui from '@utils/fetchNui';

export interface WeatherData {
    current: {
        weather: string;
        hasSnow?: boolean;
        windDirection?: number;
        windSpeed?: number;
        time: number;
    };
    forecast: {
        weather: string;
        time: number;
    }[];
}

export const useWeather = () => {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNui<any>('npwd:getWeather', {}, {
            status: 'ok',
            data: {
                current: { weather: 'CLEAR', time: 12 },
                forecast: [
                    { weather: 'CLOUDS', time: 13 },
                    { weather: 'RAIN', time: 14 }
                ]
            }
        })
            .then((res) => {
                if (res.status === 'ok') {
                    setData(res.data);
                }
            })
            .catch((e) => console.error('Failed to fetch weather', e))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading };
};
