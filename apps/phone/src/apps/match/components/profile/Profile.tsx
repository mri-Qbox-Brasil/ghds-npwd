import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormattedProfile, FormattedMatch } from '@typings/match';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import { Play, Pause, MapPin, Briefcase, Hash } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 overflow-hidden rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-800">
      {/* Imagem do Perfil */}
      <div className="relative h-[65%] w-full overflow-hidden">
        <img
          src={profile.image || DEFAULT_IMAGE}
          alt={profile.name}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
        />

        {/* Chips de Tags flutuantes sobre a imagem */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
          {profile.tagList.map((tag, idx) => (
            <div
              key={`${tag}-${idx}`}
              className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
            >
              <Hash size={10} strokeWidth={3} />
              {tag}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Conteúdo Informativo */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-neutral-900 dark:text-white leading-tight">
            {profile.name}
          </h2>
          <p className="text-xs font-bold text-pink-500 uppercase tracking-widest">
            {t('MATCH.MESSAGES.PROFILE_LAST_ACTIVE', { lastActive: profile.lastActiveFormatted }) as string}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {profile.location && (
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              <MapPin size={16} />
              {profile.location}
            </div>
          )}
          {profile.job && (
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              <Briefcase size={16} />
              {profile.job}
            </div>
          )}
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic border-l-4 border-pink-500/20 pl-4 py-1">
          "{profile.bio}"
        </p>

        {profile.voiceMessage && (
          <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-500/10 rounded-2xl border border-pink-100 dark:border-pink-500/20">
            <div className="flex items-center gap-4">
              <button
                onClick={playing ? pause : play}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-lg active:scale-90 transition-all"
              >
                {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>

              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-2 bg-pink-200 dark:bg-pink-900/50 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-pink-500 transition-all duration-300",
                      !calculateProgress && playing && "animate-pulse"
                    )}
                    style={{ width: `${calculateProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-pink-500 uppercase tracking-tighter opacity-60">
                  <span>Audio Bio</span>
                  <span>{playing ? 'Reproduzindo' : 'Pausado'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
