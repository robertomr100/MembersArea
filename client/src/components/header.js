import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, IconButton, Grid, Box } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { auth } from '../firebase';

import logoUrl from 'assets/header-logo.png';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: '4rem'
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: theme.palette.primary.dark
    },
    logoStyle: {
        width: 144,
        marginTop: 7
    },
}));

const Header = ({ setLoggedIn }) => {

    const classes = useStyles();

    const handleLogout = () => {
        auth.signOut();
        setLoggedIn(false);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ backgroundColor: 'white' }}>
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center">
                        <Grid item>
                            <img src={logoUrl} alt="Kleep" className={classes.logoStyle} />
                        </Grid>
                        <Grid item>
                            <Box mt={1}>
                                <Button color="primary" variant="outlined" onClick={handleLogout}>Logout</Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Toolbar>
            </AppBar>
        </div >
    );
}

export default Header;