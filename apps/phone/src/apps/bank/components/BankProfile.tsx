import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => ({
root: {
    backgroundColor: 'red',
    color: 'red',
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

}

}))

const BankProfile: React.FC = () => {
    const classes = useStyles();

    return (
        <>
        <Box className={classes.root}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde totam neque quia pariatur, perspiciatis sequi fugit molestiae molestias odit. Officiis odit ex ea repudiandae nostrum! Nihil eius ad dicta quo.</Box>
        </>
    )
}

export default BankProfile;