import React from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { Route, Switch, useHistory } from 'react-router-dom';
import MessageGroupModal from './modal/MessageGroupModal';
import MessagesList from './list/MessagesList';
import { MessageModal } from './modal/MessageModal';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { WordFilterProvider } from '@os/wordfilter/providers/WordFilterProvider';

export const MessagesApp = () => {
    const history = useHistory();

    return (
        <WordFilterProvider>
            <AppWrapper className="bg-white dark:bg-black p-0 m-0 overflow-hidden text-neutral-900 dark:text-white">
                <React.Suspense fallback={<LoadingSpinner />}>
                    <Switch>
                        <Route path="/messages/conversations/:groupId">
                            <MessageModal />
                        </Route>
                        <Route exact path={['/messages/new/:phoneNumber', '/messages/new']}>
                            <MessageGroupModal />
                        </Route>
                        <Route exact path="/messages">
                            <MessagesList />
                        </Route>
                    </Switch>
                </React.Suspense>
            </AppWrapper>
        </WordFilterProvider>
    );
};
