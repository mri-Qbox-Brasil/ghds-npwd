import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '580px', 
    overflowY: 'auto',
    width: '100% !important',
    backgroundColor: theme.palette.background.default,
    padding: '10px', 
    borderRadius: '10px', 
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
  },
  conversationItem: {
    padding: '15px 10px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.3s',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child': {
      borderBottom: 'none', 
    },
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%', 
    marginRight: '10px',
  },
  messageInfo: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontSize: '16px',
    fontWeight: 500,
    color: theme.palette.text.primary, 
  },
  lastMessage: {
    fontSize: '14px',
    color: theme.palette.text.secondary, 
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis', 
  },
  timeStamp: {
    fontSize: '12px',
    color: theme.palette.text.disabled,
  },
}));

export default useStyles;
