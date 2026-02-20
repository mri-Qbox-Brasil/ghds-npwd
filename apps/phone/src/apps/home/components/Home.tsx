import React from 'react';
import { AppWrapper } from '@ui/components';
import { Box, styled } from '@mui/material';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { Link } from 'react-router-dom';

const BottomHomeButtons = styled(Box)`
  border-radius: 28px;
`;

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  return (
    <AppWrapper>
      <Box component="div" mt={3} px={1.6}>
        {apps && <GridMenu xs={3} items={[...apps, ...externalApps]} />}
      </Box>

      <div style={{ position: 'absolute', bottom: '8px', left: '4%', right: '4%' }}>
        <BottomHomeButtons
          className="h-24 w-full"
          style={{
            backdropFilter: 'blur(5px) saturate(180%)',
            WebkitBackdropFilter: 'blur(5px) saturate(180%)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '0.5px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {apps &&
            apps.slice(0, 4).map((app) => (
              <div className="float-left h-full w-1/4" key={app.id}>
                <div className="flex h-full w-full items-center justify-center">
                  <Link to={`${app.path}`} className="flex h-16 w-16 items-center justify-center">
                    {app.icon}
                  </Link>
                </div>
              </div>
            ))}
        </BottomHomeButtons>
      </div>
    </AppWrapper>
  );
};
