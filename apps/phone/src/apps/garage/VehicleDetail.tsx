import React from 'react';
import { ArrowLeft, MapPin, Navigation, UserCheck, Fuel, Activity, ShieldCheck } from 'lucide-react';
import { AppWrapper, AppContent } from '@ui/components';
import fetchNui from '@utils/fetchNui';
import { Vehicle } from './Garage';

interface VehicleDetailProps {
    vehicle: Vehicle;
    onBack: () => void;
}

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onBack }) => {
    const handleTrack = () => {
        fetchNui('trackVehicle', { plate: vehicle.plate, garage: vehicle.garage, state: vehicle.state });
    };

    const handleValet = () => {
        fetchNui('callValet', { plate: vehicle.plate, model: vehicle.vehicle });
    };

    const getStatusColor = (state: number) => {
        switch (state) {
            case 0: return 'bg-orange-500';
            case 1: return 'bg-emerald-500';
            case 2: return 'bg-red-500';
            default: return 'bg-neutral-500';
        }
    };

    return (
        <AppWrapper className="bg-neutral-50 dark:bg-neutral-900">
            <div className="fixed top-0 left-0 right-0 z-50 px-4 py-8 flex items-center justify-between pointer-events-none">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md flex items-center justify-center text-neutral-900 dark:text-white shadow-sm pointer-events-auto active:scale-90 transition-transform"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <AppContent className="flex flex-col grow scrollbar-hide overflow-x-hidden">
                {/* Hero Section */}
                <div className="relative pt-24 pb-12 px-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-3xl bg-white dark:bg-neutral-800 flex items-center justify-center shadow-xl mb-6">
                            <Activity size={64} className="text-emerald-500" />
                        </div>
                        <h1 className="text-[28px] font-black text-neutral-900 dark:text-white leading-tight text-center">
                            {vehicle.vehicle_name || vehicle.vehicle}
                        </h1>
                        <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.state)}`} />
                            <span className="text-[12px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                                {vehicle.plate}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="px-6 grid grid-cols-2 gap-3 mb-8">
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                        <Fuel size={18} className="text-orange-500 mb-2" />
                        <p className="text-[11px] font-bold text-neutral-400 uppercase">Combustível</p>
                        <p className="text-[18px] font-black text-neutral-900 dark:text-white">{vehicle.fuel}%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                        <Activity size={18} className="text-emerald-500 mb-2" />
                        <p className="text-[11px] font-bold text-neutral-400 uppercase">Motor</p>
                        <p className="text-[18px] font-black text-neutral-900 dark:text-white">{(vehicle.engine / 10).toFixed(0)}%</p>
                    </div>
                </div>

                {/* Location Info */}
                <div className="px-6 mb-8">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h4 className="text-[14px] font-bold text-neutral-900 dark:text-white">Localização Atual</h4>
                            <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
                                {vehicle.state === 1 ? `Estacionado em ${vehicle.garage}` : 'Veículo está circulando ou em local desconhecido'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 space-y-3 pb-12">
                    <button
                        onClick={handleTrack}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-[16px] active:scale-[0.97] transition-all shadow-lg"
                    >
                        <Navigation size={20} />
                        <span>Rastrear Veículo</span>
                    </button>

                    {vehicle.state === 1 && (
                        <button
                            onClick={handleValet}
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-[16px] active:scale-[0.97] transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <UserCheck size={20} />
                            <span>Solicitar Manobrista</span>
                        </button>
                    )}
                </div>
            </AppContent>
        </AppWrapper>
    );
};

export default VehicleDetail;
