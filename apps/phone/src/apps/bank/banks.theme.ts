import { green, common } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

// export const CONTACTS_APP_PRIMARY_COLOR = '#F45821';
export const CONTACTS_APP_PRIMARY_COLOR = '#40c057';
export const BANK_APP_TEXT_COLOR = common.white;

const theme: ThemeOptions = {

    typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
    },
    components: {
        MuiButton: {
          styleOverrides: {
            root: {
              backgroundImage: 'linear-gradient(360deg, rgba(255,255,255,0.2), rgba(0, 255, 0, 0.466))',
            },
          },
        },
      },

    //   transitions: {}

  palette: {
    primary: {
      main: CONTACTS_APP_PRIMARY_COLOR,
      dark: green[700],
      light: green[300],
      contrastText: BANK_APP_TEXT_COLOR,

    },
    secondary: {
      main: 'linear-gradient(160deg, rgba(255,255,255,1), rgba(0, 255, 0, 0.766))',
      light: '#eb4242',
      dark: '#941212',
      contrastText: BANK_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: BANK_APP_TEXT_COLOR,
    },
  },
};

export default theme;
