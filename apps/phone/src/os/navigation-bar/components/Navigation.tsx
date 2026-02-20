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
          className="fixed top-[882px] left-1/2 -translate-x-1/2 z-[1000] cursor-pointer appearance-none bg-transparent border-none p-0"
          onClick={handleGoToMenu}
        >
          <div className="w-[145px] h-[6px] bg-[#363636] rounded-[0.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-colors duration-200 hover:bg-[#0a0a0a]" />
        </button>
      }
    </>
  );
};
