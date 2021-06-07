"use strict";
import * as functions from "firebase-functions";
import express, { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import cors from "cors";

import { createPaymentIntent } from "./payments";
import {
  createSetupIntent,
  listPaymentMethods,
  deleteCard,
  detachePaymentMethod,
} from "./customers";
import {
  createSubscription,
  cancelSubscription,
  listSubscriptions,
} from "./billing";
import { handleStripeWebhook } from "./webhooks";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:8000",
  "https://kleep-86262.web.app",
  "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop",
  "http://members.kleep.io.",
  "https://members.kleep.io.",
  
];

// Allows cross origin requests

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      // return callback(null, true);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

//app.use(cors({origin: true}));

// Sets rawBody for webhook handling
app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

// Decodes the Firebase JSON Web Token
app.use(decodeJWT);

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

//app.use(cookieParser);
app.get("/hello", (req, res) => {
  // @ts-ignore
  res.send(`Hello ${req.user.name}`);
});

/**
 * Validate the stripe webhook secret, then call the handler for the event type
 */
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Website you wish to allow to connect
    res.header("Access-Control-Allow-Origin", "https://kleep-86262.web.app");

    // Request methods you wish to allow
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header("Access-Control-Allow-Credentials", "true");
    // single field is set
    res.header("content-type", "application/json");
    callback(req, res, next).catch(next);
  };
}

/**
 * Throws an error if the currentUser does not exist on the request
 */
function validateUser(req: Request) {
  const user = req["currentUser"];
  if (!user) {
    throw new Error(
      "You must be logged in to make this request. i.e Authroization: Bearer <token>"
    );
  }

  return user;
}

/**
 * Payment Intents API
 */

// Create a PaymentIntent
app.post(
  "/payments",
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createPaymentIntent(body.amount));
  })
);

/**
 * Customers and Setup Intents
 */

// Save a card on the customer record with a SetupIntent
app.post(
  "/wallet",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  })
);

// Retrieve all cards attached to a customer
app.get(
  "/wallet",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet.data);
  })
);

// Delete card attached to a customer
app.delete(
  "/wallet",
  runAsync(async (req: Request, res: Response) => {
    console.log(req);
    const user = validateUser(req);

    const wallet = await deleteCard(user.uid, req.params.id);
    res.send(wallet);
  })
);

// Detache payment Method from a customer
app.post(
  "/wallet/detache-card",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { payment_method } = req.body;
    const wallet = await detachePaymentMethod(user.uid, payment_method);
    res.send(wallet);
  })
);

/**
 * Billing and Recurring Subscriptions
 */

// Create a and charge new Subscription
app.post(
  "/subscriptions/",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { plan, payment_method } = req.body;
    const subscription = await createSubscription(
      user.uid,
      plan,
      payment_method
    );
    if (subscription === "404") {
      res
        .send(
          "Customer already subscribed to a plan!! Please cancel existing one"
        )
        .status(500);
    } else {
      res.send(subscription);
    }
  })
);

// Get all subscriptions for a customer
app.get(
  "/subscriptions/",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);

    const subscriptions = await listSubscriptions(user.uid);

    res.send(subscriptions.data);
  })
);

// Unsubscribe or cancel a subscription
app.patch(
  "/subscriptions/:id",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    res.send(await cancelSubscription(user.uid, req.params.id));
  })
);

/**
 * Webhooks
 */

// Handle webhooks
app.post("/hooks", runAsync(handleStripeWebhook));

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
export const api = functions.https.onRequest(app);
