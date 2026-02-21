import React, { useState } from 'react';
import { Modal2 } from '@ui/components/Modal';
import { useTranslation } from 'react-i18next';
import { useDarkchatAPI } from '@apps/darkchat/hooks/useDarkchatAPI';
import { useHistory } from 'react-router-dom';
import { useActiveDarkchatValue, useDarkchatMembersValue } from '@apps/darkchat/state/state';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { ArrowLeftRight, Trash2, Users, ShieldAlert, X, ChevronRight, Hash } from 'lucide-react';
import { cn } from '@utils/cn';

interface OwnerModalProps {
  open: boolean;
  closeModal: () => void;
}

export const OwnerModal: React.FC<OwnerModalProps> = ({ open, closeModal }) => {
  const [channelValue, setChannelValue] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'members' | 'danger'>('members');
  const channelMembers = useDarkchatMembersValue();
  const myPhoneNumber = useMyPhoneNumber();

  const filteredMembers =
    channelMembers && channelMembers.filter((member) => member.phoneNumber !== myPhoneNumber);

  const [t] = useTranslation();
  const { transferOwnership, deleteChannel } = useDarkchatAPI();
  const history = useHistory();
  const activeDarkChat = useActiveDarkchatValue();

  const canDelete = activeDarkChat.identifier === channelValue;
  const isOwner = activeDarkChat.owner === myPhoneNumber;

  const handleDeleteChannel = () => {
    closeModal();
    deleteChannel(activeDarkChat.id);
    history.push('/darkchat');
  };

  const handleTransferOwnership = (memberIdentifier: string, phoneNumber: string) => {
    closeModal();
    transferOwnership(activeDarkChat.id, memberIdentifier, phoneNumber);
  };

  return (
    <Modal2 visible={open} handleClose={closeModal} className="p-0 overflow-hidden bg-neutral-950 rounded-[32px] border border-neutral-900 shadow-2xl">
      <header className="p-6 border-b border-neutral-900 bg-neutral-950 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <ShieldAlert size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Gerenciar</h2>
          </div>
          <button onClick={closeModal} className="text-neutral-600 hover:text-red-500 transition-colors">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="flex p-1 bg-neutral-900 rounded-2xl">
          <button
            onClick={() => setActiveTab('members')}
            className={cn(
              "flex-1 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'members' ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Membros
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={cn(
              "flex-1 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'danger' ? "bg-red-500/20 text-red-500" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Zona de Risco
          </button>
        </div>
      </header>

      <div className="p-6 h-[400px] overflow-y-auto scrollbar-hide">
        {activeTab === 'members' ? (
          <div className="space-y-2">
            {filteredMembers && filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member.phoneNumber} className="flex items-center justify-between p-4 bg-neutral-900/40 rounded-2xl border border-neutral-900 group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-500">
                      <Users size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-neutral-200">#{member.phoneNumber.slice(-4)}</span>
                      <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Anônimo</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTransferOwnership(member.identifier, member.phoneNumber)}
                    className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all active:scale-90"
                  >
                    <ArrowLeftRight size={18} strokeWidth={3} />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-neutral-400 gap-4">
                <Users size={48} />
                <p className="font-bold uppercase tracking-widest text-[10px] italic">Apenas você no canal</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
              <div className="flex items-center gap-2 text-red-500">
                <ShieldAlert size={18} strokeWidth={2.5} />
                <span className="text-xs font-black uppercase tracking-widest italic font-bold">Atenção Crítica</span>
              </div>
              <p className="text-[11px] font-medium text-neutral-400 leading-relaxed">
                A exclusão do canal é permanente e todos os dados serão criptografados para sempre. Digite o identificador abaixo para confirmar.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1 italic">
                Digite: <span className="text-white">"{activeDarkChat.identifier}"</span>
              </p>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-red-500 transition-colors" size={20} />
                <input
                  className="w-full h-14 pl-12 pr-4 bg-black border border-neutral-800 rounded-2xl text-sm font-bold text-white placeholder:text-neutral-700 focus:ring-1 focus:ring-red-500/50 transition-all"
                  placeholder="Confirme o identificador..."
                  value={channelValue}
                  onChange={(e) => setChannelValue(e.currentTarget.value)}
                />
              </div>
            </div>

            <button
              disabled={!canDelete}
              onClick={handleDeleteChannel}
              className={cn(
                "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3",
                canDelete
                  ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              )}
            >
              <Trash2 size={20} strokeWidth={3} />
              Excluir Canal
            </button>
          </div>
        )}
      </div>
    </Modal2>
  );
};
