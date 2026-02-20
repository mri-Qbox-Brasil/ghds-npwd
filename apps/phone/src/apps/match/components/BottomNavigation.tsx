import React from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Flame, Users, User } from 'lucide-react';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export function MatchBottomNavigation({ activePage, handleChange }) {
  const classes = useStyles();

  return (
    <BottomNavigation value={activePage} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction component={Link} to="/match" icon={<Flame />} />
      <BottomNavigationAction component={Link} to="/match/matches" icon={<Users />} />
      <BottomNavigationAction component={Link} to="/match/profile" icon={<User />} />
    </BottomNavigation>
  );
}

export default MatchBottomNavigation;
