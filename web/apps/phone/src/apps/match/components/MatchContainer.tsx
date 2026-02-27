import React, { useEffect, useState } from 'react';
import ProfileEditor from './views/ProfileEditor';
import { Route, useLocation } from 'react-router-dom';
import MatchPage from './views/MatchPage';
import MatchList from './views/MatchList';
import { useProfile } from '../hooks/useProfile';
import { AppContent } from '../../../ui/components/AppContent';
import { AppWrapper } from '../../../ui/components';
import MatchBottomNavigation from './BottomNavigation';

const MatchContainer: React.FC = () => {
  const { profile, noProfileExists, setNoProfileExists } = useProfile();
  const location = useLocation();
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    if (location.pathname === '/match/') setActivePage(0);
    else if (location.pathname === '/match/matches') setActivePage(1);
    else if (location.pathname === '/match/profile') setActivePage(2);
  }, [location]);

  useEffect(() => {
    if (!profile) {
      setNoProfileExists(true);
    } else {
      setNoProfileExists(false);
    }
  }, [setNoProfileExists, profile]);

  return (
    <AppWrapper className="bg-white dark:bg-black">
      {/* Header com padding pro status bar */}
      <header className="flex items-center justify-center pt-[60px] pb-3 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-neutral-200/30 dark:border-neutral-800/30 shrink-0 z-20">
        <span className="text-[17px] font-semibold text-neutral-900 dark:text-white">Match</span>
      </header>

      <AppContent className="flex flex-col h-full overflow-hidden">
        {noProfileExists ? (
          <ProfileEditor />
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col relative w-full h-full">
            <Route path="/match/" exact component={MatchPage} />
            <Route path="/match/matches" exact component={MatchList} />
            <Route path="/match/profile" exact component={ProfileEditor} />
          </div>
        )}
      </AppContent>
      {!noProfileExists && (
        <MatchBottomNavigation activePage={activePage} />
      )}
    </AppWrapper>
  );
};

export default MatchContainer;
