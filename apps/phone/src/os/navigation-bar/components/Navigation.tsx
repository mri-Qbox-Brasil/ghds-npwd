import React, { useEffect, useState } from 'react';
import { Router, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';

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
    if (location.pathname == '/') {
      setisVisible(false)
    } else {
      setisVisible(true)
    }

  }, [location.pathname])

  return (
    <>
      {isVisible &&
        <button
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] cursor-pointer appearance-none bg-transparent border-none p-2"
          onClick={handleGoToMenu}
        >
          <div className="w-[145px] h-[5px] bg-neutral-900 dark:bg-neutral-100 rounded-[0.5rem] shadow-[0_1px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.5)] transition-colors duration-200" />
        </button>
      }
    </>
  );
};
