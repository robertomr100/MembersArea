import { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { auth } from './firebase';
import AllRoutes from 'routes';

function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);

  function getCurrentUser() {
    auth.onAuthStateChanged((user) => {
      if (!!user) {
        setLoggedIn(true);
      }
    });
  };

  useEffect(() => {

    getCurrentUser();

  }, [])

  return (
    <Fragment>
      <Router>
        <AllRoutes isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
      </Router>
    </Fragment>
  );
}

export default App;
