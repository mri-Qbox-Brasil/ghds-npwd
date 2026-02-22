import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TweetList from './tweet/TweetList';
import fetchNui from '@utils/fetchNui';
import { Tweet, TwitterEvents } from '@typings/twitter';
import { useFilteredTweets } from '../hooks/state';
import { processTweet } from '../utils/tweets';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { Search, X } from 'lucide-react';

function TwitterSearch() {
  const [t] = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const { addAlert } = useSnackbar();
  const [tweets, setFilteredTweets] = useFilteredTweets();

  const handleChange = (e) => setSearchValue(e.target.value);

  const handleSubmit = () => {
    const cleanedSearchValue = searchValue.trim();
    if (!cleanedSearchValue) return;

    fetchNui<ServerPromiseResp<Tweet[]>>(TwitterEvents.FETCH_TWEETS_FILTERED, {
      searchValue: cleanedSearchValue,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t(resp.errorMsg || '') as string,
          type: 'error',
        });
      }

      setFilteredTweets(resp.data.map(processTweet));
    });
  };

  const handleClear = () => {
    setSearchValue('');
    setFilteredTweets([]);
  };

  const filteredTweets = tweets || [];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black animate-in fade-in duration-300">
      <div className="p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-10 border-b border-neutral-200/30 dark:border-neutral-800/30">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full h-10 pl-10 pr-10 rounded-[10px] bg-neutral-100 dark:bg-neutral-800 border-none text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-0"
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('TWITTER.SEARCH_TWEETS_PLACEHOLDER') as string}
            value={searchValue}
          />
          {searchValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-neutral-300 dark:bg-neutral-600 text-white"
            >
              <X size={12} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTweets.length > 0 ? (
          <TweetList tweets={tweets} />
        ) : searchValue && (
          <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-400">
            <Search size={40} strokeWidth={1.5} className="mb-3" />
            <p className="font-semibold text-[15px]">Nenhum tweet encontrado</p>
            <p className="text-[13px] mt-1">Tente buscar por outras palavras-chave</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TwitterSearch;
