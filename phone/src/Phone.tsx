import React, { useMemo } from 'react';
import './Phone.css';
import './i18n';
import { Route } from 'react-router-dom';
import MessageIcon from '@material-ui/icons/Email';
import { CallModal } from './modal/components/CallModal';
import { HomeApp } from './apps/home/components/Home';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { useInitKeyboard } from './os/keyboard/hooks/useKeyboard';
import { NotificationIcon } from './os/notifications/components/NotificationIcon';
import { NotificationBar } from './os/notifications/components/NotificationBar';
import { Navigation } from './os/navigation-bar/components/Navigation';
import { useNuiService } from './os/nui-events/hooks/useNuiService';
import { useSimcardService } from './os/simcard/hooks/useSimcardService';
import { usePhoneService } from './os/phone/hooks/usePhoneService';
import { useApps } from './os/apps/hooks/useApps';

import { useContactsService } from './apps/contacts/hooks/useContactsService';
import { useTwitterService } from './apps/twitter/hooks/useTwitterService';
import { useSelloutService } from './apps/sellout/hooks/useSelloutService';
import { useBankService } from './apps/bank/hooks/useBankService';
import { useMessagesService } from './apps/messages/hooks/useMessageService';
import { useNotesService } from './apps/notes/hooks/useNotesService';
import { usePhotoService } from './apps/camera/hooks/usePhotoService';
import Nui from './os/nui-events/utils/Nui';
import { usePhone } from './os/phone/hooks/usePhone';
import { settingsState } from './apps/settings/hooks/useSettings';

import config from './config/default.json';
import { useRecoilState } from 'recoil';
import { useCallService } from './modal/hooks/useCallService';
import { useModal } from './modal/hooks/useModal';
import { useDialService } from './apps/dialer/hooks/useDialService';
import InjectDebugData from './os/debug/InjectDebugData';

InjectDebugData([
  {
    app: 'PHONE',
    method: 'phoneConfig',
    data: {
      Locale: 'en',
      KeyTogglePhone: 288,
      KeyTakeCall: 38,
      PhoneAsItem: false,
      SwimDestroy: false,
      RunRate: 10,
      DestoryChance: 100,
      DestroyPhoneReCheck: 3,
      notificationPosition: {
        horizontal: 'right',
        vertical: 'top',
      },
      general: {
        useDashNumber: true,
      },
      twitter: {
        showNotifications: true,
        generateProfileNameFromUsers: true,
        allowEdtiableProfileName: true,
        allowDeleteTweets: true,
        allowReportTweets: true,
        characterLimit: 160,
        newLineLimit: 10,
        enableAvatars: true,
        enableEmojis: true,
        enableImages: true,
        maxImages: 3,
      },
      bank: {
        showNotifications: true,
      },
    },
  },
  {
    app: 'PHONE',
    method: 'setVisibility',
    data: true,
  },
]);

function Phone() {
  useNuiService();
  usePhoneService();
  const { visibility } = usePhone();
  const { allApps } = useApps();
  useSimcardService();
  useContactsService();
  useTwitterService();
  useInitKeyboard();
  useSelloutService();
  useBankService();
  useMessagesService();
  useNotesService();
  usePhotoService();
  useCallService();
  useDialService();

  const { modal } = useModal(); // the calling modal

  const [settings] = useRecoilState(settingsState);

  const currentTheme = useMemo(
    () => createMuiTheme(config.themes[settings.theme]),
    [settings.theme]
  );

  if (visibility === false) {
    return null;
  }
  document.onkeyup = function (data) {
    if (data.which === 27) {
      Nui.send('phone:close');
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <div className='PhoneWrapper'>
        <div>
          <div
            className='Phone'
            style={{
              transformOrigin: 'right bottom',
              transform: `scale(${settings.zoom}`,
            }}
          >
            <div
              className='PhoneFrame'
              style={{
                backgroundImage: `url(./media/frames/${settings.frame})`,
              }}
            />
            <div
              id='phone'
              className='PhoneScreen'
              style={{
                backgroundImage: `url(./media/backgrounds/${settings.wallpaper})`,
              }}
            >
              <>
                <NotificationBar
                  notifications={[
                    {
                      key: 'newMessage',
                      icon: <NotificationIcon Icon={MessageIcon} />,
                    },
                  ]}
                />
                <div className='PhoneAppContainer'>
                  {modal ? (
                    <CallModal />
                  ) : (
                    <>
                      <Route exact path='/' component={HomeApp} />

                      {allApps.map((App) => (
                        <App.Route key={App.id} />
                      ))}
                    </>
                  )}
                </div>
                <Navigation />
              </>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Phone;
