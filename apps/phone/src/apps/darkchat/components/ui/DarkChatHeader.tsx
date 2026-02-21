import React, { useState } from 'react';
import { useApp } from '@os/apps/hooks/useApps';
import { ArrowLeft, Edit, Check, Shield, LogOut, Hash } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { useActiveDarkchatValue } from '../../state/state';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useModal } from '@apps/darkchat/hooks/useModal';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

const DarkChatHeader: React.FC = () => {
  const activeConversation = useActiveDarkchatValue();
  const { setOwnerModal } = useModal();
  const { leaveChannel, updateChannelLabel } = useDarkchatAPI();
  const { goBack } = useHistory();
  const myPhoneNumber = useMyPhoneNumber();
  const [t] = useTranslation();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(activeConversation.label);

  const handleLeaveChannel = () => {
    leaveChannel(activeConversation.id);
  };

  const openOwnerModal = () => {
    setOwnerModal(true);
  };

  const handleUpdateLabel = () => {
    setIsEditing(false);
    if (label === activeConversation.label) return setLabel(activeConversation.label);
    if (!label.trim()) return setLabel(activeConversation.label);

    updateChannelLabel({
      channelId: activeConversation.id,
      label,
    });
  };

  const isOwner = myPhoneNumber === activeConversation.owner;

  return (
    <header className="h-[72px] bg-neutral-950 border-b border-neutral-900 px-4 flex items-center justify-between z-50 overflow-hidden">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          onClick={goBack}
          className="p-2.5 rounded-2xl bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-90"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-3 min-w-0 truncate">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Hash size={20} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col min-w-0 pr-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  className="bg-neutral-900 border-none rounded-lg px-2 py-1 text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500 min-w-0"
                  value={label}
                  onChange={(e) => setLabel(e.currentTarget.value)}
                  onBlur={handleUpdateLabel}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateLabel()}
                />
                <button onClick={handleUpdateLabel} className="text-emerald-500 p-1">
                  <Check size={18} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-lg font-black text-white truncate tracking-tighter uppercase italic">{label}</h2>
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-neutral-600 hover:text-indigo-400 transition-colors"
                  >
                    <Edit size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )}
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest leading-none mt-0.5">Anonymous Channel</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isOwner ? (
          <button
            onClick={openOwnerModal}
            className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all active:scale-90"
          >
            <Shield size={22} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={handleLeaveChannel}
            className="px-4 py-2.5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all active:scale-90 flex items-center gap-2"
          >
            <LogOut size={14} strokeWidth={3} />
            {t('DARKCHAT.LEAVE')}
          </button>
        )}
      </div>
    </header>
  );
};

export default DarkChatHeader;
