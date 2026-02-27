import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ShieldAlert } from 'lucide-react';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { cn } from '@utils/cn';

function ReportButton({ handleClose, tweetId, isReported }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { addAlert } = useSnackbar();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReported || loading) return;

    setLoading(true);

    fetchNui<ServerPromiseResp<void>>(TwitterEvents.REPORT, { tweetId }).then((resp) => {
      setLoading(false);
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('TWITTER.FEEDBACK.REPORT_TWEET_FAILED') as unknown as string,
          type: 'error',
        });
      }

      handleClose();

      addAlert({
        message: t('TWITTER.FEEDBACK.REPORT_TWEET_SUCCESS') as unknown as string,
        type: 'success',
      });
    });
  };

  if (isReported) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-sm text-blue-500 font-medium cursor-default">
        <Check size={18} />
        <span>{t('TWITTER.REPORTED') as unknown as string}</span>
      </div>
    );
  }

  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left",
        loading && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <ShieldAlert size={18} />
      )}
      <span>{t('TWITTER.REPORT') as unknown as string}</span>
    </button>
  );
}

export default ReportButton;
