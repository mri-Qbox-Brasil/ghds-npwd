import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartOff } from 'lucide-react';

function NoProfiles() {
  const [t] = useTranslation();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-700">
      <div className="mb-6 p-6 rounded-3xl bg-pink-50 dark:bg-pink-500/10 text-pink-500 shadow-inner">
        <HeartOff size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-2">
        {t('MATCH.FEEDBACK.NO_PROFILES')}
      </h2>
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 max-w-[200px]">
        Tente mudar seus filtros ou volte mais tarde para ver novas pessoas.
      </p>
    </div>
  );
}

export default NoProfiles;
