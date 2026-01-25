import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const placeOrder = async (phone, table, items, total) => {
  const orderData = {
    phone,
    table,
    items,
    total,
    status: "new",
    paymentStatus: "pending",
    createdAt: serverTimestamp()
  };

  await addDoc(collection(db, "kitchenOrders"), orderData);
  return true;
};
