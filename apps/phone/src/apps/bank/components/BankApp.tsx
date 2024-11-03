import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Route, Switch, useHistory } from 'react-router-dom';
import { BankStyles } from '../styles';
import Home from './Home';
import { BankThemeProvider } from '../providers/BankThemeProvider';
import BankProfile from './BankProfile';

const BankApp: React.FC = () => {
  const classes = BankStyles();
  const history = useHistory();
  const theme = useTheme();

  return (
    <BankThemeProvider>
 
        <Home></Home>
 
    </BankThemeProvider>
  );
};

export default BankApp;
