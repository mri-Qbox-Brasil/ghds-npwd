import React, { useEffect, useState } from 'react';
import { Router, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';
import { Box, styled } from '@mui/material';

const HomeButton = styled(Box)`
  width: 145px;
  height: 6px;
  background-color: #363636;
  border-radius: 0.5rem;
  position: fixed;
  top: 882px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  z-index: 1000;

  &:hover{
    background-color: #0a0a0a;
  }
`

export const Navigation: React.FC = () => {
  const [isVisible, setisVisible] = useState(true)
  const history = useHistory();
  const { isExact } = useRouteMatch('/');
  const { closePhone } = usePhone();
  const location = useLocation();

  // const handleGoBackInHistory = () => {
  //   history.goBack();
  // };

  const handleGoToMenu = () => {
    if (isExact) return;
    history.push('/');
  };

  useEffect(() => {
    if(location.pathname == '/') {
      setisVisible(false)
    } else {
      setisVisible(true)
    }

  }, [location.pathname])
  
  return (
    <>
      { isVisible &&
        <button className="text-black hover:dark:text-neutral-900 h-2 w-full hover:text-neutral-900 " onClick={handleGoToMenu}>
        <HomeButton />
        </button>
      }
        
        {/* <button onClick={handleGoToMenu}>
          <Circle className="text-neutral-400 hover:dark:text-neutral-100 h-6 w-6 hover:text-neutral-900 " />
        </button>
        <button onClick={handleGoBackInHistory}>
          <ChevronLeft className="text-neutral-400 hover:dark:text-neutral-100 hover:text-neutral-900 h-6 w-6" />
        </button> */}
    </>
  );
};
