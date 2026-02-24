import React from 'react';
import { AppWrapper } from '@ui/components';
import { Route, Switch } from 'react-router-dom';
import { MailList } from './MailList';
import { MailView } from './MailView';
import { useMail } from '../hooks/useMail';

export const MailApp: React.FC = () => {
    useMail(); // Init mails load

    return (
        <AppWrapper id="mail-app" className="bg-white dark:bg-black p-0 m-0 relative">
            <Switch>
                <Route exact path="/mail" component={MailList} />
                <Route path="/mail/view/:id" component={MailView} />
            </Switch>
        </AppWrapper>
    );
};

export default MailApp;
