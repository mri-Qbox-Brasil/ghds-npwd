import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormattedProfile, FormattedMatch } from '@typings/match';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import { Play, Pause, MapPin, Briefcase } from 'lucide-react';
import { cn } from '@utils/cn';

interface IProps {
  profile: FormattedProfile | FormattedMatch;
}

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

const Profile = ({ profile }: IProps) => {
  const [t] = useTranslation();
  const { play, pause, playing, currentTime, duration } = useAudioPlayer(profile.voiceMessage);

  const calculateProgress =
    isNaN(duration) || duration === Infinity
      ? 0
      : (Math.trunc(currentTime) / Math.trunc(duration)) * 100;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 overflow-hidden rounded-2xl">
      {/* Profile image */}
      <div className="relative h-[60%] w-full overflow-hidden">
        <img
          src={profile.image || DEFAULT_IMAGE}
          alt={profile.name}
          className="h-full w-full object-cover"
        />

        {/* Tags */}
        {profile.tagList && profile.tagList.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10">
            {profile.tagList.map((tag, idx) => (
              <div
                key={`${tag}-${idx}`}
                className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-[11px] font-medium text-white"
              >
                {tag}
              </div>
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div>
          <h2 className="text-[22px] font-bold text-neutral-900 dark:text-white leading-tight">
            {profile.name}
          </h2>
          <p className="text-[13px] text-pink-500 mt-0.5">
            {t('MATCH.MESSAGES.PROFILE_LAST_ACTIVE', { lastActive: profile.lastActiveFormatted }) as string}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          {profile.location && (
            <div className="flex items-center gap-2 text-[13px] text-neutral-500">
              <MapPin size={14} />
              {profile.location}
            </div>
          )}
          {profile.job && (
            <div className="flex items-center gap-2 text-[13px] text-neutral-500">
              <Briefcase size={14} />
              {profile.job}
            </div>
          )}
        </div>

        {profile.bio && (
          <p className="text-[14px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {profile.voiceMessage && (
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={playing ? pause : play}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-pink-500 text-white active:scale-90 transition-all shrink-0"
              >
                {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
              </button>

              <div className="flex-1 flex flex-col gap-1">
                <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-pink-500 transition-all duration-300",
                      !calculateProgress && playing && "animate-pulse"
                    )}
                    style={{ width: `${calculateProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-neutral-400">
                  {playing ? 'Reproduzindo...' : 'Áudio'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
