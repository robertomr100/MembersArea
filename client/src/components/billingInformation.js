import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Box,Row } from "@material-ui/core";
import Subscriptions from "./Subscriptions";
import Customers from "./Customers";
import Plan from './plan';
import Logos from './creditCardLogos';
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

const BilingInformation = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
         {/* <Plan/>
         <Logos/> */}
          {/* <Customers/>  */}
         <Subscriptions/>
        </Grid>
       
      </Grid>
    </div>
  );
};

export default BilingInformation;
