import { useState } from 'react';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTwitterActions } from '@apps/twitter/hooks/useTwitterActions';
import { Heart } from 'lucide-react';
import { cn } from '@utils/cn';

function LikeButton({ tweetId, isLiked, likes }) {
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const { localToggleLike } = useTwitterActions();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    fetchNui<ServerPromiseResp<void>>(TwitterEvents.TOGGLE_LIKE, { tweetId }).then((resp) => {
      setLoading(false);
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('TWITTER.FEEDBACK.LIKE_TWEET_FAILED') as string,
          type: 'error',
        });
      }

      setLiked(!liked);
      localToggleLike(tweetId);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-1.5 p-2 rounded-xl transition-all group",
        liked
          ? "text-red-500 bg-red-50 dark:bg-red-500/10 shadow-sm shadow-red-500/5 rotate-0 scale-100"
          : "text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-90"
      )}
    >
      <div className="relative">
        {liked && <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping scale-150 pointer-events-none" />}
        <Heart
          size={18}
          fill={liked ? "currentColor" : "none"}
          className={cn(
            "transition-transform duration-300",
            liked && "scale-110",
            loading && "animate-pulse"
          )}
        />
      </div>
      {likes > 0 && <span className="text-xs font-bold tracking-tight">{likes}</span>}
    </button>
  );
}

export default LikeButton;
