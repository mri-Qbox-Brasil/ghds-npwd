import React, { useState } from 'react';
import { useChannelsValue } from '../../state/state';
import { ChannelItem } from '../ui/ChannelItem';
import { List } from '@ui/components/List';
import { Plus, Hash, Ghost } from 'lucide-react';
import { NewChannelModal } from '../ui/NewChannelModal';

const ChatList: React.FC = () => {
  const channels = useChannelsValue();
  const [modal, setModal] = useState<boolean>(false);

  const toggleModal = () => {
    setModal((curVal) => !curVal);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 relative overflow-hidden">
      <NewChannelModal open={modal} closeModal={toggleModal} />

      {/* Background Graphic Effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none flex items-center justify-center scale-150 rotate-12">
        <Hash size={400} strokeWidth={1} />
      </div>

      <header className="px-6 py-6 border-b border-neutral-900 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Ghost size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Canais Dark</h2>
        </div>
        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{channels.length} Ativos</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 z-10 scrollbar-hide">
        {channels.length > 0 ? (
          <div className="space-y-1">
            {channels.map((channel) => (
              <ChannelItem key={channel.id} {...channel} />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-20 text-neutral-400 gap-4">
            <Ghost size={64} />
            <p className="font-bold uppercase tracking-widest text-xs italic">Nenhum canal encontrado</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-10 right-8 z-20">
        <button
          onClick={toggleModal}
          className="h-16 w-16 bg-white text-black rounded-3xl shadow-2xl shadow-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default ChatList;
