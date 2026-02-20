import React from 'react';
import { Flex } from '@ui/components/ui/flex';
import { Typography } from '@ui/components/ui/typography';
import { useContactActions } from '../../../apps/contacts/hooks/useContactActions';
import { useCall } from '../hooks/useCall';
import { useTranslation } from 'react-i18next';

const CallContactContainer = () => {
  const [t] = useTranslation();
  const { call } = useCall();

  const { getDisplayByNumber, getPictureByNumber } = useContactActions();

  const getDisplayOrNumber = () =>
    call.isTransmitter
      ? getDisplayByNumber(call?.receiver)
      : !call.isTransmitter && call.isAnonymous
        ? 'Anonymous'
        : getDisplayByNumber(call?.transmitter);

  return (
    <Flex align="center">
      <Flex direction="col" className="flex-grow overflow-hidden text-ellipsis">
        <Typography variant="body1">
          {call.isTransmitter
            ? t('CALLS.MESSAGES.OUTGOING').toUpperCase()
            : t('CALLS.MESSAGES.INCOMING').toUpperCase()}
        </Typography>
        <Typography variant="h4">{getDisplayOrNumber()}</Typography>
      </Flex>
      <img
        className="ml-2 h-[80px] w-[80px] rounded-full object-cover"
        alt={getDisplayOrNumber()}
        src={
          call.isTransmitter
            ? getPictureByNumber(call.receiver)
            : !call.isTransmitter && call.isAnonymous
              ? 'https://i.fivemanage.com/images/3ClWwmpwkFhL.png'
              : getPictureByNumber(call?.transmitter)
        }
      />
    </Flex>
  );
};

export default CallContactContainer;
