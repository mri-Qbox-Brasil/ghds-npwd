import React, { memo } from 'react';
import data from 'emoji-mart/data/google.json';

import { NimblePicker } from 'emoji-mart';

export const EmojiSelect = ({ visible, onEmojiClick }) => {
  if (!visible) return null;

  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="w-full flex justify-center py-2">
      <NimblePicker
        data={data}
        onClick={onEmojiClick}
        set="google"
        theme={isDarkMode ? 'dark' : 'light'}
        showPreview={false}
        width="100%"
      />
    </div>
  );
};

export default memo(EmojiSelect); // The picker is an expensive render
