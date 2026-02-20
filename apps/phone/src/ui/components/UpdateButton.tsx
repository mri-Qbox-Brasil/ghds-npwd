import React from 'react';
import { UploadCloud } from 'lucide-react'; // Equivalente ao PublishIcon
import { Button } from './ui/button';
import { cn } from '@utils/css';

interface ProfileUpdateButtonProps {
  handleClick: () => void;
}

export const ProfileUpdateButton: React.FC<ProfileUpdateButtonProps> = ({ handleClick }) => {
  return (
    <div className="absolute bottom-[15px] right-[15px] z-50">
      <Button 
        variant="default"
        size="icon"
        onClick={handleClick}
        className="h-14 w-14 rounded-full shadow-lg"
      >
        <UploadCloud className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ProfileUpdateButton;
