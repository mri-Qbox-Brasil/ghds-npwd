import React, { useEffect, useRef, useState } from 'react';
import { Car, MapPin, ChevronRight, Info } from 'lucide-react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import fetchNui from '@utils/fetchNui';
import VehicleDetail from './VehicleDetail';

export interface Vehicle {
    id: number;
    plate: string;
    vehicle: string;
    vehicle_name: string;
    garage: string;
    state: number;
    fuel: number;
    engine: number;
    body: number;
    coords?: { x: number; y: number; z: number };
    street?: string;
}

const GarageApp: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchVehicles = async () => {
        try {
            const result = await fetchNui<Vehicle[]>('getGarageVehicles');
            if (result) {
                setVehicles(result);
            }
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const getStatusLabel = (veh: Vehicle) => {
        switch (veh.state) {
            case 0:
                return veh.coords
                    ? { label: 'Na Rua', color: 'text-orange-500' }
                    : { label: 'Retido (Depot)', color: 'text-orange-500' };
            case 1:
                return { label: 'Na Garagem', color: 'text-emerald-500' };
            case 2:
                return { label: 'Apreendido', color: 'text-red-500' };
            default:
                return { label: 'Desconhecido', color: 'text-neutral-500' };
        }
    };

    if (selectedVehicle) {
        return <VehicleDetail vehicle={selectedVehicle} onBack={() => setSelectedVehicle(null)} />;
    }

    return (
        <AppWrapper className="bg-neutral-50 dark:bg-neutral-900">
            <DynamicHeader title="Garagem" scrollRef={scrollRef} variant="pinned" />

            <AppContent ref={scrollRef} className="flex flex-col grow scrollbar-hide">
                <DynamicHeader title="Meus Veículos" scrollRef={scrollRef} variant="largeTitle" />

                <div className="px-4 pb-20">
                    {vehicles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                            <Car size={48} strokeWidth={1.5} className="mb-4 opacity-20" />
                            <p className="text-[15px]">Nenhum veículo encontrado</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {vehicles.map((veh) => {
                                const status = getStatusLabel(veh);
                                return (
                                    <button
                                        key={veh.id}
                                        onClick={() => setSelectedVehicle(veh)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 active:scale-[0.98] transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                <Car size={24} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-[16px] font-bold text-neutral-900 dark:text-white leading-tight">
                                                    {veh.vehicle_name || veh.vehicle}
                                                </h3>
                                                <p className="text-[13px] text-neutral-500 font-medium">
                                                    {veh.plate}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <p className={`text-[12px] font-bold ${status.color}`}>
                                                    {status.label}
                                                </p>
                                                <p className="text-[11px] text-neutral-400">
                                                    {veh.state === 1 ? veh.garage :
                                                        veh.coords ? (veh.street || 'Rua') : 'Depot'}
                                                </p>
                                            </div>
                                            <ChevronRight size={16} className="text-neutral-300" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </AppContent>
        </AppWrapper>
    );
};

export default GarageApp;
