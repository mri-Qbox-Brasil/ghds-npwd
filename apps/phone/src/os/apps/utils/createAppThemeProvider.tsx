import React from 'react';

export function createAppThemeProvider(_theme: any = {}) {
  return ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        {children}
      </>
    );
  };
}
