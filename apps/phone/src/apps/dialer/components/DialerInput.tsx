import React, { useContext } from 'react';
import { Box, IconButton, Paper, Typography, Link } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import PhoneIcon from '@mui/icons-material/Phone';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InputBase } from '@ui/components/Input';
import { useCall } from '@os/call/hooks/useCall';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  input: {
    flex: 1,
    fontSize: '24px', 
    fontWeight: 400,  
    textAlign: 'center',
    marginBottom: theme.spacing(0), 
  },
  addNumberLink: {
    position: 'absolute',
    fontSize: '16px',
    top: theme.spacing(13),
    color: '#007AFF', 
    textDecoration: 'none',
    marginBottom: theme.spacing(3),
    '&:hover': {
      // textDecoration: 'underline',
    },
  },
  absolute: {
    backgroundColor: '#31C75C',
    color: 'white',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '80%',
    left: '50%',
    height: '80px',
    width: '80px',
    zIndex: 10,
    '&.Mui-disabled': {
      backgroundColor: theme.palette.mode === 'dark' ? '#4c4c4c' : '#AAA',
      color: '#fff !important',
    },
    '&:hover': {
      backgroundColor: '#26e35c',
    },
  },
}));

export const DialerInput: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [t] = useTranslation();
  const { initializeCall } = useCall();

  const { inputVal, set } = useContext<IDialInputCtx>(DialInputCtx);

  const handleCall = (number: string) => {
    initializeCall(number);
  };

  const handleNewContact = (number: string) => {
    history.push(`/contacts/-1/?addNumber=${number}&referal=/phone/contacts`);
  };

  return (
    <Box component={Paper} className={classes.root}>
      <InputBase
        placeholder={t('DIALER.INPUT_PLACEHOLDER')}
        className={classes.input}
        value={inputVal}
        onChange={(e) => set(e.target.value)}
        inputProps={{
          style: { textAlign: 'center' } // Centralizando o texto do número
        }}
      />
      {inputVal && (
        <Link
          className={classes.addNumberLink}
          onClick={() => handleNewContact(inputVal)}
          component="button"
        >
          {t('CONTACTS.MODAL_BUTTON_ADD')}
        </Link>
      )}
      <IconButton
        className={classes.absolute}
        disabled={inputVal <= ''}
        onClick={() => handleCall(inputVal)}
        size="large"
      >
        <PhoneIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};
