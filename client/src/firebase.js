import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOkxJ1W97o1GhG5ZpIjS0sOoOKzNdb-Iw",
  authDomain: "ecart-c384b.firebaseapp.com",
  projectId: "ecart-c384b",
  storageBucket: "ecart-c384b.firebasestorage.app",
  messagingSenderId: "376857551271",
  appId: "1:376857551271:web:d8a6285ba913c0424a1682",
  measurementId: "G-V60B03YB61",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider =
  new GoogleAuthProvider();