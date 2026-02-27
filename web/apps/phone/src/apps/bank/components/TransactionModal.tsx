import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Modal from '../../../ui/components/Modal';
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

  return (
    <Modal visible={open} handleClose={onClose}>
      <div className="space-y-5">
        <h2 className="text-[17px] font-semibold text-neutral-900 dark:text-white">Transferir</h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-neutral-500 pl-1">Passaporte</label>
            <input
              type="text"
              placeholder="CPF ou ID do cidadão"
              value={passaporte}
              onChange={(e) => setPassaporte(e.target.value)}
              className="w-full h-11 px-4 bg-neutral-100 dark:bg-neutral-800 border-none rounded-[10px] text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-neutral-500 pl-1">Valor</label>
            <input
              type="number"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full h-11 px-4 bg-neutral-100 dark:bg-neutral-800 border-none rounded-[10px] text-[17px] font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500/50 transition-all tabular-nums"
            />
          </div>
        </div>

        <button
          disabled={!passaporte || !valor || isSending}
          onClick={handleTransfer}
          className={cn(
            "w-full h-11 rounded-[10px] font-semibold text-[15px] transition-all active:scale-[0.98] flex items-center justify-center gap-2",
            !passaporte || !valor || isSending
              ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed"
              : "bg-emerald-500 text-white active:bg-emerald-600"
          )}
        >
          {isSending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Send size={15} strokeWidth={2.5} />
              Confirmar transferência
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-neutral-400">
          Transferência instantânea via Pix
        </p>
      </div>
    </Modal>
  );
};

export default TransactionModal;
