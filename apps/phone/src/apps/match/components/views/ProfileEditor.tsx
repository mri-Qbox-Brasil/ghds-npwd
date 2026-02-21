import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader';
import ProfileForm from '../profile/ProfileForm';
import { useProfile } from '../../hooks/useProfile';
import { cn } from '@utils/cn';

function ProfileEditor() {
  const { profile, noProfileExists } = useProfile();
  const [t] = useTranslation();
  const [showPreview, setShowPreview] = useState(false);

  const toggleSwitch = () => {
    setShowPreview((preview) => !preview);
  };

  if (!profile && !noProfileExists) return <Loader />;

  return (
    <div className="h-full w-full flex flex-col bg-background animate-in fade-in duration-500">
      {/* Header / Toggle Section */}
      <div className="px-6 pt-6 pb-2">
        <label className="flex items-center justify-between p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 cursor-pointer transition-all active:scale-[0.98]">
          <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
            {t<string>('MATCH.EDIT_PROFILE_PREVIEW')}
          </span>
          <div
            onClick={toggleSwitch}
            className={cn(
              "w-12 h-6 rounded-full relative transition-all duration-300",
              showPreview ? "bg-primary shadow-lg shadow-primary/20" : "bg-neutral-300 dark:bg-neutral-700"
            )}
          >
            <div className={cn(
              "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm",
              showPreview ? "translate-x-6" : "translate-x-0"
            )} />
          </div>
        </label>
      </div>

      <div className="flex-grow overflow-hidden">
        <ProfileForm showPreview={showPreview} profile={profile} />
      </div>
    </div>
  );
}

export default ProfileEditor;
