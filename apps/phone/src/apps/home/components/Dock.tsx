import React from 'react';
import { Box, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppIcon } from '@ui/components';

const BottomHomeButtons = styled(Box)`
  border-radius: 28px;
  backdrop-filter: blur(5px) saturate(180%);
  -webkit-backdrop-filter: blur(5px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.15);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 10px;
`;

interface DockProps {
    apps: any[];
}

export const Dock: React.FC<DockProps> = ({ apps }) => {
    if (!apps || apps.length === 0) return null;

    return (
        <div style={{ position: 'absolute', bottom: '8px', left: '4%', right: '4%' }}>
            <BottomHomeButtons className="h-24 w-full">
                {apps.map((app) => (
                    <Link key={app.id} to={app.path} style={{ textDecoration: 'none' }}>
                        <AppIcon {...app} isDockItem={true} />
                    </Link>
                ))}
            </BottomHomeButtons>
        </div>
    );
};
