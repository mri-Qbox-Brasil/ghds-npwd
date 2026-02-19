import React from 'react';
import img from '../../../../../../src/apps/imgs/safari.png'
import Box from '@mui/material/Box';
import { styled } from '@mui/material';

const BrowserIconStyle = styled(Box)`
       border-radius: 18px;
  box-shadow: rgba(0, 0, 0, 0.00) 0px 1px 3px 0px, rgba(27, 31, 35, 0.00) 0px 0px 0px 2px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    z-index: 20;
    transform: scale(1.05);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 12px;
  }
`
const BrowserIcon: React.FC = () => <BrowserIconStyle><img src={img} width={100} alt="" /></BrowserIconStyle>;

export default BrowserIcon;
