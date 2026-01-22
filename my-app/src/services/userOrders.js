// src/services/userOrders.js

import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export const getUserOrders = async (phone) => {
  const q = query(
    collection(db, "users", phone, "orders"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
