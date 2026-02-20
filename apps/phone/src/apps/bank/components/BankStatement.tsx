import React, { useEffect, useState } from 'react';
import {
  Paper,
  CircularProgress,
  Button,
  Avatar,
  Modal,
  TextField,
  Typography,
  useTheme,
  Box,
  Grid,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import fetchNui from '@utils/fetchNui';
import AnimationStyles from '../animations';
import { UserCircle } from 'lucide-react';
import TransactionModal from './TransactionModal';


interface Transaction {
  id: number;
  amount: number;
  targetName: string;
  identifier: string;
  date: any;
  type: 'sent' | 'received';
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '397px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#f2f2f7',
    padding: theme.spacing(3),
    borderRadius: '20px',
    boxShadow: 'none',
    color: theme.palette.mode === 'dark' ? '#f2f2f7' : '#000',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  buttonLeft: {
    fontSize: '1rem',
    height: '40px',
    width: '180px',
    fontWeight: '600',
    borderRadius: '20px 0px 0px 20px',
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      boxShadow: 'inset 0px 68px 28px -5px rgba(255,255,255,0.2)',

      backgroundColor: '#4f4f4f'
    },
    fontFamily: 'Noto Sans JP, sans-serif',
  },
  buttonRight: {
    fontSize: '1rem',
    height: '40px',
    width: '180px',
    fontWeight: '600',
    borderRadius: '0px 20px 20px 0px',
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      boxShadow: 'inset 0px 68px 28px -5px rgba(255,255,255,0.2)',
      backgroundColor: '#4f4f4f'
    },
    fontFamily: 'Noto Sans JP, sans-serif',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: 'Noto Sans JP, sans-serif',


  },
  list: {
    width: '100%',
    minHeight: '600px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    height: '65px',
    margin: theme.spacing(1, 0),
    fontSize: '4px',
    fontFamily: 'Noto Sans JP, sans-serif',


  },
  avatar: {
    height: '40px',
    width: '40px'
  },
  transactionDetails: {
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    marginLeft: theme.spacing(1),

  },
  amount: {
    width: '140px',
    position: 'absolute',
    left: 240
  },
  amountText: {
    fontWeight: '400',
    fontFamily: 'Noto Sans JP, sans-serif',

  },
  modal: {
    position: 'absolute',
    width: '300px',
    top: '50%',
    left: '70%',
    transform: 'translate(-50%, -50%)',
    color: theme.palette.primary.main,
    backgroundColor: '#161616',
    padding: theme.spacing(3),
    borderRadius: '8px',
    border: '1px solid ' + theme.palette.primary.main,
  },
  modalInput: {
    color: 'red'
  },
  balanceAd: {
    fontFamily: 'Noto Sans JP, sans-serif',
    display: 'flex',
    color: 'red',
    fontWeight: '400',
    marginBottom: theme.spacing(4)
  },
}));

const mockTransactions: Transaction[] = [
  { id: 1, amount: 19251500, targetName: 'Lucas Mendes', identifier: 'ABC123', date: '2022/08/13', type: 'received' },
  { id: 2, amount: 250.00, targetName: 'Paula Soares', identifier: 'XYZ456', date: '2022/08/13', type: 'sent' },
  { id: 3, amount: 1250.75, targetName: 'Carlos Alberto', identifier: 'LMN789', date: '2022/08/13', type: 'received' },
  { id: 4, amount: 5000.00, targetName: 'Renata Martins', identifier: 'OPQ012', date: '2022/08/13', type: 'sent' },
  { id: 5, amount: 780.30, targetName: 'Gabriel Souza', identifier: 'DEF345', date: '2022/08/13', type: 'received' },
  { id: 6, amount: 920.10, targetName: 'Sandra Lima', identifier: 'GHI678', date: '2022/08/13', type: 'sent' },
  { id: 7, amount: 300.00, targetName: 'Felipe Rocha', identifier: 'JKL901', date: '2022/08/13', type: 'received' },
  { id: 8, amount: 1114500.00, targetName: 'Paulin da Motoca Empinada', identifier: 'MNO234', date: '2022/08/13', type: 'sent' },
  { id: 9, amount: 1850.75, targetName: 'Ricardo Pinto', identifier: 'PQR567', date: '2022/08/13', type: 'received' },
  { id: 10, amount: 215.00, targetName: 'Júlia Machado de Melo', identifier: 'STU890', date: '2022/08/13', type: 'sent' }
];


const BankStatement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const classes = useStyles();
  const animationClasses = AnimationStyles();

  const fc = {
    numberFormat: (value: number) =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
        .format(value)
        .replace(',00', ''),

    fetchTransactions: async () => {
      setLoading(true);
      await fetchNui('getTransactionsFromClient')
        .then((result) => {
          if (result) {
            setTransactions(result);
          } else {
            setTransactions(mockTransactions)
            console.error('Erro ao obter dados do player fetch getTransactionsFromClietn');
          }
        })
        .catch((error) => {
          console.error('Erro no envio:', error);
        })
        .finally(() => {
          setLoading(false);
        }
        )
    },
  };

  useEffect(() => {
    fc.fetchTransactions();
  }, []);

  return (
    <Paper className={classes.root}>
      <Box className={classes.header}>

        <Button className={classes.buttonLeft} onClick={() => setOpenModal(true)}>
          TRANSFERIR
          <TransactionModal open={openModal} onClose={() => setOpenModal(false)} />

        </Button>
        <Button className={classes.buttonRight}>
          RECEBER
        </Button>
      </Box>
      <Typography className={classes.title}>Últimas Transferências</Typography>
      <Typography fontSize={12} fontFamily={'Noto Sans JP'} className={classes.balanceAd}>
        Visite uma de nossas agências para acessar contas de ORG
      </Typography>
      {loading ? (
        <Box className={classes.list}><CircularProgress color='primary' /></Box>
      ) : (
        <Box className={classes.list}>
          {transactions.map((transaction) => (
            <Grid
              container
              key={transaction.id}
              className={classes.listItem}
              style={{
                background: transaction.type === 'sent'
                  ? `linear-gradient(360deg, rgba(255, 0, 0, ${theme.palette.mode === 'dark' ? 0.336 : 0.336}), rgba(255, 0, 0, ${theme.palette.mode === 'dark' ? 0.436 : 0.2}))`
                  :
                  `linear-gradient(360deg, rgba(64, 192, 87, ${theme.palette.mode === 'dark' ? 0.336 : 0.336}), rgba(64, 192, 87, ${theme.palette.mode === 'dark' ? 0.436 : 0.2}))`,
              }}
            >
              <Grid item>
                <UserCircle className={classes.avatar} />
              </Grid>

              <Grid item className={classes.transactionDetails}>
                <Typography fontSize={14} fontFamily={'Noto Sans JP, sans-serif'} fontWeight={'700'}>
                  {transaction.targetName}
                </Typography>
                <Typography fontSize={11} fontFamily={'Noto Sans JP, sans-serif'}>
                  {transaction.date} - {transaction.identifier}
                </Typography>
              </Grid>

              <Grid item className={classes.amount}>
                <Typography
                  className={classes.amountText}
                  sx={{
                    display: 'flex ',
                    justifyContent: 'start',
                    color: transaction.type === 'sent' ? '#ff0000' : '#40c057',
                  }}
                >
                  {transaction.type === 'sent' ? `- ${fc.numberFormat(transaction.amount)}` : `+ ${fc.numberFormat(transaction.amount)}`}
                </Typography>
              </Grid>
            </Grid>
          ))}

        </Box>
      )}



    </Paper>
  );
};

export default BankStatement;
