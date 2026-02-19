import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { IoIosKeypad } from '@react-icons/all-files/io/IoIosKeypad';
import { AiOutlineUser } from '@react-icons/all-files/ai/AiOutlineUser';
import { AiOutlineHistory } from '@react-icons/all-files/ai/AiOutlineHistory';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent', 
    boxShadow: 'none', 
  },
  BottomNavigation: {
    backgroundColor: 'transparent',
    onClick: 'none',
  },
  icon: {
    width: '30px',
    height: '30px', 
    color: '#8e8e93', 
    marginBottom: '4px',
  },
  selectedIcon: {
    width: '30px',
    height: '30px', 
    color: '#007aff',
    marginBottom: '4px',
  },
  label: {
    fontSize: '8pt',
    color: '#8e8e93',
  },
  selectedLabel: {
    fontSize: '8pt !important',
    color: '#007aff',
    fontWeight: '500',
  },
}));

const DialerNavBar: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const [page, setPage] = useState(location.pathname); // Inicializa com o pathname atual
  const [t] = useTranslation();

  // Sincroniza o estado com a rota ativa
  useEffect(() => {
    setPage(location.pathname);
  }, [location]);

  const handleChange = (_e, newPage) => {
    setPage(newPage);
  };

  return (
    <BottomNavigation
      value={page}
      onChange={handleChange}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label={t('DIALER.NAVBAR_HISTORY')}
        value="/phone"
        component={NavLink}
        to="/phone"
        icon={
          <AiOutlineHistory
            className={page === '/phone' ? classes.selectedIcon : classes.icon}
          />
        }
        classes={{
          label: page === '/phone' ? classes.selectedLabel : classes.label,
        }}
      />
      <BottomNavigationAction
        label={t('DIALER.NAVBAR_DIAL')}
        value="/phone/dial"
        component={NavLink}
        to="/phone/dial"
        icon={
          <IoIosKeypad
            className={page === '/phone/dial' ? classes.selectedIcon : classes.icon}
          />
        }
        classes={{
          label: page === '/phone/dial' ? classes.selectedLabel : classes.label,
        }}
      />
      <BottomNavigationAction
        label={t('DIALER.NAVBAR_CONTACTS')}
        value="/phone/contacts"
        component={NavLink}
        to="/phone/contacts"
        icon={
          <AiOutlineUser
            className={page === '/phone/contacts' ? classes.selectedIcon : classes.icon}
          />
        }
        classes={{
          label: page === '/phone/contacts' ? classes.selectedLabel : classes.label,
        }}
      />
    </BottomNavigation>
  );
};

export default DialerNavBar;
