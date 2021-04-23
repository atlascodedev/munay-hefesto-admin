import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const firebaseConfig = require("../../firebase-config.json").results.sdkConfig;
const firebase = app.initializeApp(firebaseConfig);

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
