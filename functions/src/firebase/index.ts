import app from "firebase-admin";

const admin = app.initializeApp();

export const bucket = admin.storage().bucket();
export const db = admin.firestore();

if (process.env.NODE_ENV !== "production") {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

export default admin;
