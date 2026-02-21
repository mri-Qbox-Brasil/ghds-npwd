import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { User, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FormattedMatch } from '@typings/match';
import Profile from '../profile/Profile';
import { cn } from '@utils/cn';

interface IProps {
  match: FormattedMatch;
}

export const Match = ({ match }: IProps) => {
  const history = useHistory();
  const [t] = useTranslation();
  const [showProfile, setShowProfile] = useState(false);

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    history.push(`/messages/new?phoneNumber=${match.phoneNumber}`);
  };

  const handleProfile = () => {
    setShowProfile((show) => !show);
  };

  const secondaryText = t('MATCH.MESSAGES.PROFILE_MATCHED_AT', {
    matchedAt: match.matchedAtFormatted,
  }) as string;

  return (
    <div className="flex flex-col border-b border-neutral-100 dark:border-neutral-800 last:border-0 group transition-all">
      <div
        onClick={handleProfile}
        className="flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
      >
        {/* Avatar Placeholder / Miniatura */}
        <div className="h-14 w-14 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 overflow-hidden shrink-0 border border-pink-50 dark:border-pink-900/20 shadow-sm transition-transform group-hover:scale-105">
          {match.image ? (
            <img src={match.image} alt={match.name} className="h-full w-full object-cover" />
          ) : (
            <User size={24} />
          )}
        </div>

        {/* Informações */}
        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          <h3 className="font-bold text-neutral-900 dark:text-white truncate">
            {match.name}
          </h3>
          <p className="text-xs text-neutral-400 font-medium truncate">
            {secondaryText}
          </p>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMessage}
            className="p-3 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white transition-all active:scale-90"
          >
            <MessageCircle size={20} />
          </button>
          <div className="p-1 text-neutral-300">
            {showProfile ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Visualização de Perfil Expandida */}
      {showProfile && (
        <div className="px-4 pb-6 pt-2 animate-in slide-in-from-top-4 duration-300">
          <div className="h-[450px]">
            <Profile profile={match} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Match;
