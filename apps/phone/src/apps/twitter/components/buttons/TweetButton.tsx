import { Edit2 } from 'lucide-react';
import { toggleKeys } from '@ui/components';
import { cn } from '@utils/cn';

export function TweetButton({ openModal }) {
  return (
    <div className="fixed bottom-20 right-6 z-40">
      <button
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full text-white shadow-2xl shadow-sky-500/40',
          'bg-sky-500 hover:bg-sky-600 transition-all active:scale-90 focus:outline-none focus:ring-4 focus:ring-sky-500/20',
        )}
        onClick={openModal}
        onMouseUp={() => {
          toggleKeys(false);
        }}
      >
        <Edit2 size={28} />
      </button>
    </div>
  );
}

export default TweetButton;
