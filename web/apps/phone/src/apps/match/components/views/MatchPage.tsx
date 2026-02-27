import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfiles } from '../../hooks/useProfiles';
import Loader from '../Loader';
import PageText from '../PageText';
import ActiveProfile from '../ActiveProfile';
import { useMatchActions } from '../../hooks/useMatchActions';

const MINIMUM_LOAD_TIME = 1250;

const MatchPage = () => {
  const [t] = useTranslation();
  const { profiles, error, activeProfile } = useProfiles();
  const { setViewed } = useMatchActions();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoaded(true);
    }, MINIMUM_LOAD_TIME);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSwipe = (id: number, liked: boolean) => {
    if (liked === null) return;
    setViewed(id, liked);
  };

  if (error) return <PageText text={t('MATCH.FEEDBACK.PROFILES_ERROR') as string} />;

  if (!loaded || !profiles) return <Loader />;

  if (!activeProfile) return <PageText text={t('MATCH.FEEDBACK.NO_PROFILES') as string} />;

  return (
    <div className="h-full w-full bg-white dark:bg-black overflow-hidden">
      <ActiveProfile profile={activeProfile} onSwipe={handleSwipe} />
    </div>
  );
};

export default MatchPage;
