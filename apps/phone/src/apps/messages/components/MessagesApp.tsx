import React from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { Route, Switch, useHistory } from 'react-router-dom';
import MessageGroupModal from './modal/MessageGroupModal';
import MessagesList from './list/MessagesList';
import { MessageModal } from './modal/MessageModal';
import NewMessageGroupButton from './form/NewMessageGroupButton';
import { MessagesThemeProvider } from '../providers/MessagesThemeProvider';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { WordFilterProvider } from '@os/wordfilter/providers/WordFilterProvider';

export const MessagesApp = () => {
    const history = useHistory();

    return (
        <MessagesThemeProvider>
            <AppWrapper id="messages-app">
                <WordFilterProvider>
                    <AppContent className="relative flex flex-col h-full overflow-hidden bg-background">
                        <React.Suspense fallback={<LoadingSpinner />}>
                            <Switch>
                                <Route path="/messages/conversations/:groupId">
                                    <MessageModal />
                                </Route>
                                <Route exact path="/messages">
                                    <MessagesList />
                                </Route>
                            </Switch>
                            <Switch>
                                <Route exact path={['/messages/new/:phoneNumber', '/messages/new']}>
                                    <MessageGroupModal />
                                </Route>
                            </Switch>
                        </React.Suspense>
                    </AppContent>
                    <Route exact path="/messages">
                        <NewMessageGroupButton onClick={() => history.push('/messages/new')} />
                    </Route>
                </WordFilterProvider>
            </AppWrapper>
        </MessagesThemeProvider>
    );
};
