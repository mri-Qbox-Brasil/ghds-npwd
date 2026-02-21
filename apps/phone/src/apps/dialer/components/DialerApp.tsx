import React from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DialerHistory } from './views/DialerHistory';
import { Switch, Route } from 'react-router-dom';
import DialPage from './views/DialPage';
import DialerNavBar from './DialerNavBar';
import { ContactList } from '../../contacts/components/List/ContactList';
import { DialerThemeProvider } from '../providers/DialerThemeProvider';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const DialerApp: React.FC = () => {
  return (
    <DialerThemeProvider>
      <AppWrapper className="bg-background">
        <AppContent className="flex flex-col h-full overflow-hidden">
          <Switch>
            <Route path="/phone/dial">
              <DialPage />
            </Route>
            <Route exact path="/phone">
              <React.Suspense fallback={<LoadingSpinner />}>
                <DialerHistory />
              </React.Suspense>
            </Route>
            <Route path="/phone/contacts">
              <React.Suspense fallback={<LoadingSpinner />}>
                <ContactList />
              </React.Suspense>
            </Route>
          </Switch>
        </AppContent>
        <DialerNavBar />
      </AppWrapper>
    </DialerThemeProvider>
  );
};

export default DialerApp;