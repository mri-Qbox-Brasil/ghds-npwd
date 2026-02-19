import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    zIndex: 20,
    position: 'absolute',
    height: '115%',
    width: '100%',
    background: theme.palette.mode === 'dark' ? 'black' : 'white', // Branco no modo claro, preto no modo escuro
    top: '-10%',
    paddingTop: '25%',
  },
  input: {
    marginBottom: 20,
    background: theme.palette.mode === 'dark' ? 'black' : 'white', // Branco no modo claro, preto no modo escuro
  },
  inputPropsTitle: {
    fontSize: 28,
  },
  inputPropsContent: {
    fontSize: 20,
    lineHeight: 1.2,
  },
  absoluteLeft: {
    position: 'absolute',
    left: theme.spacing(4),
    bottom: theme.spacing(6.5),
  },
  absoluteRight: {
    position: 'absolute',
    right: theme.spacing(4),
    bottom: theme.spacing(6.5),
  },
  button: {
    backgroundColor: 'transparent',
    boxShadow: 'none', // Remove sombra
    color: '#ccc',
    fontSize: '24px',
    '&:hover': {
      cursor: 'default',
    },
  },
}));

export default useStyles;
