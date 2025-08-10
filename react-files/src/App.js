import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

// Components
import Header from "./components/Header";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      {user && <Header />}
      <Routes>
        {/* Root route redirects based on login status */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/courses/:id"
          element={user ? <CoursePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/courses"
          element={user ? <Courses /> : <Navigate to="/login" />}
        />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}