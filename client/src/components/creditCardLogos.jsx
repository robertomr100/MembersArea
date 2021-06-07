import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const cardsLogo = [
  // "amex",
  // "cirrus",
  // "diners",
  // "dankort",
  // "jcb",
  // "maestro",
  "visa",
  "discover",
  "mastercard",
  "amex"

  // "visaelectron",
];

const Logos = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
        <Grid container spacing={3}>
        <Grid   item >
        <Typography variant="caption" gutterBottom>
        We are fully compliant with Payment Card Industry Data Security Standards.
        </Typography>
          </Grid>
        </Grid>
      <Grid container spacing={3}>
      {cardsLogo.map((e) => (
        <Grid key={e}  item >
            <img
              src={`./cards/${e}.png`}
              alt={e}
              width="80px"
              align="bottom"
              style={{ padding: "0 5px" }}
            />
         
        </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Logos;
