import React from 'react';
import MatchContainer from './MatchContainer';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const MatchApp = () => {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <MatchContainer />
    </React.Suspense>
  );
};

export default MatchApp;
