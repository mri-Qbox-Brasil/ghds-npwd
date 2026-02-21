import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../hooks/useProfile';
import { usePhone } from '@os/phone/hooks/usePhone';
import { TwitterEvents } from '@typings/twitter';
import ProfileField from '../../../../ui/components/ProfileField';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTwitterActions } from '../../hooks/useTwitterActions';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import qs from 'qs';
import { ImagePlus, Camera, User } from 'lucide-react';
import { cn } from '@utils/cn';

export function Profile() {
  const [t] = useTranslation();
  const { profile } = useProfile();
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const query = useQueryParams();
  const { pathname, search } = useLocation();

  const { updateLocalProfile } = useTwitterActions();

  const [avatarUrl, handleAvatarChange] = useState(
    profile?.avatar_url || '',
  );
  const [name, handleNameChange] = useState(profile?.profile_name || '');

  const handleChooseImage = useCallback(() => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [history, pathname, search]);

  const handleUpdate = () => {
    const data = {
      avatar_url: avatarUrl,
      profile_name: name,
    };

    fetchNui<ServerPromiseResp>(TwitterEvents.UPDATE_PROFILE, data).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t(resp.errorMsg || 'TWITTER.FEEDBACK.EDIT_PROFILE_FAILURE') as string,
          type: 'error',
        });
      }

      updateLocalProfile({ profile_name: name, avatar_url: avatarUrl });

      addAlert({
        message: t('TWITTER.FEEDBACK.EDIT_PROFILE_SUCCESS') as string,
        type: 'success',
      });
    });
  };

  useEffect(() => {
    if (!query?.image) return;
    handleAvatarChange(query.image as string);
  }, [query?.image]);

  if (!ResourceConfig || !profile) return null;

  const { enableAvatars, allowEditableProfileName } = ResourceConfig.twitter;

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      <header className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">Perfil</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {enableAvatars && (
          <div className="flex flex-col items-center gap-4">
            <div
              className="group relative h-28 w-28 rounded-3xl bg-neutral-100 dark:bg-neutral-800 shadow-xl overflow-hidden border-4 border-white dark:border-neutral-900 cursor-pointer transition-transform active:scale-95"
              onClick={handleChooseImage}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="h-full w-full object-cover transition-opacity group-hover:opacity-60"
                  alt="profile"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-neutral-300 dark:text-neutral-700">
                  <User size={48} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white">
                <Camera size={32} />
              </div>
            </div>
            <button
              onClick={handleChooseImage}
              className="text-xs font-bold text-sky-500 uppercase tracking-widest hover:underline"
            >
              Alterar Avatar
            </button>
          </div>
        )}

        <div className="space-y-6">
          <ProfileField
            label={t('TWITTER.EDIT_PROFILE_AVATAR') as string}
            value={avatarUrl}
            handleChange={handleAvatarChange}
            allowChange={enableAvatars}
          />
          <ProfileField
            label={t('TWITTER.EDIT_PROFILE_NAME') as string}
            value={name}
            handleChange={handleNameChange}
            allowChange={allowEditableProfileName}
          />
        </div>
      </div>

      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800 shrink-0">
        <button
          onClick={handleUpdate}
          className="w-full h-14 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

export default Profile;
