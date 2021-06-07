import React from 'react';
import { Container, Grid, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';

import logoUrl from 'assets/footer-logo.png';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'fixed'
    },
    bacgroundColorBlack: {
        backgroundColor: '#242424',
        paddingBottom: 75,
        color: 'white',
        marginTop: '5rem'
    },
    Margin: {
        marginTop: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 5,
    },
    logoStyle: {
        width: 144,
    },
    facebookIconStyle: {
        color: '#1877f2',
        cursor: 'pointer'
    },
    instragramIconStyle: {
        color: '#8a3ab9',
        cursor: 'pointer'
    }

}));

const Footer = () => {

    const classes = useStyles();

    return (
        <div className={classes.bacgroundColorBlack}>
            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">
                    <Grid item md={4} sm={12}>
                        <Grid container>
                            <Grid item>
                                <img src={logoUrl} alt="Kleep" className={classes.logoStyle} style={{ marginTop: '-35px' }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={4} sm={12}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                            spacing={1}
                            style={{ marginTop: 130 }}>
                            <Grid item>
                                <Typography variant="h6">
                                    About Kleep
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography>
                                    Features
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography>
                                    Pricing
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography>
                                    Terms and Conditions
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography>
                                    Privacy Policy
                                </Typography>
                            </Grid>

                            <Grid item>
                                <Typography>
                                    Download
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={4} sm={12}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                            spacing={1} style={{ marginTop: 160 }}>
                            <Grid item>
                                <Typography align="left" variant="h6">
                                    Resources
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography align="left">
                                    About Us
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography align="left">
                                    FAQ
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography align="left">
                                    Contact
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography align="left" variant="h6">
                                    Follow Us
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <FacebookIcon className={classes.facebookIconStyle} />
                                    </Grid>
                                    <Grid item>
                                        <InstagramIcon className={classes.instragramIconStyle} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography align="center">
                                    ® All Rights Reserved Kleep INC, 2020
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>);
}

export default Footer;