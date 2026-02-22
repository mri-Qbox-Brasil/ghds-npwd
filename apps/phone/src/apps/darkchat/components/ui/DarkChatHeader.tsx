import React, { useState } from 'react';
import { ChevronLeft, Pencil, Check, Shield, LogOut, Hash, Users } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { useActiveDarkchatValue, useDarkchatMembersValue } from '../../state/state';
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
  const channelMembers = useDarkchatMembersValue();
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
    <header className="shrink-0 pt-[60px] pb-3 px-4 bg-[#313338] border-b border-[#1E1F22] z-50">
      <div className="flex items-center justify-between">
        {/* Left — Back + Channel Name */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <button
            onClick={goBack}
            className="text-[#B5BAC1] active:text-white transition-colors p-0.5 -ml-1 shrink-0"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>

          <Hash size={18} strokeWidth={2.5} className="text-[#80848E] shrink-0" />

          {isEditing ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <input
                autoFocus
                className="bg-[#1E1F22] border-none rounded-[3px] px-2 py-0.5 text-[15px] font-semibold text-white focus:ring-1 focus:ring-[#5865F2] min-w-0 flex-1"
                value={label}
                onChange={(e) => setLabel(e.currentTarget.value)}
                onBlur={handleUpdateLabel}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateLabel()}
              />
              <button onClick={handleUpdateLabel} className="text-[#5865F2] p-0.5 shrink-0">
                <Check size={16} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[15px] font-semibold text-white truncate">{label}</span>
              {isOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[#80848E] hover:text-white transition-colors shrink-0"
                >
                  <Pencil size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isOwner ? (
            <button
              onClick={openOwnerModal}
              className="text-[#B5BAC1] hover:text-white transition-colors p-1"
            >
              <Shield size={20} strokeWidth={2} />
            </button>
          ) : (
            <button
              onClick={handleLeaveChannel}
              className="text-[#ED4245] hover:text-[#FF6668] transition-colors p-1"
              title={t('DARKCHAT.LEAVE') as string}
            >
              <LogOut size={20} strokeWidth={2} />
            </button>
          )}
          <div className="text-[#B5BAC1] p-1">
            <Users size={20} strokeWidth={2} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DarkChatHeader;
