import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#fafafa',
      main: '#25c296',
      dark: '#25c296',
      contrastText: 'white',
    },
    secondary: {
      light: '#ff7961',
      main: '#4884fa',
      dark: '#3b5988',
      contrastText: '#ffffff',
    },
    typography: {
      fontSize: '1.2rem',
      fontFamily: ['Montserrat', 'sans-serif'].join(','),
    },
  },
});
export const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_KEY
);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <ToastContainer />
    <Elements stripe={stripePromise}>
      <App />
      </Elements>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
