import React from 'react';
import img from '../../../../../../src/apps/imgs/message.png'

import { MessageSquare } from 'lucide-react';
import { Box, styled } from '@mui/material';

const MessagesIconStyle = styled(Box)`
  border-radius: 18px;
  box-shadow: rgba(0, 0, 0, 0.00) 0px 1px 3px 0px, rgba(27, 31, 35, 0.00) 0px 0px 0px 2px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    z-index: 20;
    transform: scale(1.05);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 12px;
  }
`

const MessagesIcon: React.FC = () => <MessagesIconStyle><img src={img} width={100} alt="" /></MessagesIconStyle>;

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="ios-message">
<defs>
  <linearGradient id="a" x1="60" x2="60" y2="120" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#5cf777"></stop>
    <stop offset="1" stop-color="#0dbc29"></stop>
  </linearGradient>
</defs>
<rect width="120" height="120" fill="url(#a)" rx="26"></rect>
<path fill="#fefefe" d="M60.51 21.51c-24.3 0-44 16.12-44 36 0 12.64 8 23.75 20 30.17a2 2 0 0 1 1 2.46 18 18 0 0 1-5.55 7.3 1 1 0 0 0 .81 1.76 35.84 35.84 0 0 0 14.54-6 3.92 3.92 0 0 1 3.07-.71 53.51 53.51 0 0 0 10.15 1c24.3 0 44-16.12 44-36S84.81 21.51 60.51 21.51Z"></path>
</svg>; */}


export default MessagesIcon;
