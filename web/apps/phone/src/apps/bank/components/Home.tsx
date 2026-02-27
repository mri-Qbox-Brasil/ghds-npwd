import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, ArrowUpRight, CreditCard } from 'lucide-react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import fetchNui from '@utils/fetchNui';
import BankStatement from './BankStatement';
import TransactionModal from './TransactionModal';

const Home: React.FC = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchPlayerData = async () => {
    try {
      const result = await fetchNui('getBankCredentials', undefined, { balance: 250000 });
      if (result && result.balance !== undefined) {
        setBalance(result.balance);
      }
    } catch (error) {
      console.error('Erro ao obter dados do banco:', error);
    }
  };

  const numberFormat = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  return (
    <AppWrapper className="bg-white/40 dark:bg-black/40 backdrop-blur-md">
      {/* Pinned header */}
      <DynamicHeader title="Fleeca Bank" scrollRef={scrollRef} variant="pinned" />

      <AppContent
        ref={scrollRef}
        className="flex flex-col grow scrollbar-hide h-full relative"
      >
        {/* Large title */}
        <DynamicHeader title="Fleeca Bank" scrollRef={scrollRef} variant="largeTitle" />

        {/* Apple Card Style */}
        <div className="px-4 pb-6">
          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 p-5 text-white shadow-lg shadow-emerald-500/20">
            {/* Card background pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-white/70" />
                  <span className="text-[13px] font-medium text-white/70">Conta corrente</span>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 rounded-full bg-white/15 active:bg-white/25 transition-colors"
                >
                  {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Balance */}
              <div className="mb-8">
                <span className="text-[12px] font-medium text-white/60 block mb-1">Saldo disponível</span>
                <h2 className="text-[36px] font-bold tracking-tight tabular-nums leading-none">
                  {showBalance ? numberFormat(balance) : 'R$ ••••••'}
                </h2>
              </div>

              {/* Card bottom - bank name */}
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-white/50 tracking-wide">FLEECA</span>
                <div className="flex gap-1">
                  <div className="w-6 h-4 rounded-sm bg-white/20" />
                  <div className="w-6 h-4 rounded-sm bg-white/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - below card */}
          <div className="mt-4">
            <button
              onClick={() => setOpenModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors shadow-sm"
            >
              <div className="h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <ArrowUpRight size={14} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="text-[14px] font-semibold text-neutral-900 dark:text-white">Enviar dinheiro</span>
            </button>
          </div>
        </div>

        {/* Statement Section */}
        <BankStatement />

        <div className="h-20" />
      </AppContent>

      <TransactionModal open={openModal} onClose={() => setOpenModal(false)} />
    </AppWrapper>
  );
};

export default Home;
