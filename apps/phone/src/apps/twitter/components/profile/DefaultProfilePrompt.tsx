import React from 'react';
import { useTranslation } from 'react-i18next';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';
import { cn } from '@utils/cn';
import { UserCheck } from 'lucide-react';

interface DefaultProfilePromptProps {
  handleUpdate: () => void;
  profileName: string;
  setProfileName: (name: string) => void;
  defaultProfileNames: string[];
}

export const DefaultProfilePrompt: React.FC<DefaultProfilePromptProps> = ({
  profileName,
  setProfileName,
  handleUpdate,
  defaultProfileNames,
}) => {
  const [t] = useTranslation();

  return (
    <div className="relative w-full h-full p-6 flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center gap-2 mb-4">
        <div className="h-16 w-16 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 mb-2 shadow-inner">
          <UserCheck size={32} />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          {t('TWITTER.EDIT_DEFAULT_PROFILE_NAME')}
        </h2>
        <p className="text-sm text-neutral-400 font-medium">
          Escolha um dos nomes disponíveis para começar a twittar.
        </p>
      </div>

      <div className="space-y-3 flex-1">
        {defaultProfileNames.map((name) => (
          <button
            key={name}
            onClick={() => setProfileName(name)}
            className={cn(
              "w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between group active:scale-[0.98]",
              profileName === name
                ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold shadow-md shadow-sky-500/10"
                : "border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 hover:border-neutral-200"
            )}
          >
            <span>{name}</span>
            <div className={cn(
              "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
              profileName === name ? "border-sky-500 bg-sky-500" : "border-neutral-300 dark:border-neutral-700"
            )}>
              {profileName === name && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <button
          disabled={!profileName}
          onClick={handleUpdate}
          className="w-full h-14 bg-sky-500 hover:bg-sky-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-sky-500/30 transition-all active:scale-95"
        >
          Criar Perfil
        </button>
      </div>
    </div>
  );
};

export default DefaultProfilePrompt;
