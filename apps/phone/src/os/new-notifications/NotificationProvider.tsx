import { APP_TWITTER } from '@apps/twitter/utils/constants';
import { useApps } from '@os/apps/hooks/useApps';
import { TwitterEvents } from '@typings/twitter';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSnackbar } from 'notistack';
import { createContext, useState } from 'react';
import NotificationBase from './components/NotificationBase';

const NotificationContext = createContext(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // we'll probably change this out with a recoil family
  const [notis, setNotis] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { getApp } = useApps();

  const addNotification = (data: any) => {
    const app = getApp(data.appId);
    // @ts-ignore
    enqueueSnackbar((<NotificationBase app={app} message={data.message} />) as any, {
      className: "!bg-[#262626]/85 backdrop-blur-[4px] rounded-xl shadow-lg border border-white/5",
    } as any);
  };

  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_BROADCAST, addNotification);
  return <NotificationContext.Provider value={null}>{children}</NotificationContext.Provider>;
};
