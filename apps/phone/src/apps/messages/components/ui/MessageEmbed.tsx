import React from 'react';
import { Contact } from '@typings/contact';
import { Location } from '@typings/messages';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import StyledMessage, { AudioMessage } from './StyledMessage';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import fetchNui from '../../../../utils/fetchNui';
import { Globe, MoreVertical, FileText, Play, Pause, UserPlus, Music } from 'lucide-react';
import { NoteItem } from '@typings/notes';
import qs from 'qs';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import { MessageEvents } from '@typings/messages';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { cn } from '@utils/cn';

dayjs.extend(duration);

interface MessageEmbedProps {
  type: string;
  embed: any;
  isMine: boolean;
  message: string;
  openMenu: () => void;
}

type MessageEmbedType = {
  [key: string]: JSX.Element;
};

const MessageEmbed: React.FC<MessageEmbedProps> = ({ type, embed, isMine, message, openMenu }) => {
  const embedType: MessageEmbedType = {
    contact: <ContactEmbed embed={embed} isMine={isMine} openMenu={openMenu} />,
    location: <LocationEmbed embed={embed} isMine={isMine} message={message} openMenu={openMenu} />,
    note: <NoteEmbed embed={embed} isMine={isMine} openMenu={openMenu} />,
    audio: <AudioEmbed embed={embed} isMine={isMine} openMenu={openMenu} />,
  };

  return <>{embedType[type]}</>;
};

const ContactEmbed = ({
  isMine,
  embed,
  openMenu,
}: {
  isMine: boolean;
  embed: Contact;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const { getContactByNumber } = useContactActions();

  const showAddButton = !isMine && !getContactByNumber(embed?.number);

  const handleAddContact = () => {
    const referal = encodeURIComponent(pathname);
    history.push(`/contacts/-1?addNumber=${embed.number}&name=${embed.display}&referal=${referal}`);
  };

  return (
    <StyledMessage className="flex-col items-stretch gap-3 min-w-[180px]">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 border-2 border-white dark:border-neutral-700 shadow-sm">
          {embed?.avatar ? (
            <img src={embed.avatar} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-neutral-400">
              <UserPlus size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter truncate leading-tight">
            {embed?.display}
          </p>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest truncate">
            {embed?.number}
          </p>
        </div>
        {isMine && (
          <button onClick={openMenu} className="p-1.5 rounded-lg text-neutral-400 hover:text-primary transition-all active:scale-90">
            <MoreVertical size={16} />
          </button>
        )}
      </div>
      {showAddButton && (
        <button
          onClick={handleAddContact}
          className="w-full h-9 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          {t('GENERIC.ADD') as string}
        </button>
      )}
    </StyledMessage>
  );
};

const NoteEmbed = ({
  isMine,
  embed,
  openMenu,
}: {
  isMine: boolean;
  embed: NoteItem;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();

  const handleViewNote = () => {
    const queryStr = qs.stringify({
      title: embed?.title,
      content: embed?.content,
    });
    const referal = encodeURIComponent(pathname);
    history.push(`/notes/?${queryStr}&referal=${referal}`);
  };

  return (
    <StyledMessage className="gap-3 min-w-[200px]">
      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
        <FileText size={20} />
      </div>
      <div className="flex-1 overflow-hidden" onClick={handleViewNote}>
        <p className="text-sm font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter truncate leading-tight">
          {embed?.title}
        </p>
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest truncate">
          {embed?.content.substring(0, 15) + '...'}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {isMine && (
          <button onClick={openMenu} className="p-1.5 rounded-lg text-neutral-400 hover:text-primary transition-all active:scale-90">
            <MoreVertical size={16} />
          </button>
        )}
      </div>
    </StyledMessage>
  );
};

const LocationEmbed = ({
  isMine,
  embed,
  message,
  openMenu,
}: {
  isMine: boolean;
  embed: Location;
  message: string;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();

  const handleSetWaypoint = () => {
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: embed.coords,
    });
  };

  return (
    <StyledMessage className="gap-3 min-w-[200px]">
      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
        <Globe size={20} />
      </div>
      <div className="flex-1 overflow-hidden" onClick={handleSetWaypoint}>
        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase italic tracking-tighter leading-tight">
          {(message ?? t('MESSAGES.LOCATION_MESSAGE')) as string}
        </p>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">
          Toque para marcar
        </p>
      </div>
      {isMine && (
        <button onClick={openMenu} className="p-1.5 rounded-lg text-neutral-400 hover:text-primary transition-all active:scale-90">
          <MoreVertical size={16} />
        </button>
      )}
    </StyledMessage>
  );
};

const AudioEmbed = ({
  isMine,
  embed,
  openMenu,
}: {
  isMine: boolean;
  embed: { url: string };
  openMenu: () => void;
}) => {
  const { play, pause, playing, currentTime, duration } = useAudioPlayer(embed.url);

  const calculateProgress =
    isNaN(duration) || duration == Infinity
      ? 0
      : (Math.trunc(currentTime) / Math.trunc(duration)) * 100;

  return (
    <AudioMessage className="bg-neutral-800 dark:bg-neutral-900 border border-white/5 shadow-xl">
      <div className="flex items-center gap-3 w-full p-1">
        <button
          onClick={playing ? pause : play}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>

        <div className="flex-1 space-y-1">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full bg-primary transition-all duration-300",
                !calculateProgress && playing ? "animate-pulse" : ""
              )}
              style={{ width: `${calculateProgress || (playing ? 50 : 0)}%` }}
            />
          </div>
          <div className="flex justify-between items-center px-0.5">
            <span className="text-[10px] font-black text-neutral-300 uppercase tracking-tighter tabular-nums">
              {dayjs.duration(currentTime * 1000).format('mm:ss')}
            </span>
            <Music size={10} className="text-neutral-500" />
          </div>
        </div>

        {isMine && (
          <button onClick={openMenu} className="p-2 rounded-lg text-neutral-500 hover:text-white transition-all active:scale-90">
            <MoreVertical size={16} />
          </button>
        )}
      </div>
    </AudioMessage>
  );
};

export default MessageEmbed;
