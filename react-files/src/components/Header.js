import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="site-title">My Learning Platform</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/courses">Courses</Link>
        </nav>
      </div>
      <div className="header-right">
        {user && (
          <>
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}