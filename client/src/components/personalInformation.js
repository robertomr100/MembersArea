import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Typography, Box, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const PersonalInfo = ({ person, disable, onChange, onSubmit }) => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Box mt={1}>
                        <Typography
                            align="center"
                            variant="subtitle1"
                            gutterBottom>Name
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="name"
                        label="Name"
                        value={person.name}
                        onChange={onChange}
                        fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <Box mt={1}>
                        <Typography
                            align="center"
                            variant="subtitle1"
                            gutterBottom>Email
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="email"
                        label="Email"
                        value={person.email}
                        onChange={onChange}
                        disabled={person.emailVerified ? true : false}
                        fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <Box mt={1}>
                        <Typography
                            align="center"
                            variant="subtitle1"
                            gutterBottom>Password
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        disabled={person.emailVerified ? true : false}
                        value={person.password}
                        onChange={onChange}
                        fullWidth />
                </Grid>
                <Grid item xs={6}>

                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={disable}
                        onClick={onSubmit}
                        fullWidth>
                        Update
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default PersonalInfo;