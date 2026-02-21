import React, { useEffect, useState } from 'react';
import fetchNui from '@utils/fetchNui';
import { UserCircle, ArrowUpRight, ArrowDownLeft, Wallet, Calendar, Search } from 'lucide-react';
import TransactionModal from './TransactionModal';
import { cn } from '@utils/cn';

interface Transaction {
  id: number;
  amount: number;
  targetName: string;
  identifier: string;
  date: any;
  type: 'sent' | 'received';
}

const mockTransactions: Transaction[] = [
  { id: 1, amount: 2500, targetName: 'Lucas Mendes', identifier: 'ABC123', date: '13/08/2022', type: 'received' },
  { id: 2, amount: 250.00, targetName: 'Paula Soares', identifier: 'XYZ456', date: '13/08/2022', type: 'sent' },
  { id: 3, amount: 1250.75, targetName: 'Carlos Alberto', identifier: 'LMN789', date: '13/08/2022', type: 'received' },
  { id: 4, amount: 5000.00, targetName: 'Renata Martins', identifier: 'OPQ012', date: '13/08/2022', type: 'sent' },
  { id: 5, amount: 780.30, targetName: 'Gabriel Souza', identifier: 'DEF345', date: '12/08/2022', type: 'received' },
  { id: 6, amount: 920.10, targetName: 'Sandra Lima', identifier: 'GHI678', date: '12/08/2022', type: 'sent' },
];

const BankStatement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const numberFormat = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const result = await fetchNui('getTransactionsFromClient');
      if (result && Array.isArray(result)) {
        setTransactions(result);
      } else {
        setTransactions(mockTransactions);
      }
    } catch (error) {
      setTransactions(mockTransactions);
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t =>
    t.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900/50 rounded-t-[40px] shadow-inner animate-in slide-in-from-bottom duration-700">
      {/* Search and Filters Header */}
      <div className="px-6 pt-8 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 italic">Últimas Atividades</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenModal(true)}
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-95"
            >
              <ArrowUpRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl text-xs font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 text-emerald-500 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            <span className="text-[10px] font-black uppercase tracking-widest italic text-neutral-400">Consultando extrato...</span>
          </div>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800/40 rounded-3xl border border-neutral-50 dark:border-neutral-800 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-right duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                  transaction.type === 'sent'
                    ? "bg-red-50 dark:bg-red-500/10 text-red-500"
                    : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"
                )}>
                  {transaction.type === 'sent' ? <ArrowUpRight size={22} strokeWidth={3} /> : <ArrowDownLeft size={22} strokeWidth={3} />}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-neutral-900 dark:text-white truncate tracking-tight">{transaction.targetName}</span>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {transaction.date}</span>
                    <span className="opacity-40">/</span>
                    <span className="truncate max-w-[60px]">{transaction.identifier}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className={cn(
                  "text-[15px] font-black italic tracking-tighter",
                  transaction.type === 'sent' ? "text-red-500" : "text-emerald-500"
                )}>
                  {transaction.type === 'sent' ? `- ${numberFormat(transaction.amount)}` : `+ ${numberFormat(transaction.amount)}`}
                </span>
                <span className="text-[9px] font-bold text-neutral-300 dark:text-neutral-600 uppercase tracking-widest">BRL</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-20 text-neutral-400 gap-4">
            <Wallet size={48} />
            <p className="font-bold uppercase tracking-widest text-xs italic">Nenhuma transação encontrada</p>
          </div>
        )}

        <div className="py-6 text-center">
          <p className="text-[10px] font-bold text-neutral-300 dark:text-neutral-600 uppercase tracking-[0.2em] italic">
            Visite uma agência para contas PJ
          </p>
        </div>
      </div>

      <TransactionModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default BankStatement;
