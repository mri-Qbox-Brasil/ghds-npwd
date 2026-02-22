import React from 'react';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';

const MessageGroupModal = () => {
  const { phoneNumber } = useQueryParams<{ phoneNumber?: string }>();

  return (
    <div className="absolute inset-0 z-50 flex flex-col w-full h-full bg-white dark:bg-black animate-in slide-in-from-right duration-300">
      <React.Suspense fallback={<LoadingSpinner />}>
        <NewMessageGroupForm phoneNumber={phoneNumber} />
      </React.Suspense>
    </div>
  );
};

export default MessageGroupModal;
