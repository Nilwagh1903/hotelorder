import React, { useState } from "react";

export default function AdminLogin({ setCurrentPage }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "1234") {
      setCurrentPage("adminPage");
    } else {
      alert("Invalid ID or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg space-y-4 w-80 text-center">
        <h1 className="text-xl font-bold">Admin Login</h1>

        <input
          type="text"
          placeholder="Admin ID"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 py-2 rounded mt-2"
        >
          Login
        </button>

        <button
          onClick={() => setCurrentPage("home")}
          className="w-full bg-gray-600 py-2 rounded mt-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
