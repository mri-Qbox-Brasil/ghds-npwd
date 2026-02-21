import React, { useState } from 'react';
import { UserCircle, Banknote, X, Send, UserCheck, Smartphone } from 'lucide-react';
import fetchNui from '@utils/fetchNui';
import { cn } from '@utils/cn';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ open, onClose }) => {
  const [passaporte, setPassaporte] = useState('');
  const [valor, setValor] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleTransfer = async () => {
    if (!passaporte || !valor || isSending) return;

    const data = {
      id: passaporte,
      amount: parseFloat(valor),
      method: "id"
    };

    setIsSending(true);
    try {
      const response: any = await fetchNui('ps-banking:server:transferMoney', data);
      if (response?.success) {
        onClose();
        setPassaporte('');
        setValor('');
      }
    } catch (error) {
      console.error('Erro na transferência:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 px-6">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[36px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-neutral-100 dark:border-neutral-800">
        <header className="p-6 pb-2 flex items-center justify-between border-b border-neutral-50 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Send size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic">Transferir</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-90"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </header>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 italic">Passaporte:</label>
              <div className="relative group">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="CPF ou ID do cidadão..."
                  value={passaporte}
                  onChange={(e) => setPassaporte(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl text-sm font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 italic">Valor da Transferência:</label>
              <div className="relative group">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl text-lg font-black italic text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              disabled={!passaporte || !valor || isSending}
              onClick={handleTransfer}
              className={cn(
                "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3",
                !passaporte || !valor || isSending
                  ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none"
                  : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30"
              )}
            >
              {isSending ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send size={20} strokeWidth={3} />
                  Confirmar Envio
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-300 dark:text-neutral-600 italic">
              <Smartphone size={10} />
              <span>Transferência Instantânea via Pix</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
