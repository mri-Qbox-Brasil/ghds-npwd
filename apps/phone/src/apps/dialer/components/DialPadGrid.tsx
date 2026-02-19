import React, { useContext } from 'react';
import { Box, Button, Grid, Typography, styled, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { DialInputCtx } from '../context/InputContext';

// Componente de botão personalizado
const CustomDialButton = styled(Button)<{ isDarkMode: boolean }>`
  border-radius: 100%;
  background-color: ${(props) => (props.isDarkMode ? '#4c4c4c' : '#e2e2e2')}; // Ajuste para cinza escuro no modo escuro
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 12px;
  margin-left: 52px;
  
  &:hover {
    background-color: ${(props) => (props.isDarkMode ? '#80808061' : '#80808061')}; // Cor de hover para ambos os temas
  }
`;

const useStyles = makeStyles((theme: Theme) => ({
  gridItem: {
    fontSize: '28pt',
    fontWeight: 'semi-bold',
    color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Verifica o modo do tema
    height: '80px',
    width: '80px',
  },
  letterText: {
    position: 'absolute',
    height: '5px',
    letterSpacing: '2px',
    bottom: 22,
    color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Verifica o modo do tema para as letras
  },
}));


interface ButtonItemProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label: string | number;
  letters: string;
  isDarkMode: boolean;
}

const ButtonItem: React.FC<ButtonItemProps> = ({ letters, label, onClick, isDarkMode }) => {
  const classes = useStyles();
  return (
    <Grid key={label} item xs={4}>
      <CustomDialButton className={classes.gridItem} onClick={onClick} isDarkMode={isDarkMode}>
        {label}
        <Typography className={classes.letterText} fontSize={12}>
          {letters}
        </Typography>
      </CustomDialButton>
    </Grid>
  );
};

export const DialGrid = () => {
  const { add, removeOne, clear } = useContext(DialInputCtx);
  const theme = useTheme(); // Hook para acessar o tema atual do Material UI
  const isDarkMode = theme.palette.mode === 'dark'; // Verifica se o tema atual é escuro

  return (
    <Box height="100%" width="80%">
      <Grid container justifyContent="space-around">
        <ButtonItem letters={''} label={1} onClick={() => add(1)} isDarkMode={isDarkMode} />
        <ButtonItem letters={'ABC'} label={2} onClick={() => add(2)} isDarkMode={isDarkMode} />
        <ButtonItem letters={'DEF'} label={3} onClick={() => add(3)} isDarkMode={isDarkMode} />
        <ButtonItem letters={'GHI'} label={4} onClick={() => add(4)} isDarkMode={isDarkMode} />
        <ButtonItem letters={'JKL'} label={5} onClick={() => add(5)} isDarkMode={isDarkMode} />
        <ButtonItem letters={'MNO'} label={6} onClick={() => add(6)} isDarkMode={isDarkMode} />
        <ButtonItem letters={'PQRS'} label={7} onClick={() => add(7)} isDarkMode={isDarkMode} />
        <ButtonItem letters={'TUY'} label={8} onClick={() => add(8)} isDarkMode={isDarkMode} />
        <ButtonItem letters={'WKYZ'} label={9} onClick={() => add(9)} isDarkMode={isDarkMode} />
        <ButtonItem letters={''} label="-" onClick={() => add('-')} isDarkMode={isDarkMode} />
        <ButtonItem letters={'+'} label={0} onClick={() => add(0)} isDarkMode={isDarkMode} />
        <ButtonItem letters={''} label="#" onClick={clear} isDarkMode={isDarkMode} />
      </Grid>
    </Box>
  );
};

export default DialGrid;
