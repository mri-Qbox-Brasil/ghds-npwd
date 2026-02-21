import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Profile as IProfile, FormattedProfile, MatchEvents } from '@typings/match';
import ProfileField from '@ui/components/ProfileField';
import UpdateButton from '@ui/components/UpdateButton';
import Profile from './Profile';
import { usePhone } from '@os/phone/hooks/usePhone';
import PageText from '../PageText';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useSetMyProfile } from '../../hooks/state';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { Mic, Play, Pause, ImageIcon, Music } from 'lucide-react';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import RecordVoiceMessage from '../RecordVoiceMessage';
import { blobToBase64 } from '@utils/seralize';
import { AudioEvents, AudioRequest, AudioResponse } from '@typings/audio';
import { cn } from '@utils/cn';

interface IProps {
  profile: FormattedProfile;
  showPreview: boolean;
}

export function ProfileForm({ profile, showPreview }: IProps) {
  const [t] = useTranslation();
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const setMyProfile = useSetMyProfile();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const query = useQueryParams();

  const [image, setImage] = useState(profile?.image || '');
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [job, setJob] = useState(profile?.job || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [tags, setTags] = useState(profile?.tags || '');
  const [voiceMessage, setVoiceMessage] = useState<Blob | null>(null);
  const [recordVoiceMessage, setRecordVoiceMessage] = useState(false);
  const { play, pause, playing, currentTime, duration } = useAudioPlayer(profile?.voiceMessage);

  const closeVoiceMessageModal = () => {
    setRecordVoiceMessage(false);
  };

  const handleSetVoiceMessage = (voiceMessage: Blob) => {
    setVoiceMessage(voiceMessage);
  };

  const calculateProgress =
    isNaN(duration) || duration === Infinity
      ? 0
      : (Math.trunc(currentTime) / Math.trunc(duration)) * 100;

  const handleOpenGallery = useCallback(() => {
    history.push(`/camera?${qs.stringify({ referal: encodeURIComponent(pathname + search) })}`);
  }, [history, pathname, search]);

  const update: FormattedProfile = {
    ...profile,
    image,
    name,
    bio,
    location,
    job,
    tagList: tags ? tags.split(',').map((tag) => tag.trim()) : [],
  };

  const handleUpdate = async () => {
    let voiceMessageURL: string | null = null;

    if (voiceMessage && voiceMessage.size) {
      const b64 = await blobToBase64(voiceMessage);

      await fetchNui<ServerPromiseResp<AudioResponse>, AudioRequest>(AudioEvents.UPLOAD_AUDIO, {
        file: b64,
        size: voiceMessage.size,
      }).then((audioRes) => {
        if (audioRes.status !== 'ok') {
          return addAlert({
            type: 'error',
            message: audioRes.errorMsg as string,
          });
        }
        voiceMessageURL = audioRes.data.url;
      });
    }

    const updatedProfile: IProfile = {
      ...update,
      name: update.name.trim(),
      image: update.image.trim(),
      tags: update.tagList.join(','),
      voiceMessage: voiceMessageURL || profile?.voiceMessage,
    };

    const event = profile ? MatchEvents.UPDATE_MY_PROFILE : MatchEvents.CREATE_MY_PROFILE;
    fetchNui<ServerPromiseResp<FormattedProfile>>(event, updatedProfile).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t(resp.errorMsg as string) as string,
          type: 'error',
        });
      }

      setMyProfile(resp.data);
      addAlert({
        message: t('MATCH.FEEDBACK.UPDATE_PROFILE_SUCCEEDED') as string,
        type: 'success',
      });
    });
  };

  useEffect(() => {
    if (!query?.image) return;
    setImage(query.image as string);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query, history, pathname, search]);

  if (!profile && !ResourceConfig.match.allowEditableProfileName) {
    return <PageText text={t('MATCH.PROFILE_CONFIGURATION') as string} />;
  }

  if (showPreview) {
    return (
      <div className="h-full w-full p-4 animate-in fade-in duration-500">
        <Profile profile={update} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      <RecordVoiceMessage
        open={recordVoiceMessage}
        closeModal={closeVoiceMessageModal}
        setVoiceMessage={handleSetVoiceMessage}
      />

      <div className="flex-1 overflow-y-auto space-y-6 p-6 pb-32">
        {/* Foto de Perfil */}
        <section className="space-y-3">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            {t('MATCH.EDIT_PROFILE_IMAGE') as string}
          </label>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 shadow-inner">
              {image ? (
                <img src={image} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-neutral-300">
                  <ImageIcon size={32} />
                </div>
              )}
            </div>
            <button
              onClick={handleOpenGallery}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 text-sm"
            >
              <ImageIcon size={18} />
              Escolher da Galeria
            </button>
          </div>
        </section>

        {/* Campos do Perfil */}
        <div className="space-y-4">
          <ProfileField
            label={t('MATCH.EDIT_PROFILE_NAME') as string}
            value={name}
            handleChange={setName}
            allowChange={ResourceConfig.match.allowEditableProfileName}
          />
          <ProfileField
            label={t('MATCH.EDIT_PROFILE_BIO') as string}
            value={bio}
            handleChange={setBio}
            multiline
            maxLength={250}
          />
          <div className="grid grid-cols-2 gap-4">
            <ProfileField
              label={t('MATCH.EDIT_PROFILE_LOCATION') as string}
              value={location}
              handleChange={setLocation}
            />
            <ProfileField
              label={t('MATCH.EDIT_PROFILE_JOB') as string}
              value={job}
              handleChange={setJob}
              maxLength={50}
            />
          </div>
          <ProfileField
            label={t('MATCH.EDIT_PROFILE_TAGS') as string}
            value={tags}
            handleChange={setTags}
          />
        </div>

        {/* Mensagem de Voz */}
        {ResourceConfig && ResourceConfig.voiceMessage && (
          <section className="space-y-3 pt-4">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Music size={14} />
              {t('MATCH.EDIT_VOICE_MESSAGE') as string}
            </label>

            <div className="p-4 bg-pink-50 dark:bg-pink-500/10 rounded-2xl border border-pink-100 dark:border-pink-500/20 flex items-center justify-between gap-4">
              <button
                onClick={() => setRecordVoiceMessage(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-bold rounded-xl shadow-lg hover:bg-pink-600 transition-all active:scale-95 text-sm"
              >
                <Mic size={18} />
                {profile?.voiceMessage ? "Gravar Nova" : "Gravar Bio"}
              </button>

              {profile?.voiceMessage && (
                <div className="flex-1 flex items-center gap-3">
                  <button
                    onClick={playing ? pause : play}
                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 text-pink-500 shadow-sm border border-pink-100 dark:border-pink-900/30"
                  >
                    {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                  <div className="flex-1 h-1.5 bg-pink-200 dark:bg-pink-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 transition-all duration-300"
                      style={{ width: `${calculateProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800 fixed bottom-0 w-full z-10 lg:w-[350px]">
        <button
          onClick={handleUpdate}
          className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/30 transition-all active:scale-95"
        >
          Salvar Perfil
        </button>
      </div>
    </div>
  );
}

export default ProfileForm;
