import React, { useEffect, useState } from 'react';
import fetchNui from '@utils/fetchNui';
import { ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const numberFormat = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';

    let date: Date;
    if (typeof dateValue === 'number') {
      // Handle Unix timestamps (seconds or milliseconds)
      date = new Date(dateValue > 1000000000000 ? dateValue : dateValue * 1000);
    } else {
      date = new Date(dateValue);
    }

    if (isNaN(date.getTime())) return dateValue;

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const result = await fetchNui('getTransactionsFromClient', undefined, mockTransactions);
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
    (t.targetName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.identifier || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* Section Title + Search */}
      <div className="px-4 pb-3 space-y-3">
        <h3 className="text-[13px] font-semibold text-neutral-500 uppercase px-1">Últimas atividades</h3>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search size={16} className="stroke-[2.5px]" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-[10px] bg-neutral-200/60 dark:bg-neutral-800/60 border-none text-[15px] focus:ring-0 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <span className="text-[13px] text-neutral-400">Consultando extrato...</span>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="bg-white dark:bg-neutral-800/50 rounded-[10px] overflow-hidden divide-y divide-neutral-200/60 dark:divide-neutral-700/40">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between px-4 py-3 active:bg-neutral-100 dark:active:bg-neutral-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    transaction.type === 'sent'
                      ? "bg-red-100 dark:bg-red-500/15 text-red-500"
                      : "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-500"
                  )}>
                    {transaction.type === 'sent' ? <ArrowUpRight size={18} strokeWidth={2.5} /> : <ArrowDownLeft size={18} strokeWidth={2.5} />}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-medium text-neutral-900 dark:text-white truncate">
                      {transaction.targetName || 'Transação'}
                    </span>
                    <span className="text-[12px] text-neutral-400">{formatDate(transaction.date)}</span>
                  </div>
                </div>

                <span className={cn(
                  "text-[15px] font-semibold tabular-nums",
                  transaction.type === 'sent' ? "text-red-500" : "text-emerald-500"
                )}>
                  {transaction.type === 'sent' ? `- ${numberFormat(transaction.amount)}` : `+ ${numberFormat(transaction.amount)}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-[13px] text-neutral-400">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankStatement;
