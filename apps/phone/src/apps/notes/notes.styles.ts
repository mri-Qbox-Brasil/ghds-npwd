import { Opacity } from '@mui/icons-material';
import shadows from '@mui/material/styles/shadows';
import makeStyles from '@mui/styles/makeStyles';
import { Pointer } from 'lucide-react';

const useStyles = makeStyles((theme) => ({
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  absolute: {
    position: 'absolute',
    right: theme.spacing(4),
    bottom: theme.spacing(2.0),
    zIndex: 1,
  },
  button: {
    backgroundColor: 'transparent',
    boxShadow: 'none', // Remove sombra
    color: theme.palette.primary.main,
    fontSize: '24px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default useStyles;
