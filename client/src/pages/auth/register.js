import React, { useState } from 'react';
import {
    Button,
    CssBaseline, TextField,
    Grid, Typography,
    makeStyles, Container, Paper,
    Box
} from '@material-ui/core';

import { Link, useHistory } from 'react-router-dom';


import { auth,db } from '../../firebase';


const useStyles = makeStyles((theme) => ({
    root: {
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        marginTop: theme.spacing(14),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 70,
        paddingTop: 30
    },
    container: {
        margin: '-61px',
        paddingBottom: 81,
        borderRadius: 25
    },
    googleAvatar: {
        margin: theme.spacing(1),
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.primary.light,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        cursor: 'pointer'
    },
    facebookAvatar: {
        margin: theme.spacing(1),
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.primary.light,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        cursor: 'pointer'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        borderRadius: 25,
        padding: 10,
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.light,
        letterSpacing: 4
    },
    forgetTextStyle: {
        marginTop: 12,
        color: theme.palette.secondary.contrastText,
        textDecoration: 'none'
    },
    signUpTextStyle: {
        marginLeft: 5,
        marginTop: 12,
        textDecoration: 'none !important',
        fontStyle: 'bold'
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

const SignUp = ({ setLoggedIn }) => {

    const initialSignUpObj = {
        name: '',
        email: '',
        password: '',
        emailVerified: false
    }

    const classes = useStyles();
    const history = useHistory();
    const [signUp, setSignUp] = useState(initialSignUpObj);

    const handleChange = ({ target: { name, value } }) => {
        setSignUp({ ...signUp, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { email, password } = signUp;
            const response = await auth.createUserWithEmailAndPassword(email, password);
            const { user: { uid } } = response
            console.log(response, uid);
            await db.
                collection(uid)
                .doc('Profile')
                .set({
                    ...signUp,
                });

            setLoggedIn(true);
            history.push('/');
        } catch (ex) {
            if (ex && ex.message) {
                const [errorMsg] = ex.message.split('.');
                console.log(errorMsg);
            }
        }
    }


    return (
        <div className={classes.root}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper elevation={3} square={false} className={classes.container}>
                    <div className={classes.paper}>
                        <Typography component="h4" variant="h4">
                            Sign Up
                        </Typography>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={signUp.name}
                                onChange={handleChange}
                                autoComplete={false}
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                name="email"
                                value={signUp.email}
                                onChange={handleChange}
                                autoComplete={false}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                value={signUp.password}
                                onChange={handleChange}
                                name="password"
                                label="Password"
                                type="password"
                                autoComplete={false}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleSubmit}
                            >
                                Sign up
                        </Button>
                            <Grid
                                container
                                direction="column"
                                justify="space-between"
                                alignItems="center">
                                <Grid item>
                                    <Box mt={3}>
                                        <Typography variant="body2" align="center">
                                            Do you have already an account? <Link to="/" variant="h5" className={classes.signUpTextStyle}> Sign In</Link>
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Paper>
            </Container>
        </div>
    );
}

export default SignUp;