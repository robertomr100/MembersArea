import React, { useState, useEffect, Suspense } from "react";
import { fetchFromAPI } from ".././utils/helpers";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { db, auth } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Box, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { SignOut } from "./Customers";
import { toast } from "react-toastify";
import SignIn from "./../pages/auth/login";
import Customers from "./Customers";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing(3, 1, 2, 1),
    borderRadius: 25,
    fontSize: 12,
    textTransform: "none",
    // backgroundColor: theme.palette.secondary.contrastText,
    // color: theme.palette.primary.light,
  },
}));

function UserData(props) {
  const [data, setData] = useState({});

  // Subscribe to the user's data in Firestore
  useEffect(() => {
    const unsubscribe = db
      .collection(props.user.uid)
      .doc("Profile")
      .onSnapshot((doc) => setData(doc.data()));
    return () => unsubscribe();
  }, [props.user]);

  return (
    <pre>
      Stripe Customer ID: {data.stripeCustomerId} <br />
      Subscriptions: {JSON.stringify(data.activePlans || [])}
    </pre>
  );
}

function SubscribeToPlan(props) {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();
  const user = auth.currentUser;

  const [plan, setPlan] = useState();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Get current subscriptions on mount
  useEffect(() => {
    getSubscriptions();
  }, [user]);

  //SetSelected Plan Id from saved cards
  const handleChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setSelectedPaymentMethod(event.target.value);
  };
  // Fetch current subscriptions from the API
  const getSubscriptions = async () => {
    if (user) {
      const subs = await fetchFromAPI("subscriptions/", { method: "GET" });
      console.log(subs)
      setSubscriptions(subs);
    }
  };

  //Detache a payment method
  const detachePaymentMethod = async () => {
    if (user) {
      const paymentMethods = await fetchFromAPI("wallet/detache-card", {
        body: {
          payment_method: selectedPaymentMethod,
        },
      });

      console.log(paymentMethods);
    }
  };

  // Cancel a subscription
  const cancel = async (id) => {
    setLoading(true);
    setOpen(false);
    await fetchFromAPI("subscriptions/" + id, { method: "PATCH" });
    toast.info("canceled!");
    await getSubscriptions();
    setLoading(false);
  };

  // Handle the submission of card details
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (selectedPaymentMethod === undefined) {
      const cardElement = elements.getElement(CardElement);
      // Create Payment Method
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
    }
    // Create Subscription on the Server
    const subscription = await fetchFromAPI("subscriptions", {
      body: {
        plan,
        payment_method: selectedPaymentMethod,
      },
    });

    // The subscription contains an invoice
    // If the invoice's payment succeeded then you're good,
    // otherwise, the payment intent must be confirmed

    const { latest_invoice } = subscription;
    console.log(subscription.status);
    if (latest_invoice.payment_intent) {
      const { client_secret, status } = latest_invoice.payment_intent;

      if (status === "requires_action") {
        const { error: confirmationError } = await stripe.confirmCardPayment(
          client_secret
        );
        if (confirmationError) {
          console.error(confirmationError);
          toast.error("unable to confirm card");
          return;
        }
      }

      // success
      toast.success("You are subscribed!");
      getSubscriptions();
    }

    setLoading(false);
    setPlan(null);
  };

  return (
    <div className={classes.root}>
      <Customers
        selectedPaymentMethod={selectedPaymentMethod}
        paymentMethodChange={handleChange}
      />
      <div className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Current Plan
        </Typography>
        <Button
          size="small"
          // disabled={
          //   plan === "price_1IdQBLC1bIew0LJro37Lt6ol" ? "false" : "true"
          // }
          color="primary"
          variant={
            plan === "price_1IdQBLC1bIew0LJro37Lt6ol" ? "contained" : "outlined"
          }
          className={classes.button}
          onClick={() => setPlan("price_1IdQBLC1bIew0LJro37Lt6ol")}
        >
          Monthly $2.99/m
        </Button>
        <Button
          size="small"
          // disabled={
          //   plan === "price_1IdPkHC1bIew0LJr1oyuWZjt" ? "false" : "true"
          // }
          color="primary"
          variant={
            plan === "price_1IdPkHC1bIew0LJr1oyuWZjt" ? "contained" : "outlined"
          }
          className={classes.button}
          onClick={() => setPlan("price_1IdPkHC1bIew0LJr1oyuWZjt")}
        >
          Yearly $24/y
        </Button>
        {!plan ? (
          <Typography variant="subtitle1" gutterBottom>
            Selected Plan: <strong>Free-Trial</strong>
          </Typography>
        ) : (
          <Typography variant="h6" gutterBottom>
            Selected Plan:
            {/* <strong>{plan}</strong> */}
          </Typography>
        )}
      </div>
      <div className={classes.root}>
      {
        !plan ? (
          <List dense="true">
          {/* <ListItem>
            <ListItemText primary={plan} secondary={null}>
            </ListItemText>
          </ListItem> */}
          <ListItem>
            <ListItemText
              primary=" 1 Month Free-Trial"
              secondary={null}
            ></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary=" Unlimited storage (Cloud Based)"
              secondary={null}
            ></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Keyword and date based search"
              secondary={null}
            ></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Unlimited Folders"
              secondary={null}
            ></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Multi-copy pasting"
              secondary={null}
            ></ListItemText>
          </ListItem>
        </List>
        ):plan === "price_1IdQBLC1bIew0LJro37Lt6ol" ?
        (  
        <List dense="true">
        <ListItem>
          <ListItemText primary={"For 1 Month"} secondary={null}>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary=" Unlimited storage (Cloud Based)"
            secondary={null}
          ></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Keyword and date based search"
            secondary={null}
          ></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Unlimited Folders"
            secondary={null}
          ></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Multi-copy pasting"
            secondary={null}
          ></ListItemText>
        </ListItem>
      </List>) : plan==="price_1IdPkHC1bIew0LJr1oyuWZjt" ?
      (
        <List dense="true">
        <ListItem>
          <ListItemText primary={"For 12 Months"} secondary={null}>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary=" Unlimited storage (Cloud Based)"
            secondary={null}
          ></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Keyword and date based search"
            secondary={null}
          ></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Unlimited Folders"
            secondary={null}
          ></ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Multi-copy pasting"
            secondary={null}
          ></ListItemText>
        </ListItem>
      </List>
      ):""
      }
      </div>

      

      <Button
        color="primary"
        size="small"
        onClick={handleSubmit}
        className={classes.button}
        variant={!plan ? "outlined" : "contained"}
        disabled={!plan || !selectedPaymentMethod}
      >
        Subscribe & Pay
      </Button>
      <div className={classes.root}>
        <Typography variant="h6" gutterBottom>
          Current Subscription
        </Typography>

        {subscriptions.map((sub) => (
          <div key={sub.id}>
            { `Plan: ${sub.plan.interval}`}
            <Typography>
            Next payment of ${sub.plan.amount / 100} due{" "}
            {new Date(sub.current_period_end * 1000).toLocaleDateString("en-US")}
            </Typography>
            <Box>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleClickOpen}
                disabled={loading}
              >
                Cancel Plan
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Do you want to cancel subscription?"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    No
                  </Button>
                  <Button
                    onClick={() => cancel(sub.id)}
                    color="primary"
                    autoFocus
                  >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Subscriptions() {
  return (
    <Suspense fallback={"loading user"}>
      <SubscribeToPlan />
    </Suspense>
  );
}
