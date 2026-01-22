// src/services/kitchenService.js

import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export const updateOrderStatus = async (phone, orderId, status) => {
  await updateDoc(
    doc(db, "users", phone, "orders", orderId),
    {
      status
    }
  );
};

export const updatePaymentStatus = async (phone, orderId, paymentStatus) => {
  await updateDoc(
    doc(db, "users", phone, "orders", orderId),
    {
      payment: paymentStatus
    }
  );
};
