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
    <div className="h-full w-full flex flex-col bg-white dark:bg-black">
      {/* Toggle */}
      <div className="px-4 pt-4 pb-2">
        <div
          onClick={toggleSwitch}
          className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 cursor-pointer active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors"
        >
          <span className="text-[14px] font-medium text-neutral-600 dark:text-neutral-400">
            {t<string>('MATCH.EDIT_PROFILE_PREVIEW')}
          </span>
          <div
            className={cn(
              "w-[51px] h-[31px] rounded-full relative transition-all duration-300",
              showPreview ? "bg-pink-500" : "bg-neutral-300 dark:bg-neutral-600"
            )}
          >
            <div className={cn(
              "absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white transition-all duration-300 shadow-sm",
              showPreview ? "translate-x-5" : "translate-x-0"
            )} />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <ProfileForm showPreview={showPreview} profile={profile} />
      </div>
    </div>
  );
}

export default ProfileEditor;
