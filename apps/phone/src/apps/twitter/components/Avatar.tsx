import React, { useState } from 'react';
import { usePhone } from '@os/phone/hooks/usePhone';
import { IMG_DEFAULT_AVATAR, IMG_INVALID_AVATAR } from '../utils/constants';
import { cn } from '@utils/cn';
import { User } from 'lucide-react';

interface AvatarProps {
  avatarUrl?: string | null;
  showInvalidImage?: boolean;
  height?: string | number;
  width?: string | number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  avatarUrl,
  showInvalidImage = false,
  height = '48px',
  width = '48px',
  className
}) => {
  const [showImageError, setShowImageError] = useState(false);
  const { ResourceConfig } = usePhone();

  const handleImageError = () => setShowImageError(true);
  const handleImageLoad = () => setShowImageError(false);

  if (!ResourceConfig || !ResourceConfig.twitter.enableAvatars) return null;

  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl shrink-0 bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-800", className)}
      style={{ height, width }}
    >
      {(showImageError || !avatarUrl) ? (
        <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-neutral-800">
          <User size={Math.min(parseInt(String(width)) * 0.6, 24)} />
        </div>
      ) : (
        <img
          src={avatarUrl}
          alt="Avatar"
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            showImageError ? 'opacity-0' : 'opacity-100'
          )}
        />
      )}
    </div>
  );
}

export default Avatar;
