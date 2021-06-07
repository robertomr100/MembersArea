import React from 'react';

import { Switch, Route } from 'react-router-dom';

import { Home } from 'pages';

const Auth = ({ setLoggedIn }) => {
    return (
        <Switch>
            <Route path='/' exact component={() => <Home setLoggedIn={setLoggedIn} />} />
        </Switch>
    )
}

export default Auth;