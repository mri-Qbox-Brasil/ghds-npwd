import { useSetRecoilState } from 'recoil';
import { toggleKeys } from '@ui/components';
import { twitterState } from '../../hooks/state';
import { MessageCircle } from 'lucide-react';

export const ReplyButton = ({ profile_name }) => {
  const setModalVisible = useSetRecoilState(twitterState.showCreateTweetModal);
  const setMessage = useSetRecoilState(twitterState.modalMessage);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessage(`@${profile_name} `);
    setModalVisible(true);
  };

  return (
    <button
      onClick={handleClick}
      onMouseUp={() => {
        toggleKeys(false);
      }}
      className="flex items-center gap-1.5 p-2 rounded-xl text-neutral-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all active:scale-90 group"
    >
      <MessageCircle size={18} />
    </button>
  );
};

export default ReplyButton;
