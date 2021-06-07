import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { SignUp, SignIn } from 'pages/auth';

const PublicRoutes = ({ setLoggedIn }) => {
    return (
        <Switch>
            <Route path='/' exact component={() => <SignIn setLoggedIn={setLoggedIn} />} />
            <Route path='/register' component={() => <SignUp setLoggedIn={setLoggedIn} />} />
        </Switch>
    )
}

export default PublicRoutes;