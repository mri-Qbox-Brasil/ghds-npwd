import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhone } from '@os/phone/hooks/usePhone';
import ReportButton from '../buttons/ReportButton';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTwitterActions } from '../../hooks/useTwitterActions';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { MoreHorizontal, Trash2, ShieldAlert } from 'lucide-react';
import { ContextMenu, IContextMenuOption } from '@ui/components/ContextMenu';

export const ShowMore = ({ id, isReported, isMine }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const { deleteTweet } = useTwitterActions();

  if (!ResourceConfig) return null;

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleDeleteTweet = () => {
    fetchNui<ServerPromiseResp<void>>(TwitterEvents.DELETE_TWEET, { tweetId: id }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('TWITTER.FEEDBACK.DELETE_TWEET_FAILED') as string,
          type: 'error',
        });
      }

      deleteTweet(id);
      setShowMenu(false);
    });
  };

  const allowedToDelete = ResourceConfig.twitter.allowDeleteTweets && isMine;
  const allowedToReport = ResourceConfig.twitter.allowReportTweets && !isMine;

  if (!allowedToDelete && !allowedToReport) return null;

  const menuOptions: IContextMenuOption[] = [];

  if (allowedToDelete) {
    menuOptions.push({
      label: t('GENERIC.DELETE') as string,
      icon: <Trash2 size={18} className="text-red-500" />,
      onClick: handleDeleteTweet
    });
  }

  if (allowedToReport && !isReported) {
    menuOptions.push({
      label: t('TWITTER.REPORT') as string,
      icon: <ShieldAlert size={18} className="text-orange-500" />,
      onClick: () => {
        // ReportButton handle its own logic usually, but here we can trigger it 
        // or just implement a simple fetch here.
        fetchNui(TwitterEvents.REPORT, { tweetId: id });
        addAlert({ message: t('TWITTER.FEEDBACK.REPORT_TWEET_SUCCESS') as string, type: 'success' });
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpenMenu}
        className="p-2 rounded-xl text-neutral-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-neutral-800 transition-all active:scale-95"
      >
        <MoreHorizontal size={20} />
      </button>

      <ContextMenu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        settingLabel="Opções do Tweet"
        options={menuOptions}
      />
    </div>
  );
};

export default ShowMore;
