import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader';
import PageText from '../PageText';
import Match from '../matches/Match';
import { useMatches } from '../../hooks/useMatches';
import MatchPagination from '../MatchPagination';
import { useMatchActions } from '../../hooks/useMatchActions';

function MatchList() {
  const [t] = useTranslation();
  const { matches, error } = useMatches();
  const { newMatchesPage } = useMatchActions();

  const [matchPage, setMatchPage] = useState<number>(1);

  const handlePageChange = useCallback(
    (_: any, page: number) => {
      setMatchPage(page);
    },
    [setMatchPage],
  );

  useEffect(() => {
    newMatchesPage(matchPage - 1);
  }, [matchPage, newMatchesPage]);

  if (error) return <PageText text={t('MATCH.FEEDBACK.MATCHES_ERROR') as string} />;
  if (!matches) return <Loader />;
  if (matches.length === 0) return <PageText text={t('MATCH.FEEDBACK.NO_MATCHES') as string} />;

  const MAX_PAGE_SIZE = 20;
  const totalPageCount = Math.ceil(matches.length / MAX_PAGE_SIZE);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {matches.map((match) => (
            <Match key={match.id} match={match} />
          ))}
        </div>

        {totalPageCount > 1 && (
          <div className="px-4 py-6">
            <MatchPagination
              onChange={handlePageChange}
              totalCount={totalPageCount}
              currentPage={matchPage}
            />
          </div>
        )}

        <div className="h-20" />
      </div>
    </div>
  );
}

export default MatchList;
