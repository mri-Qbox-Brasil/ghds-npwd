import { memo, useCallback, useState } from 'react';
import Tweet from './Tweet';
import { Virtuoso } from 'react-virtuoso';
import { FormattedTweet, GetTweet, TwitterEvents } from '@typings/twitter';

import { ServerPromiseResp } from '@typings/common';
import fetchNui from '@utils/fetchNui';
import { processTweet } from '@apps/twitter/utils/tweets';
import { usePhone } from '@os/phone/hooks';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTweetsState } from '@apps/twitter/hooks/state';

export function TweetList({ tweets }: { tweets: FormattedTweet[] }) {
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const TWEET_LIMIT_PER_PAGE = ResourceConfig?.twitter?.resultsLimit || 25;
  const [tweetsData, setTweetsData] = useTweetsState();
  const [hasNextPage, setHasNextPage] = useState(
    tweetsData.length === TWEET_LIMIT_PER_PAGE ? true : false,
  );
  const [page, setPage] = useState(0);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const handleNewPageLoad = useCallback(() => {
    if (isNextPageLoading || !hasNextPage) return;
    setIsNextPageLoading(true);

    const pageId = page + 1;
    fetchNui<ServerPromiseResp<GetTweet[]>>(TwitterEvents.FETCH_TWEETS, { pageId }).then((resp) => {
      if (resp.status !== 'ok') {
        addAlert({
          message: resp.errorMsg as unknown as string,
          type: 'error',
        });
      } else {
        const newTweets = resp.data?.map(processTweet);
        if (newTweets.length < TWEET_LIMIT_PER_PAGE) {
          setHasNextPage(false);
        }
        setTweetsData([...tweetsData, ...newTweets]);
        setPage(pageId);
      }

      //Maybe a better way to do this?
      //Prevents the "250" rate limit if someone is scrolling too fast
      return setTimeout(() => {
        setIsNextPageLoading(false);
      }, 350);
    });
  }, [addAlert, setTweetsData]);

  const Footer = () => {
    return (
      <div className="flex justify-center items-center py-8 pb-24 text-sky-500 font-medium text-sm bg-white dark:bg-black">
        {hasNextPage ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <span className="text-neutral-400">Sem mais tweets</span>
        )}
      </div>
    );
  };

  return (
    <ul className="h-full divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-black overflow-hidden list-none p-0 m-0">
      <Virtuoso
        style={{ height: '100%', width: '100%' }}
        data={tweetsData}
        endReached={handleNewPageLoad}
        overscan={6}
        itemContent={(_, tweet) => {
          return <Tweet key={tweet.id} tweet={tweet} imageOpen={null} setImageOpen={() => { }} />;
        }}
        components={{ Footer }}
      />
    </ul>
  );
}

export default memo(TweetList); // only re-render if our tweets change
