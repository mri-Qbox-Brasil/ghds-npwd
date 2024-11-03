import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const BankStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: 'none',
    marginTop: theme.spacing(2.2),
    maxHeight: '720px',
    overflowY: 'scroll',
    zIndex: '0',
  },
  overlay: {
    position: 'fixed',
    textAlign: 'center',
    borderRadius: '20px',
    top:80,
    left: 50,
    width: '400px',
    height: '790px',
    maxHeight: '790px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300,
  },
  navBar: {
    color: '#000',
    position: 'relative',
    top: 18,
    height: '190px',
    background: theme.palette.primary.main,
    boxShadow: 'inset 0px 48px 28px -5px rgba(255,255,255,0.2)',
    zIndex: -1,
  },

  currency: {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontWeight: '600',
    color: '#fff',
  },
  balanceText: {
    fontFamily: 'Noto Sans JP, sans-serif',
    display: 'flex',
    color: '#fff',
  },
  balanceTitle: {
    position: 'absolute',
    fontFamily: 'Noto Sans JP, sans-serif',
    top: 88,
    left: 25,
    color: '#fff',
    fontWeight: '400',
  },
}));
