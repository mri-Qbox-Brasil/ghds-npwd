import React, { useState } from 'react';
import { useChannelsValue } from '../../state/state';
import { ChannelItem } from '../ui/ChannelItem';
import { Plus, Search, Hash, Ghost, LogIn, ChevronDown } from 'lucide-react';
import { NewChannelModal } from '../ui/NewChannelModal';

const ChatList: React.FC = () => {
  const channels = useChannelsValue();
  const [modal, setModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleModal = () => {
    setModal((curVal) => !curVal);
  };

  const filteredChannels = channels.filter((channel) =>
    (channel.label ?? channel.identifier).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasChannels = channels.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#2B2D31] relative overflow-hidden">
      <NewChannelModal open={modal} closeModal={toggleModal} />

      {/* Discord-style Header */}
      <header className="shrink-0 pt-[60px] h-auto px-4 pb-3 bg-[#2B2D31] border-b border-[#1E1F22] flex items-center">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-[16px] bg-[#5865F2] flex items-center justify-center">
            <Ghost size={18} strokeWidth={2.5} className="text-white" />
          </div>
          <div className="flex items-center gap-1">
            <h1 className="text-[16px] font-bold text-white">Xiscord</h1>
            <ChevronDown size={14} strokeWidth={2.5} className="text-[#80848E]" />
          </div>
        </div>
      </header>

      {hasChannels ? (
        /* ── Has Channels: Show list ── */
        <>
          {/* Search */}
          <div className="px-3 py-2 bg-[#2B2D31]">
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6D6F78]" />
              <input
                type="text"
                className="w-full h-8 pl-8 pr-3 rounded-[4px] bg-[#1E1F22] border-none text-[14px] text-[#DBDEE1] placeholder:text-[#6D6F78] focus:ring-0 transition-all"
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                placeholder="Buscar"
                value={searchTerm}
              />
            </div>
          </div>

          {/* Channel List */}
          <div className="flex-1 overflow-y-auto px-2 pt-2 scrollbar-hide">
            <div className="flex items-center px-2 mb-1">
              <span className="text-[11px] font-bold text-[#80848E] uppercase tracking-wide flex-1">
                Canais de texto — {filteredChannels.length}
              </span>
              <button
                onClick={toggleModal}
                className="text-[#80848E] hover:text-white transition-colors"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>

            {filteredChannels.length > 0 ? (
              <div className="space-y-0.5">
                {filteredChannels.map((channel) => (
                  <ChannelItem key={channel.id} {...channel} />
                ))}
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center text-center text-[#6D6F78] gap-2">
                <Search size={32} strokeWidth={1.5} />
                <p className="text-[14px] font-medium">Nenhum resultado</p>
              </div>
            )}

            {/* Join Channel Card — always visible at bottom */}
            <button
              onClick={toggleModal}
              className="w-full flex items-center gap-2 px-2 py-2 mt-2 rounded-[4px] hover:bg-[#35373C] active:bg-[#3F4147] transition-colors group"
            >
              <Plus size={18} strokeWidth={2} className="text-[#4E5058] group-hover:text-[#DBDEE1] shrink-0 transition-colors" />
              <span className="text-[14px] font-medium text-[#4E5058] group-hover:text-[#DBDEE1] transition-colors">Entrar em um canal</span>
            </button>
          </div>
        </>
      ) : (
        /* ── No Channels: Welcome Screen ── */
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          {/* Big Icon */}
          <div className="h-20 w-20 rounded-full bg-[#5865F2] flex items-center justify-center mb-5 shadow-lg shadow-[#5865F2]/20">
            <Hash size={40} strokeWidth={2.5} className="text-white" />
          </div>

          <h2 className="text-[22px] font-bold text-white mb-2">Bem-vindo ao Xiscord</h2>
          <p className="text-[14px] text-[#B5BAC1] leading-relaxed mb-6 max-w-[260px]">
            Entre em um canal anônimo usando um identificador secreto. Suas mensagens são criptografadas.
          </p>

          {/* Main CTA */}
          <button
            onClick={toggleModal}
            className="w-full max-w-[260px] flex items-center justify-center gap-2 py-3 px-6 bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3C45A5] rounded-[4px] text-white font-medium text-[15px] transition-all active:scale-[0.98] shadow-lg shadow-[#5865F2]/20"
          >
            <LogIn size={18} strokeWidth={2.5} />
            Entrar em um Canal
          </button>

          {/* Hint */}
          <p className="text-[12px] text-[#6D6F78] mt-4 leading-snug max-w-[240px]">
            Se o canal não existir, ele será criado e você será o dono.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
