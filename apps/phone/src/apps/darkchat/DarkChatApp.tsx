import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { Route, Switch } from 'react-router-dom';
import ChatList from './components/views/ChatListView';
import { ConversationView } from './components/views/ConversationView';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const DarkChatApp = () => {
  return (
    <AppWrapper className="!bg-[#1E1F22]">
      <AppContent className="flex flex-col h-full overflow-hidden scrollbar-hide !bg-[#1E1F22]">
        <React.Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route exact path="/darkchat" component={ChatList} />
            <Route path="/darkchat/conversation/:id" component={ConversationView} />
          </Switch>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};

export default DarkChatApp;
