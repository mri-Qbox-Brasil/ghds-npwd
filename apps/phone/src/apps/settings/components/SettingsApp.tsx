import React, { Suspense, useMemo, useRef } from 'react';
import { AppWrapper } from '@ui/components/AppWrapper';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { AppContent } from '@ui/components/AppContent';
import { useContextMenu, MapSettingItem, SettingOption } from '@ui/hooks/useContextMenu';
import { usePhoneConfig } from '../../../config/hooks/usePhoneConfig';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import {
  SettingItem,
  SettingItemIconAction,
  SettingItemSlider,
  SettingSwitch,
  SoundItem,
} from './SettingItem';
import { useTranslation } from 'react-i18next';

import { Copy, Settings2 } from 'lucide-react';
import {
  BookA,
  EyeOff,
  FileMusic,
  Wallpaper,
  Palette,
  Phone,
  ShieldOff,
  Volume2,
  Smartphone,
  ZoomIn,
  ListFilter,
  Eraser,
} from 'lucide-react';
import { useResetSettings, useSettings } from '../hooks/useSettings';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { IContextMenuOption } from '@ui/components/ContextMenu';
import WallpaperModal from './WallpaperModal';
import { SettingsCategory } from './SettingsCategory';
import { IconSetObject } from '@typings/settings';
import { useCustomWallpaperModal } from '../state/customWallpaper.state';
import fetchNui from '@utils/fetchNui';
import { SettingEvents } from '@typings/settings';
import { cn } from '@utils/cn';

export const SettingsApp: React.FC = () => {
  const [config] = usePhoneConfig();
  const myNumber = useMyPhoneNumber();
  const [settings, setSettings] = useSettings();
  const [t] = useTranslation();
  const [customWallpaperState, setCustomWallpaperState] = useCustomWallpaperModal();

  const { addAlert } = useSnackbar();
  const resetSettings = useResetSettings();

  const handleSettingChange = (key: string | number, value: unknown) => {
    setSettings({ ...settings, [key]: value });

    if (key === 'theme') {
      if ((value as any).value === 'taso-dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const iconSets = config.iconSet.map(
    MapSettingItem(settings.iconSet, (val: SettingOption<IconSetObject>) =>
      handleSettingChange('iconSet', val),
    ),
  );

  const wallpapers = config.wallpapers.map(
    MapSettingItem(settings.wallpaper, (val: SettingOption) =>
      handleSettingChange('wallpaper', val),
    ),
  );
  const frames = config.frames.map(
    MapSettingItem(settings.frame, (val: SettingOption) => handleSettingChange('frame', val)),
  );
  const themes = config.themes.map(
    MapSettingItem(settings.theme, (val: SettingOption) => handleSettingChange('theme', val)),
  );
  const zoomOptions = config.zoomOptions.map(
    MapSettingItem(settings.zoom, (val: SettingOption) => handleSettingChange('zoom', val)),
  );
  const ringtones = config.ringtones.map(
    MapSettingItem(settings.ringtone, (val: SettingOption) => handleSettingChange('ringtone', val)),
  );
  const notifications = config.notiSounds.map(
    MapSettingItem(settings.notiSound, (val: SettingOption) =>
      handleSettingChange('notiSound', val),
    ),
  );

  const twitterNotifications = config.notiSounds.map(
    MapSettingItem(settings.TWITTER_notiSound, (val: SettingOption) =>
      handleSettingChange('TWITTER_notiSound', val),
    ),
  );

  const twitterNotificationFilters = config.notiFilters.map(
    MapSettingItem(settings.TWITTER_notiFilter, (val: SettingOption) =>
      handleSettingChange('TWITTER_notiFilter', val),
    ),
  );

  const languages = config.languages.map(
    MapSettingItem(settings.language, (val: SettingOption) => handleSettingChange('language', val)),
  );

  const handleResetOptions = () => {
    resetSettings();
    addAlert({
      message: t('SETTINGS.MESSAGES.SETTINGS_RESET') as string || 'Configurações resetadas',
      type: 'success',
    });
  };

  const resetSettingsOpts: IContextMenuOption[] = [
    {
      selected: false,
      onClick: () => handleResetOptions(),
      key: 'RESET_SETTINGS',
      label: t('SETTINGS.OPTIONS.RESET_SETTINGS') as string || 'Resetar Configurações',
    },
  ];

  const customWallpaper: IContextMenuOption = {
    selected: false,
    onClick: () => setCustomWallpaperState(true),
    key: 'CUSTOM_WALLPAPER',
    label: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE') as string || 'Papel de Parede Personalizado',
  };
  const handleCopyPhoneNumber = () => {
    setClipboard(myNumber);
    addAlert({
      message: t('GENERIC.WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'number',
      }) as string || 'Número copiado para a área de transferência',
      type: 'success',
    });
  };

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <AppWrapper className="bg-[#F2F2F7] dark:bg-black p-0 m-0">
      <WallpaperModal />
      {customWallpaperState && <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />}

      <DynamicHeader title="Ajustes" scrollRef={scrollRef} variant="pinned" />

      <AppContent
        ref={scrollRef}
        className="flex flex-col grow pb-24 scrollbar-hide h-full relative"
      >
        <DynamicHeader title="Ajustes" scrollRef={scrollRef} variant="largeTitle" />

        <div className="flex flex-col gap-1 mt-2 px-0">
          <SettingsCategory title={t('SETTINGS.CATEGORY.PHONE')}>
            <SettingItemIconAction
              label={t('SETTINGS.PHONE_NUMBER')}
              labelSecondary={myNumber}
              actionLabel={t('GENERIC.WRITE_TO_CLIPBOARD_TOOLTIP', { content: 'number' }) as string}
              Icon={Phone}
              actionIcon={<Copy size={18} />}
              handleAction={handleCopyPhoneNumber}
              iconBg="bg-blue-500"
            />
            <SoundItem
              label={t('SETTINGS.OPTIONS.RINGTONE')}
              value={settings.ringtone.label}
              options={ringtones}
              onClick={openMenu}
              Icon={FileMusic}
              tooltip={t('SETTINGS.PREVIEW_SOUND')}
              onPreviewClicked={() => fetchNui(SettingEvents.PREVIEW_RINGTONE)}
              iconBg="bg-orange-500"
            />
            <SoundItem
              label={t('SETTINGS.OPTIONS.NOTIFICATION')}
              value={settings.notiSound.label}
              options={notifications}
              onClick={openMenu}
              Icon={FileMusic}
              tooltip={t('SETTINGS.PREVIEW_SOUND')}
              onPreviewClicked={() => fetchNui(SettingEvents.PREVIEW_ALERT)}
              iconBg="bg-emerald-500"
            />
            <SettingSwitch
              label={t('SETTINGS.OPTIONS.STREAMER_MODE.TITLE')}
              secondary={t('SETTINGS.OPTIONS.STREAMER_MODE.DESCRIPTION')}
              icon={<EyeOff size={20} />}
              value={settings.streamerMode}
              onClick={(curr) => handleSettingChange('streamerMode', !curr)}
              iconBg="bg-slate-400"
            />
            <SettingSwitch
              label={t('SETTINGS.OPTIONS.ANONYMOUS_MODE.TITLE')}
              secondary={t('SETTINGS.OPTIONS.ANONYMOUS_MODE.DESCRIPTION')}
              icon={<ShieldOff size={20} />}
              value={settings.anonymousMode}
              onClick={(curr) => handleSettingChange('anonymousMode', !curr)}
              iconBg="bg-slate-500"
            />
            <SettingItemSlider
              label={t('SETTINGS.OPTIONS.CALL_VOLUME')}
              icon={<Volume2 size={20} />}
              value={settings.callVolume}
              onCommit={(val) => handleSettingChange('callVolume', val)}
              iconBg="bg-orange-500"
            />
          </SettingsCategory>

          <SettingsCategory title={t('SETTINGS.CATEGORY.APPEARANCE')}>
            {/* <SettingItem
              label={t('SETTINGS.OPTIONS.ICON_SET')}
              value={settings.iconSet.label}
              options={iconSets}
              onClick={openMenu}
              Icon={ListFilter}
              iconBg="bg-blue-600"
            /> */}
            <SettingItem
              label={t('SETTINGS.OPTIONS.LANGUAGE')}
              value={settings.language.label}
              options={languages}
              onClick={openMenu}
              Icon={BookA}
              iconBg="bg-cyan-500"
            />
            <SettingItem
              label={t('SETTINGS.OPTIONS.THEME')}
              value={settings.theme.label}
              options={themes}
              onClick={openMenu}
              Icon={Palette}
              iconBg="bg-purple-600"
            />
            <SettingItem
              label={t('SETTINGS.OPTIONS.WALLPAPER')}
              value={settings.wallpaper.label}
              options={[...wallpapers, customWallpaper]}
              onClick={openMenu}
              Icon={Wallpaper}
              iconBg="bg-pink-500"
            />
            <SettingItem
              label={t('SETTINGS.OPTIONS.FRAME')}
              value={settings.frame.label}
              options={frames}
              onClick={openMenu}
              Icon={Smartphone}
              iconBg="bg-neutral-800"
            />
            <SettingItem
              label={t('SETTINGS.OPTIONS.ZOOM')}
              value={settings.zoom.label}
              options={zoomOptions}
              onClick={openMenu}
              Icon={ZoomIn}
              iconBg="bg-indigo-500"
            />
          </SettingsCategory>

          <SettingsCategory title={t('APPS_TWITTER')}>
            <SettingItem
              label={t('SETTINGS.OPTIONS.NOTIFICATION_FILTER')}
              value={settings.TWITTER_notiFilter.label}
              options={twitterNotificationFilters}
              onClick={openMenu}
              Icon={ListFilter}
              iconBg="bg-sky-500"
            />
            <SettingItem
              label={t('SETTINGS.OPTIONS.NOTIFICATION')}
              value={settings.TWITTER_notiSound.label}
              options={twitterNotifications}
              onClick={openMenu}
              Icon={FileMusic}
              iconBg="bg-sky-600"
            />
            <SettingItemSlider
              label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
              value={settings.TWITTER_notiSoundVol}
              onCommit={(val) => handleSettingChange('TWITTER_notiSoundVol', val)}
              icon={<Volume2 size={20} />}
              iconBg="bg-sky-400"
            />
          </SettingsCategory>

          <SettingsCategory title={t('APPS_MARKETPLACE')}>
            <SettingSwitch
              label={t('SETTINGS.MARKETPLACE.NOTIFICATION')}
              secondary={t('SETTINGS.MARKETPLACE.NOTIFY_NEW_LISTING')}
              value={settings.MARKETPLACE_notifyNewListing}
              icon={<ListFilter size={20} />}
              onClick={(curr) => handleSettingChange('MARKETPLACE_notifyNewListing', !curr)}
              iconBg="bg-emerald-600"
            />
          </SettingsCategory>

          <SettingsCategory title={t('SETTINGS.CATEGORY.ACTIONS')}>
            <SettingItem
              label={t('SETTINGS.OPTIONS.RESET_SETTINGS')}
              value={t('SETTINGS.OPTIONS.RESET_SETTINGS_DESC')}
              Icon={Eraser}
              onClick={openMenu}
              options={resetSettingsOpts}
              iconBg="bg-red-500"
            />
          </SettingsCategory>
        </div>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};

export default SettingsApp;
