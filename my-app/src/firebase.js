// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "rajhans-hotel-78e76",
  appId: "1:420427933110:web:aa1d871224c4e5e9000d17",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
