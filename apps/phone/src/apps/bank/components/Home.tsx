import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Route, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoWhite from '../../imgs/fleeca-bank/fleeca-bank.webp';
import logoDark from '../../imgs/fleeca-bank/fleeca-bank.webp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { DotIcon } from 'lucide-react';
import fetchNui from '@utils/fetchNui';
import BankStatement from './BankStatement';
import { BankStyles } from '../styles';
import UserProfile from './BankProfile';
import BankProfile from './BankProfile';

const Home: React.FC = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState<number>(21500000);

  const fc = {
    /**
     * Fetch player data from server, and update the state with the balance.
     * The server will return an object with the player's name and balance.
     * If the data is valid, it will be logged to the console, and the state will be updated.
     * If there is an error, it will be logged to the console.
     * @returns {Promise<void>}
     */
    fetchPlayerData: async () => {
      try {
        const result = await fetchNui('getBankCredentials');
        
        if (result && result.balance !== undefined) {
          setBalance(result.balance);
        } else {
          console.error('Erro ao obter dados do player');
        }
      } catch (error) {
        console.error('Erro ao chamar o callback para receber dados do player:', error);
      }

      //  finally {
      //   setLoading(false)
      // }
    },

    // TODO OPERAÇÕES DE TRANSAÇÃO
    // addUserToAccount: async (accountId: string, userId: string) => {
    //   try {
    //     const response = await fetchNui<{ success: boolean; message?: string; userName?: string }>(
    //       'ps-banking:client:addUserToAccount',
    //       {
    //         accountId,
    //         userId,
    //       },
    //     );

    //     if (response && response.success) {
    //       console.log(`Usuário ${response.userName} adicionado com sucesso à conta.`);
    //     } else {
    //       console.log(`Erro ao adicionar usuário à conta: ${response?.message}`);
    //     }
    //   } catch (error) {
    //     console.error('Erro ao chamar o callback para adicionar usuário à conta:', error);
    //   }
    // },

    // depositToAccount: async (accountId: string, amount: number) => {
    //   try {
    //     const response = await fetchNui<{ success: boolean }>(
    //       'ps-banking:client:depositToAccount',
    //       {
    //         accountId,
    //         amount,
    //       },
    //     );

    //     if (response && response.success) {
    //       console.log('Depósito realizado com sucesso!');
    //     } else {
    //       console.log('Erro ao realizar o depósito');
    //     }
    //   } catch (error) {
    //     console.error('Erro ao chamar o callback de depósito:', error);
    //   }
    // },

    // handleDeposit: () => {
    //   const accountId = '123456'; // Exemplo de ID de conta
    //   const amount = 1000; // Exemplo de valor para depósito
    //   fc.depositToAccount(accountId, amount); // Chama a função de depósito
    //   console.log('valor depositado', amount, 'para o id', accountId);
    // },

    numberFormat: (value: number) =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
        .format(value)
        .replace('R$', '')
        .trim(),
  };

  const classes = BankStyles();
  const history = useHistory();
  // const [t] = useTranslation(); // TODO ADD LOCALE
  const theme = useTheme();

  useEffect(() => {
    fc.fetchPlayerData();
  }, []);

  return (

    <Grid container className={classes.root} sx={{ width: '100%' }}>
      <Grid container className={classes.navBar} sx={{ width: '100%' }}>
        <Grid item mt={1.5} ml={1} mr={25} sx={{ width: '100px', height: '35px' }}>
          <img
            src={theme.palette.mode == 'dark' ? logoDark : logoWhite}
            width={100}
            height={100}
            alt="Bank Icon"
          />
        </Grid>

        <Grid item mt={1}>
          <IconButton onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>

          <IconButton onClick={() => console.log('clicado userprofile')}>
            <AccountCircleIcon />
          </IconButton>
        </Grid>
        <Grid item fontSize={16} className={classes.balanceTitle}>
          Saldo Conta Pessoal
        </Grid>
        <Grid item ml={3.5}>
          <Typography fontSize={16} mt={6.2} className={classes.currency}>
            R$
          </Typography>
        </Grid>

        <Grid item mt={2.5}>
          <Typography fontSize={44} mt={1.5} className={classes.balanceText}>
            {showBalance
              ? `${fc.numberFormat(balance)}`
              : Array(8)
                  .fill(8)
                  .map((_, index) => (
                    <Box key={index} style={{ marginRight: '-28px', flexDirection: 'row' }}>
                      <DotIcon size={50} />
                    </Box>
                  ))}
          </Typography>
        </Grid>
      </Grid>
  
      <Grid item>
        
        <BankStatement></BankStatement>
     
      </Grid>
    </Grid>
  );
};

export default Home;

// TODO MOCK FULL
// InjectDebugData<any>(
//   [
//     {
//       app: 'BANK',
//       method: BankEvents.SEND_NOTIFICATION,
//       data: {
//         appId: 'TWITTER',
//         profile_id: 423443442,
//         profile_name: 'Chip',
//         isMine: false,
//         isLiked: false,
//         retweetId: '',
//         isRetweet: false,
//         seconds_since_tweet: 1639,
//         retweetProfileName: '',
//         retweetAvatarUrl: '',
//         isReported: false,
//         retweetIdentifier: '',
//         avatar_url: '',
//         id: 116,
//         message: 'Go is better! Here is why: Go is a statically typed, compiled language in the tradition of C, with memory safety, garbage collection, structural typing, and CSP-style concurrency. The compiler, tools, and source code are all free and open source.',
//         createdAt: '2021-12-01 00:42:03',
//         updatedAt: '2021-12-01 00:42:03',
//         identifier: '',
//         retweet: null,
//       },
//     },
//   ],
//   4000,
// );
