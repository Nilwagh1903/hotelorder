import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { updateDoc, doc } from "firebase/firestore";

export default function AdminPage({ setCurrentPage }) {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setOrders(list);
    });
    const markAsPaid = async (id) => {
  console.log("MARK CLICKED:", id);

  try {
    await updateDoc(doc(db, "orders", id), {
      payment: "paid"
    });
    console.log("UPDATED TO PAID");
  } catch (err) {
    console.log("PAY UPDATE ERROR:", err);
  }
};



    return () => unsubscribe();
  }, []);
return (
  <div className="min-h-screen bg-black text-white p-6">
    <h1 className="text-2xl font-bold text-center mb-6">
      Admin Orders Dashboard
    </h1>

    <div className="grid gap-4">
      {orders.map(order => (
        <div key={order.id} className="p-4 bg-gray-800 rounded border border-gray-600">
          
          <p><b>User:</b> {order.userPhone}</p>
          <p><b>Table:</b> {order.tableNumber}</p>
          <p><b>Total:</b> ₹{order.total}</p>
          <p><b>Status:</b> {order.status}</p>

          <p>
            <b>Payment:</b>{" "}
            {order.payment === "paid" ? (
              <span className="text-green-400">Paid</span>
            ) : (
              <span className="text-yellow-400">Pending</span>
            )}
          </p>

          {/* Button show only if pending */}
          {order.payment !== "paid" && (
            <button
              onClick={() => markAsPaid(order.id)}
              className="mt-3 bg-green-600 px-4 py-2 rounded"
            >
              Mark as Paid
            </button>
          )}

        </div>
      ))}
    </div>

    <div className="text-center mt-6">
      <button
        onClick={() => setCurrentPage("home")}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Back to Home
      </button>
    </div>

  </div>
);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-2xl font-bold text-center mb-4">Admin Dashboard</h1>

      <button
        onClick={() => setCurrentPage("home")}
        className="bg-gray-700 px-4 py-2 rounded mb-4"
      >
        Back to Home
      </button>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>No orders yet…</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border p-3 rounded bg-gray-800">
              <p><b>User:</b> {order.phone}</p>
              <p><b>Table:</b> {order.table}</p>
              <p><b>Total:</b> ₹{order.total}</p>
              <p><b>Status:</b> {order.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
