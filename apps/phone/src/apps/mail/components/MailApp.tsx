import React, { useRef } from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { Route, Switch } from 'react-router-dom';
import { MailList } from './MailList';
import { MailView } from './MailView';
import { useTranslation } from 'react-i18next';
import { useMail } from '../hooks/useMail';

export const MailApp: React.FC = () => {
    const [t] = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    useMail(); // Init mails load

    return (
        <AppWrapper id="mail-app" className="bg-[#F2F2F7] dark:bg-black p-0 m-0 relative">
            <Switch>
                <Route exact path="/mail">
                    <DynamicHeader
                        title={t('APPS_MAIL') || 'Mail'}
                        scrollRef={scrollRef}
                        variant="pinned"
                    />
                    <AppContent
                        ref={scrollRef}
                        className="flex flex-col grow scrollbar-hide h-full w-full relative"
                    >
                        <DynamicHeader title={t('APPS_MAIL') || 'Mail'} scrollRef={scrollRef} variant="largeTitle" />
                        <MailList />
                    </AppContent>
                </Route>
                <Route path="/mail/view/:id" component={MailView} />
            </Switch>
        </AppWrapper>
    );
};

export default MailApp;
