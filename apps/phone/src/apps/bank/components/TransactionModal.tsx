import React, { useRef, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { UserCircle, Banknote } from 'lucide-react';
import fetchNui from '@utils/fetchNui';

const useStyles = makeStyles((theme) => ({
  overlay: {
    position: 'fixed',
    textAlign: 'center',
    borderRadius: '42px',
    top: 73,
    left: 50,
    width: '400px',
    height: '827px',
    maxHeight: '827px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300,
  },
  modalBox: {
    backgroundColor: 'rgb(64, 192, 87)',
    padding: theme.spacing(3),
    borderRadius: '20px',
    width: '350px',
    maxWidth: '400px',
    height: '398px',
    boxShadow: 'inset 0px 68px 38px -5px rgba(255,255,255,0.2)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'Noto Sans JP, sans-serif',
  },
  title: {
    color: '#fff',
    fontFamily: 'Noto Sans JP, sans-serif',
  },
  modalInput: {
    backgroundColor: 'transparent',
    borderRadius: '4px',
    fontFamily: 'Noto Sans JP, sans-serif',
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      boxShadow: 'inset 0px 68px 28px -5px rgba(255,255,255,0.2)',
      backgroundColor: '#4f4f4f',
    },
  },
  closeButton: {
    backgroundColor: '#ff0000',
    color: '#fff',
    '&:hover': {
      boxShadow: 'inset 0px 68px 28px -5px rgba(255,255,255,0.2)',
      backgroundColor: '#e60000',
    },
  },
  buttonContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    width: '100%',
  },
}));

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const [passaporte, setPassaporte] = useState('');
  const [valor, setValor] = useState('');

  const handleTransfer = () => {
    const data = {
      id: passaporte,
      amount: parseFloat(valor),
      method: "id"
    };

    fetchNui('ps-banking:server:transferMoney', data)
      .then((response) => {
        if (response.success) {
          console.log('Transferência realizada:', response.message);
        } else {
          console.warn('Erro na transferência:', response.message);
        }
      })
      .catch((error) => {
        console.error('Erro no envio:', error);
      });
  };

  if (!open) return null;

  return (
    <Box className={classes.overlay}>
      <Box className={classes.modalBox} onClick={(e) => e.stopPropagation()}>
        <Typography className={classes.title}>Enviar Dinheiro</Typography>
        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            <Typography fontSize={16} color={'#fff'} fontFamily={'Noto Sans JP, sans-serif'}>Passaporte</Typography>
          </InputLabel>
          <Input
            placeholder="XYZ456"
            className={classes.modalInput}
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <UserCircle />
              </InputAdornment>
            }
            value={passaporte}
            onChange={(e) => setPassaporte(e.target.value)}
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            <Typography fontSize={16} color={'#fff'} fontFamily={'Noto Sans JP, sans-serif'}>Valor</Typography>
          </InputLabel>
          <Input
            type='number'
            placeholder="1500"
            className={classes.modalInput}
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <Banknote />
              </InputAdornment>
            }
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </FormControl>
        <Box className={classes.buttonContainer}>
          <Button
            variant="outlined"
            type="submit"
            fullWidth
            onClick={handleTransfer}
            className={classes.button}
          >
            Confirmar
          </Button>
          <Button variant="outlined" fullWidth onClick={onClose} className={classes.closeButton}>
            Fechar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionModal;
