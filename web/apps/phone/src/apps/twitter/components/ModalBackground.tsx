import { memo } from 'react';
import { useModal } from '../hooks/useModal';
import Backdrop from '@ui/components/Backdrop';

const ModalBackground = () => {
  const { modalVisible } = useModal();

  if (!modalVisible) return null;

  return <Backdrop />;
};

export default memo(ModalBackground);
