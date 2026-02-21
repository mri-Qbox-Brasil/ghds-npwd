import React from 'react';

interface IProps {
  text: string;
}

function PageText({ text }: IProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center px-6 pt-12 space-y-4">
      <div className="text-4xl opacity-30">✨</div>
      <h2 className="text-xl font-bold text-pink-500 dark:text-pink-400">
        {text}
      </h2>
    </div>
  );
}

export default PageText;
