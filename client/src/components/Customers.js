import React, { useState, useEffect, Suspense } from "react";
import { fetchFromAPI } from "../utils/helpers";
import { Grid, Typography, Box, Row, Button } from "@material-ui/core";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { toast } from "react-toastify";
import { db, auth } from "../firebase";
import { SignIn } from "pages/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 330,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.light,
  },
  btnPrimary: {
    margin: theme.spacing(3, 1, 2, 1),
    borderRadius: 20,
    textTransform: "none",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.light,
  },
  btnRed: {
    margin: theme.spacing(3, 1, 2, 1),
    borderRadius: 25,
    fontSize: 12,
    textTransform: "none",
    backgroundColor: '#f44336',
    color: theme.palette.primary.light,
  },
}));

export function SignOut(props) {
  return (
    props.user && (
      <button
        className="btn btn-outline-secondary"
        onClick={() => auth.signOut()}
      >
        Sign Out User {props.user.uid}
      </button>
    )
  );
}

const SaveCard = ({ paymentMethodChange, selectedPaymentMethod, ...props }) => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();
  const user = auth.currentUser;
  const [selectedCard, setSelectdCard] = useState();
  const [setupIntent, setSetupIntent] = useState();
  const [wallet, setWallet] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Get the user's wallet on mount
  useEffect(() => {
    getWallet();
  }, [user, selectedPaymentMethod]);

  // Create the setup intent
  const createSetupIntent = async (event) => {
    const si = await fetchFromAPI("wallet");
    setSetupIntent(si);
  };

  // Handle the submission of card details
  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    // Confirm Card Setup
    const {
      setupIntent: updatedSetupIntent,
      error,
    } = await stripe.confirmCardSetup(setupIntent.client_secret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSetupIntent(updatedSetupIntent);
      await getWallet();
      toast.success("Success! Card added to your wallet!");
    }
  };

  const getWallet = async () => {
    if (user) {
      const paymentMethods = await fetchFromAPI("wallet", { method: "GET" });
      setWallet(paymentMethods);
      console.log(paymentMethods);
    }
  };

  //Detache a payment method
  const detachePaymentMethod = async () => {
    setOpen(false);
    if (user) {
      const paymentMethods = await fetchFromAPI("wallet/detache-card", {
        body: {
          payment_method: selectedPaymentMethod,
        },
      });

      toast.info("Card Deleted!");
      console.log(paymentMethods);
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Your Cards
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Cards</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedPaymentMethod}
          onChange={paymentMethodChange}
        >
          {wallet.map((paymentSource) => {
            console.log(paymentSource);
            const { last4, brand, exp_month, exp_year } = paymentSource.card;
            return (
              <MenuItem key={paymentSource.id} value={paymentSource.id}>
                {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <div className={classes.root}>
        <Button
          size="small"
          className={classes.button}
          variant="contained"
          onClick={createSetupIntent}
          hidden={setupIntent}
        >
          Add Card
        </Button>
        <Button
          size="small"
          className={classes.btnRed}
          variant="contained"
          onClick={handleClickOpen}
          // onClick={detachePaymentMethod}
        >
          Delete Card
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure,you want to remove this card ?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={detachePaymentMethod} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <form
        onSubmit={handleSubmit}
        className={classes.root}
        hidden={!setupIntent || setupIntent.status === "succeeded"}
      >
        <Typography component="h6" variant="h6" gutterBottom>
          Add a Payment Method
        </Typography>

        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
                ":-webkit-autofill": {
                  color: "#fce883",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <Button size="small" className={classes.btnPrimary} type="submit">
          Add Card
        </Button>
      </form>
    </div>
  );
};



export default function Customers({
  paymentMethodChange,
  selectedPaymentMethod,
}) {
  return (
    <Suspense fallback={"loading user"}>
      <SaveCard
        selectedPaymentMethod={selectedPaymentMethod}
        paymentMethodChange={paymentMethodChange}
      />
    </Suspense>
  );
}
