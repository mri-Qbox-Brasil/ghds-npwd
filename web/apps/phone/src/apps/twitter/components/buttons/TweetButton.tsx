import { Edit2 } from 'lucide-react';
import { toggleKeys } from '@ui/components';
import { cn } from '@utils/cn';

export function TweetButton({ openModal }) {
  return (
    <div className="absolute bottom-[90px] right-4 z-40">
      <button
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-sky-500/30',
          'bg-sky-500 active:bg-sky-600 transition-all active:scale-90',
        )}
        onClick={openModal}
        onMouseUp={() => {
          toggleKeys(false);
        }}
      >
        <Edit2 size={22} />
      </button>
    </div>
  );
}

export default TweetButton;
