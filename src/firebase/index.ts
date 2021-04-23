import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import config from "../config/firebase.config";

const firebase = app.initializeApp({
  apiKey: "AIzaSyAAHadVAUzTBODDFScQwbupxM8RqWzQt_c",
  authDomain: "munay-nextjs-hefesto.firebaseapp.com",
  projectId: "munay-nextjs-hefesto",
  storageBucket: "munay-nextjs-hefesto.appspot.com",
  messagingSenderId: "935545228005",
  appId: "1:935545228005:web:cae2d01abd175776ffa20c",
  measurementId: "G-Q6GGYPRL0K",
});

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const fieldValues = app.firestore.FieldValue;

if (process.env.NODE_ENV !== "production") {
  db.useEmulator("localhost", 8080);

  console.log(
    "Running local instance of Firestore, data will not persist to production database"
  );
}

// db.enablePersistence({
//   synchronizeTabs: true,
// });

export default firebase;
