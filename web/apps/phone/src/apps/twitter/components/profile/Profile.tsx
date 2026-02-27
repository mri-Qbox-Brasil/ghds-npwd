import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../hooks/useProfile';
import { usePhone } from '@os/phone/hooks/usePhone';
import { TwitterEvents } from '@typings/twitter';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTwitterActions } from '../../hooks/useTwitterActions';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import qs from 'qs';
import { Camera, User } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 animate-in fade-in duration-300">
      {/* Avatar section */}
      {enableAvatars && (
        <div className="flex flex-col items-center pt-6 pb-4 bg-white dark:bg-black">
          {/* Avatar wrapper - relative para o badge ficar fora do clip */}
          <div className="relative" onClick={handleChooseImage}>
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 active:scale-95 transition-transform cursor-pointer">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="h-full w-full object-cover"
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : null}
              {/* Placeholder sempre renderizado no fundo */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center text-neutral-400 dark:text-neutral-500",
                avatarUrl && "hidden"
              )}>
                <User size={36} strokeWidth={1.5} />
              </div>
            </div>
            {/* Badge de câmera — fora do overflow hidden */}
            <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-sky-500 flex items-center justify-center border-2 border-white dark:border-black shadow-sm cursor-pointer">
              <Camera size={12} className="text-white" />
            </div>
          </div>
          <button
            onClick={handleChooseImage}
            className="mt-2 text-[13px] font-medium text-sky-500 active:text-sky-600 transition-colors"
          >
            Alterar foto
          </button>
        </div>
      )}

      {/* Form fields — grouped inset style */}
      <div className="px-4 pt-6 space-y-5 flex-1">
        {enableAvatars && (
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-neutral-500 px-1">
              URL do avatar
            </label>
            <input
              className="w-full h-11 px-4 bg-white dark:bg-neutral-800 border-none rounded-[10px] text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-0"
              value={avatarUrl}
              onChange={(e) => handleAvatarChange(e.target.value)}
              placeholder="Cole a URL da imagem..."
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-neutral-500 px-1">
            Nome do perfil
          </label>
          <input
            className="w-full h-11 px-4 bg-white dark:bg-neutral-800 border-none rounded-[10px] text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-0 disabled:opacity-50"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={!allowEditableProfileName}
            placeholder="Seu nome de exibição"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="px-4 py-4 pb-20">
        <button
          onClick={handleUpdate}
          className="w-full h-11 bg-sky-500 active:bg-sky-600 text-white font-semibold rounded-[10px] transition-colors text-[15px]"
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

export default Profile;
