import { db } from "../firebase";
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

  // Save order for user history
  await addDoc(collection(db, "users", phone, "orders"), orderData);

  // Mirror order into kitchenOrders for display
  await addDoc(collection(db, "kitchenOrders"), orderData);

  return true;
};
