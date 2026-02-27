import React, { useState } from 'react';
import { Phone, PhoneOff, MicOff, Mic } from 'lucide-react';
import { useCall } from '../hooks/useCall';
import { useCallModal } from '../hooks/useCallModal';
import { StatusIconButton } from '@ui/components/StatusIconButton';
import { Flex } from '@ui/components/ui/flex';
import { useHistory } from 'react-router-dom';

const iconClass = "text-white [filter:drop-shadow(0_0.5rem_3rem_rgba(0,0,0,0.3))]";
const iconWrapperClass = "h-[60px] w-[60px]";
const smallIconWrapperClass = "h-[40px] w-[40px]";

export const CallControls = ({ isSmall }: { isSmall?: boolean }) => {
  const history = useHistory();
  const { setModal } = useCallModal();
  const { call, endCall, acceptCall, rejectCall, muteCall } = useCall();
  const [muted, setMuted] = useState(false);

  const handleAcceptCall = (e) => {
    e.stopPropagation();
    history.push('/call');
    acceptCall();
  };

  const handleRejectCall = (e) => {
    e.stopPropagation();
    setModal(false);
    rejectCall();
  };

  const handleEndCall = (e) => {
    e.stopPropagation();
    setModal(false);
    endCall();
  };

  // We display only the hang up if the call is accepted
  // or we are the one calling
  if (call?.is_accepted || call?.isTransmitter)
    return (
      <Flex
        justify={call?.is_accepted ? 'between' : 'center'}
        className="px-4 my-4"
      >
        <StatusIconButton
          color="error"
          size={isSmall ? 'small' : 'medium'}
          onClick={handleEndCall}
          className={isSmall ? smallIconWrapperClass : iconWrapperClass}
        >
          <PhoneOff className={iconClass} />
        </StatusIconButton>
        {call?.is_accepted && (
          <StatusIconButton
            color={muted ? 'error' : 'success'}
            size={isSmall ? 'small' : 'medium'}
            onClick={() => {
              setMuted((state) => !state);
              muteCall(!muted);
            }}
            className={isSmall ? smallIconWrapperClass : iconWrapperClass}
          >
            {muted ? (
              <MicOff className={iconClass} />
            ) : (
              <Mic className={iconClass} />
            )}
          </StatusIconButton>
        )}
      </Flex>
    );

  return (
    <Flex align="center" justify="between" className="px-4 my-4">
      <StatusIconButton
        color="error"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleRejectCall}
        className={isSmall ? smallIconWrapperClass : iconWrapperClass}
      >
        <PhoneOff className={iconClass} />
      </StatusIconButton>
      <StatusIconButton
        color="success"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleAcceptCall}
        className={isSmall ? smallIconWrapperClass : iconWrapperClass}
      >
        <Phone className={iconClass} />
      </StatusIconButton>
    </Flex>
  );
};
