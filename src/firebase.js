import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Encrypted Firebase credentials
const REACT_APP_FIREBASE_API_KEY = "BJ{bTzCojnx`woWCerUe9PsvpyU3VIXyI.dj5Od";
const REACT_APP_FIREBASE_AUTH_DOMAIN = "hvoepkvt.qspe/gjsfcbtfbqq/dpn";
const REACT_APP_FIREBASE_DATABASE_URL =
  "iuuqt;00hvoepkvt.qspe.efgbvmu.suec/btjb.tpvuifbtu2/gjsfcbtfebubcbtf/bqq";
const REACT_APP_FIREBASE_PROJECT_ID = "hvoepkvt.qspe";
const REACT_APP_FIREBASE_STORAGE_BUCKET = "hvoepkvt.qspe/bqqtqpu/dpn";
const REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ":43279::131:";
const REACT_APP_FIREBASE_APP_ID = "2;:43279::131:;xfc;25geg8c4ef97cd987gdb11";

function decryptShiftedAscii(text) {
  return Array.from(text)
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
    .join("");
}

// Firebase credentials
const firebaseConfig = {
  apiKey: decryptShiftedAscii(REACT_APP_FIREBASE_API_KEY),
  authDomain: decryptShiftedAscii(REACT_APP_FIREBASE_AUTH_DOMAIN),
  databaseURL: decryptShiftedAscii(REACT_APP_FIREBASE_DATABASE_URL),
  projectId: decryptShiftedAscii(REACT_APP_FIREBASE_PROJECT_ID),
  storageBucket: decryptShiftedAscii(REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: decryptShiftedAscii(
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: decryptShiftedAscii(REACT_APP_FIREBASE_APP_ID),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const storage = getStorage(app);
export const database = getDatabase(app);
export default app;


