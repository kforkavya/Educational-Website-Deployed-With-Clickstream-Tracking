import React from "react";
import { auth } from "./firebase";

export default function Dashboard() {
  const user = auth.currentUser;

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Welcome to your Dashboard!</h1>
      {user && <p>Logged in as: <strong>{user.email}</strong></p>}
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Log Out
      </button>
    </div>
  );
}