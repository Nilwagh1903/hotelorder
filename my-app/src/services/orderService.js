import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const placeOrder = async (customerName, phone, table, items, total) => {
  return await addDoc(
    collection(db, "kitchenOrders"),
    {
      customerName,
      phone,
      table,
      items,
      total: Number(total) || 0,   // <-- FIXED HERE
      status: "received",
      paymentStatus: "pending",
      billPaid: false,
      createdAt: serverTimestamp()
    }
  );
};
