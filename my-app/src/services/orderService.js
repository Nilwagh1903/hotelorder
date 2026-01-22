import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const placeOrder = async (phone, table, items, total) => {
  return await addDoc(
    collection(db, "orders"),  // users/{phone} नको, direct orders ठेऊ
    {
      phone,
      table,
      items,
      total,
      status: "received",
      paymentStatus: "pending",  // 👈 new field
      createdAt: serverTimestamp()
    }
  );
};
