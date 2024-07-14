import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtQ35xRivBhVeW66ibSgTgd-N2o6OGsrA",
  authDomain: "bank-login-23967.firebaseapp.com",
  projectId: "bank-login-23967",
  storageBucket: "bank-login-23967.appspot.com",
  messagingSenderId: "735223576389",
  appId: "1:735223576389:web:1c8d35d64bae8b63b8f02c",
  measurementId: "G-S9CDBBGDY4"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)