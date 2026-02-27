import React from 'react';
import { useTranslation } from 'react-i18next';
import { Repeat } from 'lucide-react';

interface IProps {
  profileName: string;
}

function Retweet({ profileName }: IProps) {
  const [t] = useTranslation();
  return (
    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm font-medium mb-1 px-4">
      <Repeat size={14} />
      <span>{profileName} {t('TWITTER.RETWEETED') as unknown as string}</span>
    </div>
  );
}

export default Retweet;
