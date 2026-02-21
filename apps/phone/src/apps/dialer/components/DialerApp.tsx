import React from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DialerHistory } from './views/DialerHistory';
import { Switch, Route } from 'react-router-dom';
import DialPage from './views/DialPage';
import DialerNavBar from './DialerNavBar';
import { ContactList } from '../../contacts/components/List/ContactList';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { Star } from 'lucide-react';

export const DialerApp: React.FC = () => {
  return (
    <AppWrapper className="bg-[#FFFFFF] dark:bg-black text-foreground transition-colors duration-300">
      <AppContent className="flex flex-col h-full overflow-hidden pt-[80px] bg-[#FFFFFF] dark:bg-black">
        <Switch>
          <Route path="/phone/dial">
            <DialPage />
          </Route>
          <Route path="/phone/contacts">
            <React.Suspense fallback={<LoadingSpinner />}>
              <ContactList />
            </React.Suspense>
          </Route>
          <Route path="/phone/favorites">
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
              <Star size={48} className="mb-4 opacity-20" />
              <p>Favoritos (Em breve)</p>
            </div>
          </Route>
          <Route path="/phone">
            <React.Suspense fallback={<LoadingSpinner />}>
              <DialerHistory />
            </React.Suspense>
          </Route>
        </Switch>
      </AppContent>
      <DialerNavBar />
    </AppWrapper>
  );
};

export default DialerApp;