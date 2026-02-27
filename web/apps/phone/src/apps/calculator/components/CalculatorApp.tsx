import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { Calculator } from './Calculator';

export const CalculatorApp: React.FC = () => {
  return (
    <AppWrapper className="bg-black">
      <AppContent className="p-0 h-full bg-black">
        <Calculator />
      </AppContent>
    </AppWrapper>
  );
};
