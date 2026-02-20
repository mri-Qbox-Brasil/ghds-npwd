import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { Contact } from '@typings/contact';
import { Location } from '@typings/messages';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import StyledMessage, { AudioMessage } from './StyledMessage';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import fetchNui from '../../../../utils/fetchNui';
import { Globe, MoreVertical, FileText, Play, Pause } from 'lucide-react';
import { NoteItem } from '@typings/notes';
import qs from 'qs';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

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
    <StyledMessage>
      <Box>
        <Avatar src={embed?.avatar} />
        <Typography>{embed?.display}</Typography>
        <Typography>{embed?.number}</Typography>
      </Box>
      {showAddButton && (
        <Box pl={1}>
          <Button fullWidth variant="contained" color="primary" onClick={handleAddContact}>
            {t('GENERIC.ADD')}
          </Button>
        </Box>
      )}
      {isMine && (
        <IconButton color="primary" onClick={openMenu}>
          <MoreVertical />
        </IconButton>
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
    <StyledMessage>
      <Box>
        <Typography>{embed?.title}</Typography>
        <Typography>{embed?.content.substring(0, 8) + ' ...'}</Typography>
      </Box>
      <Box>
        <Tooltip title={t('MESSAGES.NOTE_TOOLTIP')}>
          <IconButton color="primary" onClick={handleViewNote}>
            <FileText />
          </IconButton>
        </Tooltip>
        {isMine && (
          <IconButton color="primary" onClick={openMenu}>
            <MoreVertical />
          </IconButton>
        )}
      </Box>
    </StyledMessage>
  );
};

const LocationEmbed = ({
  isMine,
  embed,
  message,
  openMenu,
}: {
  embed: Location;
  isMine: boolean;
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
    <StyledMessage>
      <Box>
        <Typography>{message ?? t('MESSAGES.LOCATION_MESSAGE')}</Typography>
      </Box>
      <Box>
        <Tooltip title={t('MESSAGES.LOCATION_TOOLTIP')}>
          <IconButton color="primary" onClick={handleSetWaypoint}>
            <Globe />
          </IconButton>
        </Tooltip>
        {isMine && (
          <IconButton color="primary" onClick={openMenu}>
            <MoreVertical />
          </IconButton>
        )}
      </Box>
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
    <AudioMessage>
      <Box display="flex" alignItems="center">
        <IconButton onClick={playing ? pause : play}>
          {playing ? (
            <Pause className="text-[#232323]" />
          ) : (
            <Play className="text-[#232323]" />
          )}
        </IconButton>
        <Box sx={{ width: '60%' }}>
          {!calculateProgress && playing ? (
            <LinearProgress />
          ) : (
            <LinearProgress variant="determinate" value={calculateProgress} />
          )}
        </Box>
        {isMine && (
          <IconButton color="white" onClick={openMenu}>
            <MoreVertical />
          </IconButton>
        )}
      </Box>
      <Box pl={1}>
        <Typography>{dayjs.duration(currentTime * 1000).format('mm:ss')}</Typography>
      </Box>
    </AudioMessage>
  );
};

export default MessageEmbed;
