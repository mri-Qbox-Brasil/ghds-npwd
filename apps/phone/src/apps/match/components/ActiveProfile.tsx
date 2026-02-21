import React, { useState, useRef } from 'react';
import { X, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormattedProfile } from '@typings/match';
import Draggable from './Draggable';
import StatusDisplay from './StatusDisplay';
import Profile from './profile/Profile';
import { Tooltip } from '@ui/components/Tooltip';
import { cn } from '@utils/cn';

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
    <div className="relative h-full w-full flex flex-col p-4 animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
      <div className="flex-1 relative mb-24">
        <Draggable id="active-profile" onDrag={onDrag} onDrop={handleSwipe}>
          <div className="h-full w-full relative">
            {/* Status Overlays */}
            <StatusDisplay
              className="absolute z-20 top-12 left-8 -rotate-12 text-green-500 border-green-500"
              text={t('MATCH.MESSAGES.LIKED') as string}
              visible={isLiked}
            />
            <StatusDisplay
              className="absolute z-20 top-12 right-8 rotate-12 text-red-500 border-red-500"
              text={t('MATCH.MESSAGES.NOPE') as string}
              visible={notLiked}
            />

            <Profile profile={profile} />
          </div>
        </Draggable>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-6 left-0 w-full flex items-center justify-center gap-8 px-8 z-30">
        <Tooltip title={t('MATCH.DISLIKE') as string} aria-label="dislike">
          <button
            onClick={handleNope}
            className="h-16 w-16 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 text-red-500 shadow-xl border border-neutral-100 dark:border-neutral-700 transition-all active:scale-90 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <X size={32} strokeWidth={2.5} />
          </button>
        </Tooltip>

        <Tooltip title={t('MATCH.LIKE') as string} aria-label="like">
          <button
            onClick={handleLike}
            className="h-20 w-20 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-2xl shadow-pink-500/40 transition-all active:scale-90 hover:bg-pink-600 group"
          >
            <Flame size={40} className="group-hover:animate-pulse" fill="currentColor" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ActiveProfile;
