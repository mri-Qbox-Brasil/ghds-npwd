import { useState } from 'react';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { Repeat } from 'lucide-react';
import { cn } from '@utils/cn';

interface IProps {
  tweetId: number;
  retweetId: string;
  isRetweet: boolean | number;
}

const LOADING_TIME = 1000;

export const RetweetButton = ({ tweetId, isRetweet, retweetId }: IProps) => {
  const [retweeted, setRetweeted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (retweeted || loading) return;

    const idToRetweet = isRetweet ? retweetId : tweetId;
    setLoading(true);

    fetchNui<ServerPromiseResp<void>>(TwitterEvents.RETWEET, { tweetId: idToRetweet }).then(
      (resp) => {
        if (resp.status !== 'ok') {
          setLoading(false);
          return addAlert({
            message: t(resp.errorMsg as string) as string,
            type: 'error',
          });
        }

        window.setTimeout(() => {
          setRetweeted(true);
          setLoading(false);
        }, LOADING_TIME);
      },
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || retweeted}
      className={cn(
        "flex items-center gap-1.5 p-2 rounded-xl transition-all",
        retweeted
          ? "text-green-500 bg-green-50 dark:bg-green-500/10 shadow-sm shadow-green-500/5 rotate-180 scale-110"
          : "text-neutral-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 active:scale-90"
      )}
    >
      <Repeat
        size={18}
        strokeWidth={retweeted ? 3 : 2}
        className={cn(
          "transition-transform duration-700",
          loading && "animate-spin"
        )}
      />
    </button>
  )
};

export default RetweetButton;
