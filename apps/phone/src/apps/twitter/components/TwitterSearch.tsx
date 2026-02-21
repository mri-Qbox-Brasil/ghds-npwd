import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TweetList from './tweet/TweetList';
import SearchButton from './buttons/SearchButton';
import fetchNui from '@utils/fetchNui';
import { Tweet, TwitterEvents } from '@typings/twitter';
import { useFilteredTweets } from '../hooks/state';
import { processTweet } from '../utils/tweets';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { Search, X } from 'lucide-react';
import { cn } from '@utils/cn';

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
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      <div className="p-4 bg-background/80 backdrop-blur-md sticky top-0 z-10 border-b border-neutral-100 dark:border-neutral-800">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-sky-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="w-full h-12 pl-12 pr-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-sm font-medium focus:ring-2 focus:ring-sky-500 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400"
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('TWITTER.SEARCH_TWEETS_PLACEHOLDER') as string}
            value={searchValue}
          />
          {searchValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={14} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTweets.length > 0 ? (
          <TweetList tweets={tweets} />
        ) : searchValue && (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
            <Search size={48} className="mb-4" />
            <p className="font-bold">Nenhum tweet encontrado</p>
            <p className="text-sm">Tente buscar por outras palavras-chave</p>
          </div>
        )}
      </div>

      {!searchValue && (
        <SearchButton handleClick={handleSubmit} />
      )}
    </div>
  );
}

export default TwitterSearch;
