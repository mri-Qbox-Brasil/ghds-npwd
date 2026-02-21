import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, UserCircle, CreditCard, ArrowUpRight, ArrowDownLeft, Landmark } from 'lucide-react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import fetchNui from '@utils/fetchNui';
import BankStatement from './BankStatement';
import { cn } from '@utils/cn';

const Home: React.FC = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  const fetchPlayerData = async () => {
    try {
      const result = await fetchNui('getBankCredentials');
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
    <AppWrapper className="bg-emerald-600 dark:bg-emerald-950">
      <AppContent className="flex flex-col h-full bg-[#f8faf9] dark:bg-black overflow-hidden rounded-t-[40px] mt-2 shadow-2xl">
        {/* Header Section */}
        <header className="px-6 pt-10 pb-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <Landmark size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic leading-none">Fleeca</h1>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1">Sua conta segura</span>
              </div>
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 text-neutral-400 hover:text-emerald-500 shadow-sm transition-all active:scale-90">
              <UserCircle size={22} />
            </button>
          </div>

          {/* Balance Card */}
          <div className="relative overflow-hidden p-8 rounded-[32px] bg-emerald-600 border border-emerald-500 shadow-xl shadow-emerald-600/20 text-white group animate-in slide-in-from-bottom-4 duration-700">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <CreditCard size={120} />
            </div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">Saldo Disponível</span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-emerald-100 italic">R$</span>
                <h2 className="text-5xl font-black tracking-tighter tabular-nums truncate">
                  {showBalance ? numberFormat(balance).replace('R$', '').trim() : '••••••••'}
                </h2>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-around gap-4">
              <div className="flex flex-col items-center gap-1 group/btn">
                <div className="p-3 rounded-2xl bg-white/10 group-hover/btn:bg-white group-hover/btn:text-emerald-600 transition-all active:scale-90">
                  <ArrowUpRight size={20} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Enviar</span>
              </div>
              <div className="flex flex-col items-center gap-1 group/btn">
                <div className="p-3 rounded-2xl bg-white/10 group-hover/btn:bg-white group-hover/btn:text-emerald-600 transition-all active:scale-90">
                  <ArrowDownLeft size={20} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Receber</span>
              </div>
            </div>
          </div>
        </header>

        {/* Statement Section */}
        <main className="flex-1 overflow-hidden">
          <BankStatement />
        </main>
      </AppContent>
    </AppWrapper>
  );
};

export default Home;
