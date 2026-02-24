import React, { useState, useRef } from 'react';
import { X, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormattedProfile } from '@typings/match';
import Draggable from './Draggable';
import StatusDisplay from './StatusDisplay';
import Profile from './profile/Profile';

interface IProps {
  profile: FormattedProfile;
  onSwipe: (id: number, liked: boolean) => void;
}

const DECISION_THRESHOLD_X_px = 150;

const ActiveProfile = ({ profile, onSwipe }: IProps) => {
  const [t] = useTranslation();
  const [status, setStatus] = useState<boolean | null>(null);
  const statusRef = useRef<boolean | null>(null);
  const idRef = useRef<number | null>(null);

  statusRef.current = status;
  idRef.current = profile.id;

  function onDrag(deltaX: number): void {
    const hasDecision = status !== null;
    if (!hasDecision && deltaX > DECISION_THRESHOLD_X_px) {
      setStatus(true);
    } else if (!hasDecision && deltaX < -DECISION_THRESHOLD_X_px) {
      setStatus(false);
    } else if (deltaX > -DECISION_THRESHOLD_X_px && deltaX < DECISION_THRESHOLD_X_px) {
      setStatus(null);
    }
  }

  const handleSwipe = () => {
    if (statusRef.current === null) return;
    onSwipe(idRef.current as number, statusRef.current);
    setStatus(null);
  };

  const handleLike = () => {
    onSwipe(idRef.current as number, true);
    setStatus(null);
  };

  const handleNope = () => {
    onSwipe(idRef.current as number, false);
    setStatus(null);
  };

  const isLiked = status === true;
  const notLiked = status === false;

  return (
    <div className="flex flex-col h-full w-full p-3 pb-0">
      {/* Card area */}
      <div className="flex-1 min-h-0 relative">
        <Draggable id="active-profile" onDrag={onDrag} onDrop={handleSwipe}>
          <div className="h-full w-full relative">
            <StatusDisplay
              className="absolute z-20 top-8 left-6 -rotate-12 text-green-500 border-green-500"
              text={t('MATCH.MESSAGES.LIKED') as string}
              visible={isLiked}
            />
            <StatusDisplay
              className="absolute z-20 top-8 right-6 rotate-12 text-red-500 border-red-500"
              text={t('MATCH.MESSAGES.NOPE') as string}
              visible={notLiked}
            />
            <Profile profile={profile} />
          </div>
        </Draggable>
      </div>

      {/* Action Buttons — inline, não absolute */}
      <div className="flex items-center justify-center gap-6 py-3 pb-24 shrink-0">
        <button
          onClick={handleNope}
          className="h-14 w-14 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 text-red-500 shadow-lg border border-neutral-200 dark:border-neutral-700 transition-all active:scale-90"
        >
          <X size={28} strokeWidth={2.5} />
        </button>

        <button
          onClick={handleLike}
          className="h-16 w-16 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-500/30 transition-all active:scale-90"
        >
          <Heart size={30} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default ActiveProfile;
