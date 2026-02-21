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
    <AppWrapper className="bg-background">
      <AppContent className="flex flex-col h-full overflow-hidden">
        {noProfileExists ? (
          <ProfileEditor />
        ) : (
          <div className="flex-1 overflow-y-auto">
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
