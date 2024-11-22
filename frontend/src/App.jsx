import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"; // Import Navigate for redirecting
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AboutPage from "./pages/AboutPage";
import Profile from "./pages/UserProfile";
import { checkAuth } from "./services/api";
import Logout from "./pages/Logout";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect to check if user is authenticated
  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await checkAuth();
      setUser(authenticatedUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleLogout = async () => {
    await logoutUser(); // Call the API to log the user out
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            user && user.role === "Admin" ? (
              <SignUp />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/admin-dashboard" /> : <Login />}
        />
        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/admin-dashboard"
          element={
            user && user.role === "Admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/user-dashboard"
          element={
            user && user.role != "Admin" ? (
              <UserDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/manager-dashboard"
          element={user ? <ManagerDashboard /> : <Navigate to="/login" />}
        />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />

        {/* Catch-all Route for 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
