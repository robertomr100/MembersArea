import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Typography, Box, Container } from '@material-ui/core';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import { PersonalInfo, BillingInformation, Footer, Header } from 'components';

import { auth,db } from '../../firebase';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginLeft: 20,
        // height: '70vh'
    },
}));

const Home = ({ setLoggedIn }) => {

    const initialPersonInfo = {
        name: '',
        email: '',
        password: ''
    };

    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [loader, setLoader] = React.useState(true);

    const [person, setPerson] = useState(initialPersonInfo);
    const [disablePersonal, setDisablePersonal] = useState(true);


    const handleChangePersonal = ({ target: { name, value } }) => {
        setDisablePersonal(false);
        setPerson({
            ...person, [name]: value
        })
    }

    useEffect(() => {

        fetchCurrentUserInfo();

    }, []);

    const fetchCurrentUserInfo = async () => {

        try {
            const { uid } = await auth.currentUser;
            const response = await db
                .collection(uid)
                .doc('Profile')
                .get();

            const result = response.data();
            console.log(result)
            !result ? setPerson(initialPersonInfo) : setPerson(result);
            setLoader(false);
        } catch (ex) {

            if (ex && ex.message) {
                const [errorMsg] = ex.message.split('.');
                console.log(errorMsg);
            }
        }

    }


    const handlePersonalSubmit = async () => {

        try {

            const { emailVerified } = person;

            var user = await auth().currentUser;
            console.log('current user', user);

            const { email, password } = person;
            if (!emailVerified) {
                await user.updateEmail(email);
                await user.updatePassword(password);
            }

            await db
                
                .doc(user.uid)
                .set(person);

            setDisablePersonal(true);
            fetchCurrentUserInfo();

        } catch (ex) {

            if (ex && ex.message) {
                const [errorMsg] = ex.message.split('.');
                console.log(errorMsg);
            }
        }

    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    if (loader) {
        return <p>Loading .... </p>
    }

    return (
        <Fragment>
            <Header setLoggedIn={setLoggedIn} />
            <Container maxWidth="lg">
                <div className={classes.root}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Personal Information" {...a11yProps(0)} />
                            <Tab label="Billing Information" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            <PersonalInfo
                                person={person}
                                disable={disablePersonal}
                                onSubmit={handlePersonalSubmit}
                                onChange={handleChangePersonal} />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <BillingInformation />
                        </TabPanel>
                    </SwipeableViews>
                </div>
            </Container>
            <Footer />
        </Fragment>);
}

export default Home;