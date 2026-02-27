import React, { useState } from 'react';
import { Modal2 } from '@ui/components/Modal';
import { useTranslation } from 'react-i18next';
import { useDarkchatAPI } from '@apps/darkchat/hooks/useDarkchatAPI';
import { useHistory } from 'react-router-dom';
import { useActiveDarkchatValue, useDarkchatMembersValue } from '@apps/darkchat/state/state';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { ArrowLeftRight, Trash2, Users, Shield, X, Hash } from 'lucide-react';
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
    <Modal2 visible={open} handleClose={closeModal} className="p-0 overflow-hidden bg-[#313338] rounded-[4px] shadow-2xl border border-[#1E1F22]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#1E1F22]">
        <h2 className="text-[16px] font-bold text-white">Configurações do Canal</h2>
        <button onClick={closeModal} className="text-[#80848E] hover:text-white transition-colors p-0.5">
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E1F22]">
        <button
          onClick={() => setActiveTab('members')}
          className={cn(
            "flex-1 py-2.5 text-[13px] font-medium transition-all border-b-2",
            activeTab === 'members'
              ? "text-white border-[#5865F2]"
              : "text-[#80848E] border-transparent hover:text-[#DBDEE1]"
          )}
        >
          Membros
        </button>
        <button
          onClick={() => setActiveTab('danger')}
          className={cn(
            "flex-1 py-2.5 text-[13px] font-medium transition-all border-b-2",
            activeTab === 'danger'
              ? "text-[#ED4245] border-[#ED4245]"
              : "text-[#80848E] border-transparent hover:text-[#DBDEE1]"
          )}
        >
          Zona de Perigo
        </button>
      </div>

      {/* Content */}
      <div className="p-4 h-[320px] overflow-y-auto scrollbar-hide">
        {activeTab === 'members' ? (
          <div className="space-y-0.5">
            {filteredMembers && filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member.phoneNumber} className="flex items-center justify-between p-2 rounded-[4px] hover:bg-[#35373C] transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center">
                      <Users size={14} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-[#F2F3F5]">#{member.phoneNumber.slice(-4)}</span>
                      <span className="text-[11px] text-[#80848E]">Membro</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTransferOwnership(member.identifier, member.phoneNumber)}
                    className="opacity-0 group-hover:opacity-100 text-[#B5BAC1] hover:text-[#5865F2] transition-all p-1.5"
                    title="Transferir propriedade"
                  >
                    <ArrowLeftRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#80848E] gap-2 py-8">
                <Users size={36} strokeWidth={1.5} />
                <p className="text-[14px] font-medium">Apenas você no canal</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Warning */}
            <div className="p-3 rounded-[4px] bg-[#ED4245]/10 border border-[#ED4245]/20">
              <p className="text-[13px] font-normal text-[#DBDEE1] leading-relaxed">
                <span className="font-semibold text-[#ED4245]">Cuidado!</span> A exclusão do canal é permanente e irreversível. Todos os dados serão perdidos.
              </p>
            </div>

            {/* Confirm Input */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#B5BAC1] uppercase tracking-wide">
                Digite "{activeDarkChat.identifier}" para confirmar
              </label>
              <input
                className="w-full h-10 px-3 bg-[#1E1F22] border-none rounded-[3px] text-[15px] font-normal text-[#DBDEE1] placeholder:text-[#6D6F78] focus:ring-2 focus:ring-[#ED4245] transition-all"
                placeholder="Confirme o identificador..."
                value={channelValue}
                onChange={(e) => setChannelValue(e.currentTarget.value)}
              />
            </div>

            {/* Delete Button */}
            <button
              disabled={!canDelete}
              onClick={handleDeleteChannel}
              className={cn(
                "w-full py-2.5 rounded-[3px] text-[14px] font-medium transition-all flex items-center justify-center gap-2",
                canDelete
                  ? "bg-[#ED4245] text-white hover:bg-[#C03537] active:bg-[#A12D2F]"
                  : "bg-[#ED4245]/30 text-white/30 cursor-not-allowed"
              )}
            >
              <Trash2 size={16} strokeWidth={2.5} />
              Excluir Canal
            </button>
          </div>
        )}
      </div>
    </Modal2>
  );
};
