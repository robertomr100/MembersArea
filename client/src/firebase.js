import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STRORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_DATABASE_MESSAGEING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_DATABASE_APP_ID
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();


