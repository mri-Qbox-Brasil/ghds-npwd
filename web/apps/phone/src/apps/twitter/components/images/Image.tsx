import React from 'react';
import { X } from 'lucide-react';
import { PictureReveal } from '@ui/components/PictureReveal';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { NPWDButton } from '@npwd/keyos';

export const Image = ({ link, handleClick }) => {
  return (
    <div className="relative inline-block overflow-hidden rounded-lg group">
      {handleClick && (
        <NPWDButton
          onClick={handleClick}
          size="icon"
          variant="ghost"
          className="absolute right-1.5 top-1.5 z-10 h-7 w-7 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all opacity-80 hover:opacity-100"
        >
          <X size={16} />
        </NPWDButton>
      )}
      <PictureReveal>
        <PictureResponsive alt="tweet attachment" src={link} />
      </PictureReveal>
    </div>
  );
};

export default Image;
