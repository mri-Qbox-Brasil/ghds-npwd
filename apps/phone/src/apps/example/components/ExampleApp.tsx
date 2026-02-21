import React from 'react';
import { useExampleStringValue } from '../hooks/state';
import { useApp } from '@os/apps/hooks/useApps';

export const ExampleApp: React.FC = () => {
  const exampleString = useExampleStringValue();

  const example = useApp('EXAMPLE');

  return (
    <div className="h-full w-full p-4 flex flex-col items-center gap-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Welcome to NPWD!</h1>
      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
        {example.id}
      </button>
      {/* Here we are using the value in a h3 tag */}
      <h3 className="text-lg font-medium text-neutral-500">{exampleString}</h3>
    </div>
  );
};
