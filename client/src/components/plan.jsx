import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Box, Button } from "@material-ui/core";

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
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    
  },
}));

const Plan = ({plan,...props}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Box mt={1}>
            <Typography align="center" variant="h6" gutterBottom>
              Current Plan:
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box mt={1}>
            <Typography align="center" variant="h6" gutterBottom>
              {plan}
            </Typography>
          </Box>{" "}
        </Grid>
        <Grid item xs={4}>
          <Box mt={1}>
            <Button size="small" className={classes.button}>Upgrade</Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Plan;
