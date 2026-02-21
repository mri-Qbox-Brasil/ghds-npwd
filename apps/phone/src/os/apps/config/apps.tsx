import React from 'react';
import { DialerApp } from '@apps/dialer/components/DialerApp';
import { ContactsApp } from '@apps/contacts/components/ContactsApp';
import { CalculatorApp } from '@apps/calculator/components/CalculatorApp';
import { SettingsApp } from '@apps/settings/components/SettingsApp';
import { MessagesApp } from '@apps/messages/components/MessagesApp';
import { ExampleAppWrapper } from '@apps/example/components/ExampleAppWrapper';
import { MarketplaceApp } from '@apps/marketplace/components/MarketplaceApp';
import { NotesApp } from '@apps/notes/NotesApp';
import CameraApp from '@apps/camera/components/CameraApp';
import { AppRoute } from '../components/AppRoute';
import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import { BrowserApp } from '@apps/browser/components/BrowserApp';
import { MatchApp } from '@apps/match/components/MatchApp';
import LifeInvaderContainer from '@apps/twitter/components/TwitterContainer';
import { IPhoneSettings } from '@typings/settings';
import { i18n } from 'i18next';

import DarkChatApp from '../../../apps/darkchat/DarkChatApp';
import DialerAppIcon from '../icons/material/app/DIALER';
import BrowserIcon from '../icons/material/app/BROWSER';
import MessagesIcon from '../icons/material/app/MESSAGES';
import DarkchatIcon from '../icons/material/app/DARKCHAT';
import ContactIcon from '../icons/material/app/CONTACTS';
import CalculatorIcon from '../icons/material/app/CALCULATOR';
import SettingsIcon from '../icons/material/app/SETTINGS';
import MatchIcon from '../icons/material/app/MATCH';
import TwitterIcon from '../icons/material/app/TWITTER';
import MarketplaceIcon from '../icons/material/app/MARKETPLACE';
import NotesIcon from '../icons/material/app/NOTES';
import Camera from '../icons/material/app/CAMERA';
import ExampleIcon from '../icons/material/app/EXAMPLE';
import WeatherIcon from '../icons/material/app/WEATHER';
import BankIcon from '../icons/material/app/BANK';
import BankApp from '@apps/bank/components/BankApp';

export interface IAppConfig {
  id: string;
  nameLocale: string;
  backgroundColor?: string;
  color: string;
  path: string;
  disable?: boolean;
  Route: React.FC<{ settings?: IPhoneSettings; i18n?: i18n }>;
  icon: JSX.Element;
  isDockApp?: boolean;
}

export type IApp = IAppConfig & {
  notification: INotificationIcon;
  icon: JSX.Element;
  isDisabled: boolean;
  notificationIcon: JSX.Element;
  NotificationIcon: React.FC<any>;
  Icon?: React.FC<any>;
  theme?: any;
};

export const APPS: IAppConfig[] = [
  {
    id: 'DIALER',
    nameLocale: 'APPS_DIALER',
    backgroundColor: "rgba(0, 0, 0, 0)",
    icon: <DialerAppIcon />,
    color: '#10B981', // emerald-500
    path: '/phone',
    isDockApp: true,
    Route: () => <AppRoute id="DIALER" path="/phone" component={DialerApp} emitOnOpen={false} />,
  },
  {
    id: 'CONTACTS',
    nameLocale: 'APPS_CONTACTS',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    icon: <ContactIcon />,
    color: '#000000',
    path: '/contacts',
    isDockApp: true,
    Route: () => (
      <AppRoute id="CONTACTS" path="/contacts" component={ContactsApp} emitOnOpen={false} />
    ),
  },
  {
    id: 'BROWSER',
    nameLocale: 'BROWSER.NAME',
    path: '/browser',
    icon: <BrowserIcon />,
    color: '#ffffff',
    isDockApp: true,
    Route: () => (
      <AppRoute id="BROWSER" path="/browser" component={BrowserApp} emitOnOpen={false} />
    ),
  },
  {
    id: 'MESSAGES',
    nameLocale: 'APPS_MESSAGES',
    icon: <MessagesIcon />,
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: '#3b82f6', // blue-500
    path: '/messages',
    isDockApp: true,
    Route: () => (
      <AppRoute id="MESSAGES" path="/messages" component={MessagesApp} emitOnOpen={false} />
    ),
  },
  {
    id: 'CALCULATOR',
    nameLocale: 'APPS_CALCULATOR',
    icon: <CalculatorIcon />,
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: '#fafafa',
    path: '/calculator',
    Route: () => (
      <AppRoute id="CALCULATOR" path="/calculator" component={CalculatorApp} emitOnOpen={false} />
    ),
  },
  {
    id: 'SETTINGS',
    nameLocale: 'APPS_SETTINGS',
    icon: <SettingsIcon />,
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: '#fafafa',
    path: '/settings',
    Route: () => (
      <AppRoute id="SETTINGS" path="/settings" component={SettingsApp} emitOnOpen={false} />
    ),
  },
  {
    id: 'DARKCHAT',
    nameLocale: 'APPS_DARKCHAT',
    icon: <DarkchatIcon />,
    backgroundColor: "#ffffff",
    color: '#171717', // neutral-900
    path: '/darkchat',
    Route: () => (
      <AppRoute id="DARKCHAT" path="/darkchat" component={DarkChatApp} emitOnOpen={false} />
    ),
  },
  {
    id: 'MATCH',
    nameLocale: 'APPS_MATCH',
    icon: <MatchIcon />,
    backgroundColor: "rgba(0,0,0,0)",
    color: '#ffffff',
    path: '/match',
    Route: () => <AppRoute id="MATCH" path="/match" component={MatchApp} emitOnOpen={false} />,
  },
  {
    id: 'TWITTER',
    nameLocale: 'APPS_TWITTER',
    icon: <TwitterIcon />,
    backgroundColor: '#1DA1F2',
    color: '#ffffff',
    path: '/twitter',
    Route: () => (
      <AppRoute id="TWITTER" path="/twitter" component={LifeInvaderContainer} emitOnOpen={false} />
    ),
  },
  {
    id: 'MARKETPLACE',
    nameLocale: 'APPS_MARKETPLACE',
    icon: <MarketplaceIcon />,
    backgroundColor: '#ffffff',
    color: '#ffffff',
    path: '/marketplace',
    Route: () => (
      <AppRoute
        id="MARKETPLACE"
        path="/marketplace"
        component={MarketplaceApp}
        emitOnOpen={false}
      />
    ),
  },
  {
    id: 'NOTES',
    nameLocale: 'APPS_NOTES',
    icon: <NotesIcon />,
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: '#ffffff',
    path: '/notes',
    Route: () => <AppRoute id="NOTES" path="/notes" component={NotesApp} emitOnOpen={false} />,
  },
  {
    id: 'CAMERA',
    nameLocale: 'APPS_CAMERA',
    icon: <Camera />,
    backgroundColor: '#303030', // grey 800
    color: '#ffffff',
    path: '/camera',
    Route: () => <AppRoute id="CAMERA" path="/camera" component={CameraApp} emitOnOpen={false} />,
  },
  {
    id: 'WEATHER',
    nameLocale: 'APPS_WEATHER',
    icon: <WeatherIcon />,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: '#ffffff',
    path: '/test',
    // Route: () => <AppRoute id="EXAMPLE" path="/example" component={ExampleAppWrapper} emitOnOpen={false} />
    Route: () => <div></div>,

  },
  {
    id: 'BANK',
    nameLocale: 'APPS_BANK',
    icon: <BankIcon />,
    backgroundColor: '#008000',
    color: '#ffffff',
    path: '/bank',
    // Route: () => <AppRoute id="EXAMPLE" path="/example" component={ExampleAppWrapper} emitOnOpen={false} />
    Route: () => <AppRoute id="BANK" path="/bank" component={BankApp} emitOnOpen={false}></AppRoute>,

  },
];

// Example app only in dev
if (import.meta.env.DEV) {
  APPS.push({
    id: 'EXAMPLE',
    nameLocale: 'APPS_EXAMPLE',
    icon: <ExampleIcon />,
    backgroundColor: '#3b82f6', // blue 500
    color: '#eff6ff', // blue 50
    path: '/example',
    Route: () => (
      <AppRoute id="EXAMPLE" path="/example" component={ExampleAppWrapper} emitOnOpen={false} />
    ),
  });
}
